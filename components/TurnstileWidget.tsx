"use client";
import { useEffect, useRef } from "react";

export {};

declare global {
  interface Window {
    turnstile: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          theme?: "light" | "dark";
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function TurnstileWidget({
  onVerify,
}: {
  onVerify?: (token: string) => void;
}) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadTurnstileScript = () => {
      const existingScript = document.querySelector(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );
      if (existingScript) {
        // Script already exists, just initialize
        initialize();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = initialize;
      document.body.appendChild(script);
    };

    const initialize = () => {
      if (
        widgetRef.current &&
        typeof window.turnstile !== "undefined" &&
        typeof window.turnstile.render === "function"
      ) {
        window.turnstile.render(widgetRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
          callback: (token: string) => {
            onVerify?.(token);
          },
          theme: "light",
        });
      }
    };

    loadTurnstileScript();

    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = ""; // Clean up on unmount
      }
    };
  }, [onVerify]);

  return <div ref={widgetRef} />;
}
