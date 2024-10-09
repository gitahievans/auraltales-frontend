"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const session = localStorage.getItem("session");

  const storedAudiobook = localStorage.getItem("audiobookToBuy");
  const audiobook = storedAudiobook ? JSON.parse(storedAudiobook) : {};

  const access = session ? JSON.parse(session).jwt : null;

  console.log("session", session);  
  // console.log("audiobook", audiobook);
  console.log("reference", reference);

  useEffect(() => {
    if (reference) {
      // Send request to backend to verify payment
      fetch(
        `http://127.0.0.1:8000/purchases/verify-payment/buy/${reference}?audiobook_id=${audiobook?.id}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            // Handle successful payment
            console.log("Payment verified successfully:", data);
          } else {
            // Handle failed verification
            console.error("Payment verification failed");
          }
        });
    }
  }, [reference]);

  return (
    <div className="w-full mx-auto max-w-5xl flex items-center justify-center min-h-[70dvh]">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        Verifying Payment...
      </h1>
    </div>
  );
};

export default PaymentSuccess;
