import apiClient from "@/lib/apiClient";
import { Chapter } from "@/types/types";

export const parseDuration = (durationStr: string): number => {
  const [time] = durationStr.split(".");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const fetchMetadata = async (chapterId: number | undefined) => {
  try {
    const res = await apiClient.get(`/streaming/stream/chapter/${chapterId}/`);
    const { file_size, content_type, duration } = res.data;
    const streamingToken = res.headers["x-streaming-token"];

    console.log("[DEBUG] Metadata loaded:", {
      file_size,
      content_type,
      duration,
    });

    return { file_size, content_type, streamingToken, duration };
  } catch (error) {
    console.error("[ERROR] Failed to fetch metadata:", error);
    return null;
  }
};

interface SetupMediaSourceProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  mediaSourceRef: React.MutableRefObject<MediaSource | null>;
  sourceBufferRef: React.MutableRefObject<SourceBuffer | null>;
  chapter: Chapter | null;
  setStreamingToken: React.Dispatch<React.SetStateAction<string | null>>;
  setFileSize: React.Dispatch<React.SetStateAction<number | null>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const setupMediaSource = async ({
  audioRef,
  mediaSourceRef,
  sourceBufferRef,
  chapter,
  setStreamingToken,
  setFileSize,
  setDuration,
  setIsReady,
}: SetupMediaSourceProps): Promise<void> => {
  const audioEl = audioRef.current;
  if (!audioEl) {
    console.error("[ERROR] Audio element not found");
    return;
  }

  const mediaSource = new MediaSource();
  mediaSourceRef.current = mediaSource;
  audioEl.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener(
    "sourceopen",
    async () => {
      console.log("[DEBUG] MediaSource opened");

      const metadata = await fetchMetadata(chapter?.id);
      if (!metadata) {
        console.error("[ERROR] Metadata fetch failed");
        return;
      }

      const { content_type, streamingToken, file_size } = metadata;
      setStreamingToken(streamingToken);
      setFileSize(file_size);

      if (chapter?.duration) {
        const totalSeconds = parseDuration(chapter.duration);
        setDuration(totalSeconds);
        console.log("[DEBUG] Duration set:", totalSeconds);
      }

      try {
        const sourceBuffer = mediaSource.addSourceBuffer(content_type);
        sourceBufferRef.current = sourceBuffer;
        setIsReady(true);
      } catch (error) {
        console.error("[ERROR] Failed to create SourceBuffer:", error);
      }
    },
    { once: true }
  );
};

interface FetchAndAppendChunkProps {
  chapter: Chapter | null;
  streamingToken: string | null;
  fileSize: number | null;
  sourceBuffer: SourceBuffer | null;
  currentByteRef: React.MutableRefObject<number>;
  isFetchingRef: React.MutableRefObject<boolean>;
  mediaSourceRef: React.MutableRefObject<MediaSource | null>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setStreamingToken: React.Dispatch<React.SetStateAction<string | null>>;
  setCanPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  chunkSize: number;
}

export const fetchAndAppendChunk = async ({
  chapter,
  streamingToken,
  fileSize,
  sourceBuffer,
  currentByteRef,
  isFetchingRef,
  mediaSourceRef,
  audioRef,
  setStreamingToken,
  setCanPlay,
  setIsPlaying,
  chunkSize,
}: FetchAndAppendChunkProps): Promise<void> => {
  if (!chapter || !streamingToken || !fileSize || !sourceBuffer) {
    console.error("[ERROR] Missing required parameters", {
      chapterId: chapter?.id,
      streamingToken,
      fileSize,
      sourceBuffer,
    });
    return;
  }

  if (isFetchingRef.current) {
    console.log("[DEBUG] Already fetching a chunk, skipping...");
    return;
  }

  isFetchingRef.current = true;
  const currentByte = currentByteRef.current;
  const endByte = Math.min(currentByte + chunkSize - 1, fileSize - 1);
  console.log(
    `[DEBUG] Fetching bytes ${currentByte}-${endByte}, File Size: ${fileSize}`
  );

  if (currentByte >= fileSize) {
    console.log("[DEBUG] Current byte exceeds file size, stopping fetch");
    isFetchingRef.current = false;
    return;
  }
  if (endByte < currentByte) {
    console.error(`[ERROR] Invalid range: ${currentByte}-${endByte}`);
    isFetchingRef.current = false;
    return;
  }

  try {
    const response = await apiClient.get(
      `/streaming/stream/chapter/${chapter.id}/`,
      {
        headers: {
          Range: `bytes=${currentByte}-${endByte}`,
          "X-Streaming-Token": streamingToken,
        },
        responseType: "arraybuffer",
      }
    );

    if (!response.data) {
      console.error("[ERROR] No data received in response");
      return;
    }

    const newStreamingToken = response.headers["x-streaming-token"];
    if (newStreamingToken) {
      console.log("[DEBUG] Updating streaming token:", newStreamingToken);
      setStreamingToken(newStreamingToken);
    } else {
      console.warn("[WARN] No new streaming token in response");
    }

    const chunk = new Uint8Array(response.data);

    const appendChunk = () => {
      if (sourceBuffer.updating) {
        console.log("[DEBUG] SourceBuffer updating, waiting...");
        sourceBuffer.addEventListener("updateend", appendChunk, { once: true });
      } else {
        try {
          sourceBuffer.appendBuffer(chunk);
          console.log("[DEBUG] Chunk appended:", chunk.length);
          currentByteRef.current = endByte + 1;
          setCanPlay(true);

          audioRef.current
            ?.play()
            .then(() => {
              console.log("[DEBUG] Playback started automatically");
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error("[DEBUG] Auto-play failed", err);
            });

          if (
            endByte >= fileSize - 1 &&
            mediaSourceRef.current?.readyState === "open" &&
            !sourceBuffer.updating
          ) {
            console.log("[DEBUG] End of file reached, closing stream.");
            mediaSourceRef.current.endOfStream();
          }
        } catch (err) {
          console.error("[ERROR] Failed to append buffer:", err);
        }
      }
    };

    appendChunk();
  } catch (error) {
    console.error("[ERROR] Failed to fetch chunk:", error);
    setTimeout(() => {
      isFetchingRef.current = false;
    }, 5000);
  } finally {
    isFetchingRef.current = false;
  }
};

