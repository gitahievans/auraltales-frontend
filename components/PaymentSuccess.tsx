"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const session = localStorage.getItem("session");

  const storedAudiobook = localStorage.getItem("audiobookToBuy");
  const audiobook = storedAudiobook ? JSON.parse(storedAudiobook) : {};

  const access = session ? JSON.parse(session).jwt : null;

  const router = useRouter(); // Initialize the router

  console.log("session", session);
  console.log("reference", reference);

  useEffect(() => {
    if (reference) {
      // Send request to backend to verify payment
      const verifyPayment = async () => {
        try {
          const response = await axiosInstance.get(
            `/purchases/verify-payment/buy/${reference}?audiobook_id=${audiobook?.id}`
          );

          if (response.data.status === "success") {
            router.push(`/audiobooks/${audiobook?.slug}`);
          } else {
            console.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      };

      verifyPayment();
    }
  }, [reference, audiobook?.id, access, router, audiobook?.slug]);

  return (
    <div className="w-full mx-auto max-w-5xl flex items-center justify-center min-h-[70dvh]">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        Verifying Payment...
      </h1>
    </div>
  );
};

export default PaymentSuccess;
