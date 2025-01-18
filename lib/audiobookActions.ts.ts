import { notifications } from "@mantine/notifications";
import { Howl } from "howler";
import { Audiobook } from "@/types/types";
import axiosInstance from "./axiosInstance";

export const buyAudiobook = async (
  bookId: number,
  buyingPrice: number,
  userEmail: string,
  accessToken: string | undefined
) => {
  const url = `http://127.0.0.1:8000/purchases/initiate-payment/buy/${bookId}/`;
  const callbackUrl = "https://7599-217-199-146-210.ngrok-free.app/success";

  if (!accessToken) {
    notifications.show({
      title: "Error",
      message: "Authorization token is missing.",
      color: "red",
      position: "top-right",
    });
    return;
  }

  try {
    const response = await axiosInstance.post(url, {
      amount: buyingPrice,
      email: userEmail,
      callback_url: callbackUrl,
    });

    if (response.data.redirected) {
      window.location.href = response.data.url;
      return;
    }

    if (response.data.status) {
      window.location.href = response.data.authorization_url!;
    } else {
      notifications.show({
        title: "Error",
        message: response.data.message,
        color: "red",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
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
