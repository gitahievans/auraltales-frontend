// app/success/PaymentSuccessClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

interface PaymentState {
  status: "verifying" | "success" | "error";
  message: string;
}

const PaymentSuccessClient = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const session = localStorage.getItem("session");
  const router = useRouter();

  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: "verifying",
    message: "Verifying your payment...",
  });

  const storedAudiobook = localStorage.getItem("audiobookToBuy");
  const audiobook = storedAudiobook ? JSON.parse(storedAudiobook) : {};
  const access = session ? JSON.parse(session).jwt : null;

  useEffect(() => {
    if (reference) {
      const verifyPayment = async () => {
        try {
          // Add a small delay for better UX (shows the beautiful loading state)
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const response = await apiClient.get(
            `/purchases/verify-payment/${reference}?audiobook_id=${audiobook?.id}`
          );

          if (response.data.status === "success") {
            setPaymentState({
              status: "success",
              message: "Payment successful! Redirecting to your audiobook...",
            });

            // Delay redirect to show success animation
            setTimeout(() => {
              router.push(`/audiobooks/${audiobook?.slug}`);
            }, 2000);
          } else {
            setPaymentState({
              status: "error",
              message: "Payment verification failed. Please contact support.",
            });
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          setPaymentState({
            status: "error",
            message:
              "Something went wrong. Please try again or contact support.",
          });
        }
      };

      verifyPayment();
    }
  }, [reference, audiobook?.id, access, router, audiobook?.slug]);

  const renderVerifyingState = () => (
    <div className="text-center space-y-8">
      {/* Animated Loading Spinner */}
      <div className="relative">
        <div className="w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div
            className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animate-reverse"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>

      {/* Pulsing Payment Icon */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Verifying Payment
        </h1>
        <p className="text-xl text-gray-300 max-w-md mx-auto">
          We are confirming your purchase of{" "}
          <span className="font-semibold text-white">
            {audiobook?.title || "your audiobook"}
          </span>
        </p>
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Success Animation */}
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
          <svg
            className="w-16 h-16 text-white animate-check-draw"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-gradient-to-r ${
                i % 4 === 0
                  ? "from-yellow-400 to-orange-500"
                  : i % 4 === 1
                  ? "from-pink-400 to-red-500"
                  : i % 4 === 2
                  ? "from-blue-400 to-indigo-500"
                  : "from-green-400 to-emerald-500"
              } animate-confetti rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Payment Successful! 🎉
        </h1>
        <p className="text-xl text-gray-300 max-w-lg mx-auto">
          Congratulations! You now own{" "}
          <span className="font-semibold text-white">{audiobook?.title}</span>
        </p>
        <p className="text-lg text-gray-400">
          Redirecting you to start listening...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mx-auto bg-gray-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full animate-progress"></div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-shake">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-red-400">
          Oops! Something went wrong
        </h1>
        <p className="text-xl text-gray-300 max-w-md mx-auto">
          {paymentState.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {paymentState.status === "verifying" && renderVerifyingState()}
        {paymentState.status === "success" && renderSuccessState()}
        {paymentState.status === "error" && renderErrorState()}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
        .animate-check-draw {
          animation: check-draw 0.6s ease-out 0.4s both;
        }
        .animate-confetti {
          animation: confetti linear;
        }
        .animate-progress {
          animation: progress 2s ease-out;
        }
        .animate-shake {
          animation: shake 0.6s ease-out;
        }
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessClient;
