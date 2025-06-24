import React from "react";
import { Text } from "@mantine/core";

interface CustomLoaderProps {
  message?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  message = "Loading Audiobooks...",
  subtitle = "Discovering amazing stories for you",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: {
      container: "min-h-[25vh] space-y-4",
      loader: "w-12 h-12",
      innerLoader: "inset-2",
      centerDot: "w-4 h-4",
      particles: "-inset-2",
      textContainer: "px-4 py-2",
      mainText: "text-base",
      subText: "text-xs",
      dots: "w-1.5 h-1.5",
    },
    md: {
      container: "min-h-[40vh] space-y-6",
      loader: "w-20 h-20",
      innerLoader: "inset-3",
      centerDot: "w-8 h-8",
      particles: "-inset-4",
      textContainer: "px-6 py-3",
      mainText: "text-lg",
      subText: "text-sm",
      dots: "w-2 h-2",
    },
    lg: {
      container: "min-h-[50vh] space-y-8",
      loader: "w-28 h-28",
      innerLoader: "inset-4",
      centerDot: "w-12 h-12",
      particles: "-inset-6",
      textContainer: "px-8 py-4",
      mainText: "text-xl",
      subText: "text-base",
      dots: "w-3 h-3",
    },
  };

  const classes = sizeClasses[size];

  return (
    <>
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>

      <div
        className={`flex flex-col justify-center items-center ${classes.container} ${className}`}
      >
        {/* Custom animated loader */}
        <div className="relative animate-float">
          {/* Outer rotating ring */}
          <div
            className={`${classes.loader} border-4 border-white/10 rounded-full animate-spin`}
          >
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-emerald-400 rounded-full animate-spin"></div>
          </div>

          {/* Secondary ring */}
          <div
            className={`absolute inset-1 ${classes.loader
              .replace("w-20 h-20", "w-18 h-18")
              .replace("w-12 h-12", "w-10 h-10")
              .replace(
                "w-28 h-28",
                "w-24 h-24"
              )} border-2 border-transparent border-r-teal-400 rounded-full animate-spin`}
            style={{ animationDirection: "reverse", animationDuration: "2s" }}
          ></div>

          {/* Inner pulsing circle */}
          <div
            className={`absolute ${classes.innerLoader} bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full animate-pulse backdrop-blur-sm`}
          ></div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`${classes.centerDot} bg-gradient-to-br from-emerald-400/80 to-teal-400/80 rounded-full animate-pulse shadow-lg shadow-emerald-400/20`}
            ></div>
          </div>

          {/* Floating particles */}
          <div className={`absolute ${classes.particles}`}>
            <div className="absolute top-2 left-2 w-1 h-1 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-teal-400 rounded-full animate-ping animation-delay-200"></div>
            <div className="absolute bottom-3 left-4 w-1 h-1 bg-emerald-300 rounded-full animate-ping animation-delay-500"></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-teal-300 rounded-full animate-ping animation-delay-700"></div>
            <div className="absolute top-1/3 left-1 w-0.5 h-0.5 bg-emerald-200 rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute bottom-1/3 right-1 w-0.5 h-0.5 bg-teal-200 rounded-full animate-ping animation-delay-500"></div>
          </div>

          {/* Glow effect */}
          <div
            className={`absolute inset-0 ${classes.loader} bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-xl animate-pulse`}
          ></div>
        </div>

        {/* Loading text with glassmorphism */}
        <div
          className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl ${classes.textContainer} animate-float-delayed`}
        >
          <Text
            size={classes.mainText.replace("text-", "")}
            fw={600}
            className="text-white text-center"
            style={{ color: "#ffffff" }}
          >
            {message}
          </Text>
          <Text
            size={classes.subText.replace("text-", "")}
            className="text-white/80 text-center mt-1"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            {subtitle}
          </Text>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2">
          <div
            className={`${classes.dots} bg-emerald-400 rounded-full animate-bounce`}
          ></div>
          <div
            className={`${classes.dots} bg-emerald-400 rounded-full animate-bounce animation-delay-200`}
          ></div>
          <div
            className={`${classes.dots} bg-emerald-400 rounded-full animate-bounce animation-delay-500`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default CustomLoader;
