import { notifications } from "@mantine/notifications";
import { Howl } from "howler";
import { Audiobook } from "@/types/types";

export const buyAudiobook = async (
  bookId: number,
  buyingPrice: number,
  userEmail: string,
  accessToken: string | undefined
) => {
  const url = `http://127.0.0.1:8000/purchases/initiate-payment/buy/${bookId}/`;
  const callbackUrl = "https://7599-217-199-146-210.ngrok-free.app/success";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: buyingPrice,
        email: userEmail,
        callback_url: callbackUrl,
      }),
    });

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    const data = await response.json();

    if (data.status) {
      window.location.href = data.authorization_url!;
    } else {
      notifications.show({
        title: "Error",
        message: data.message,
        color: "red",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error(error);
    notifications.show({
      title: "Error",
      message: "Something went wrong. Please try again.",
      color: "red",
      position: "top-right",
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.red[6],
          borderColor: theme.colors.red[6],
        },
      }),
    });
  }
};

export const listenSample = (
  book: Audiobook,
  soundRef: React.MutableRefObject<Howl | null>,
  isPlaying: boolean,
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
  setAudioSampleLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!book?.audio_sample) {
    notifications.show({
      title: "Error",
      message: "No audio sample available for this book.",
      color: "red",
      position: "top-right",
    });
    return;
  }

  setAudioSampleLoading(true);

  // If sound is already initialized
  if (soundRef.current) {
    if (isPlaying) {
      soundRef.current.stop();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }

    setAudioSampleLoading(false);
    return;
  }

  // Initialize new Howl instance
  soundRef.current = new Howl({
    src: [book.audio_sample],
    html5: true,
    onplay: () => {
      setIsPlaying(true);
      setAudioSampleLoading(false);
    },
    onend: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
    onloaderror: () => {
      setAudioSampleLoading(false);
      notifications.show({
        title: "Error",
        message: "Failed to load audio sample. Please try again.",
        color: "red",
        position: "top-right",
      });
    },
    onplayerror: () => {
      setAudioSampleLoading(false);
      notifications.show({
        title: "Error",
        message: "Failed to play audio sample. Please try again.",
        color: "red",
        position: "top-right",
      });
    },
  });

  soundRef.current.play();
};
