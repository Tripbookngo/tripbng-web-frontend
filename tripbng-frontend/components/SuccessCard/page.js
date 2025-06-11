"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SuccessCard = ({
  message = "Your transaction has been completed successfully!",
  redirectPath = "/",
}) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const progressRef = useRef();

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectPath);
    }
  }, [shouldRedirect, redirectPath, router]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = "100%";
      progressRef.current.style.transition = "width 5s linear";
      setTimeout(() => {
        progressRef.current.style.width = "0%";
      }, 10);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [drawCheck, setDrawCheck] = useState(false);
  useEffect(() => {
    const checkTimer = setTimeout(() => setDrawCheck(true), 500);
    return () => clearTimeout(checkTimer);
  }, []);

  const handleManualRedirect = () => {
    setShouldRedirect(true);
  };
  const getButtonText = () => {
    if (redirectPath === "/wallet") return "Go to Wallet";
    if (redirectPath.includes("/flights")) return "View Flight Booking";
    return "Return Home";
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white rounded-2xl shadow-xl text-center relative overflow-hidden border border-black/5 animate-fade-in">
      {/* Animated Success Icon */}
      <div className="relative w-24 h-24 mx-auto mb-7">
        {/* Pulsing circle */}
        <div className="absolute inset-0 rounded-full bg-green-200/30 animate-pulse"></div>
        {/* Checkmark */}
        <svg viewBox="0 0 52 52" className="relative z-10 w-full h-full">
          <path
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            fill="none"
            stroke="#4ade80"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: drawCheck ? 0 : 100,
              transition: "stroke-dashoffset 0.8s ease-out 0.5s",
            }}
          />
        </svg>
      </div>

      <h2 className="text-gray-900 font-bold mb-4 text-2xl tracking-tight">
        Payment Successful!
      </h2>
      <p className="text-gray-500 text-base leading-relaxed mb-8">
        Your transaction has been completed successfully. We&apos;ve sent a
        confirmation email with your receipt and order details.
      </p>

      {/* Redirect section */}
      <div className="mt-8 pt-6 border-t border-black/10">
        <div className="text-gray-400 text-sm mb-3">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </div>
        <div className="h-1.5 bg-gray-100 rounded overflow-hidden mb-4">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: "100%" }}
          />
        </div>
        <button
          className="mt-4 py-3 px-6 bg-black text-white rounded-lg font-semibold w-full transition hover:bg-gray-800 hover:-translate-y-0.5"
          onClick={handleManualRedirect}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default SuccessCard;
