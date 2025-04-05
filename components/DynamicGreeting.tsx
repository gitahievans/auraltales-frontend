import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconSun,
  IconMoon,
  IconSunset2,
  IconSunrise,
  IconSunWind,
  IconClockHour10,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useValidSession } from "@/hooks/useValidSession";

const DynamicGreeting = () => {
  const [greeting, setGreeting] = useState("");
  const [TimeIcon, setTimeIcon] = useState<React.ComponentType<any>>(IconSun);
  const { isAuthenticated, session, status } = useValidSession();

  useEffect(() => {
    const currentHour = new Date().getHours();
    let newGreeting = "";
    let IconComponent = IconSun;

    if (currentHour < 5) {
      newGreeting = "Burning the midnight oil";
      IconComponent = IconMoon;
    } else if (currentHour < 12) {
      newGreeting = "Good Morning";
      IconComponent = IconSunrise;
    } else if (currentHour < 16) {
      newGreeting = "Good Afternoon";
      IconComponent = IconSunWind;
    } else if (currentHour < 19) {
      newGreeting = "Good Evening";
      IconComponent = IconSunset2;
    } else {
      newGreeting = "Good Night";
      IconComponent = IconMoon;
    }

    setGreeting(newGreeting);
    setTimeIcon(IconComponent);
  }, []);

  return (
    <div className=" py-4 border-green-200 flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <TimeIcon size={25} className="text-green-600 drop-shadow-md" />
        </motion.div>
        <div>
          <h2 className="text-white text-sm font-bold">
            {greeting}, {session?.user.firstName} {session?.user?.lastName}!
          </h2>
          {/* <p className="text-green-600 text-xs">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p> */}
        </div>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-green-200 rounded-full p-2">
          <span className="text-green-800 text-xs font-semibold">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </motion.div> */}
    </div>
  );
};

export default DynamicGreeting;
