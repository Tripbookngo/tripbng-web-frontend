import React, { useState, useEffect } from "react";
import { FaPlane, FaGlobe, FaHotel, FaCar } from "react-icons/fa";

const icons = [
  <FaPlane key="plane" />,
  <FaGlobe key="globe" />,
  <FaHotel key="hotel" />,
  <FaCar key="car" />
];

const Simmer = () => {
  const [activeIconIndex, setActiveIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 800); // Change icon every 800ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full"></div>
        <div className="text-blue-500 text-6xl p-5 bg-white/90 shadow-md rounded-full">
          {icons[activeIconIndex]}
        </div>
      </div>
    </div>
  );
};

export default Simmer;
