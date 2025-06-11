'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const FailureCard = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const progressRef = useRef();

  useEffect(() => {
    // Animate progress bar width
    if (progressRef.current) {
      progressRef.current.style.width = '100%';
      progressRef.current.style.transition = 'width 5s linear';
      setTimeout(() => {
        progressRef.current.style.width = '0%';
      }, 10);
    }

    // Countdown timer and redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Animate cross draw
  const [drawCross, setDrawCross] = useState(false);
  useEffect(() => {
    setTimeout(() => setDrawCross(true), 500);
  }, []);

  const handleManualRedirect = () => {
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white rounded-2xl shadow-xl text-center relative overflow-hidden border border-black/5 animate-fade-in">
      {/* Animated Failure Icon */}
      <div className="relative w-24 h-24 mx-auto mb-7">
        {/* Pulsing circle */}
        <div className="absolute inset-0 rounded-full bg-red-200/30 animate-pulse"></div>
        {/* Cross */}
        <svg
          viewBox="0 0 52 52"
          className="relative z-10 w-full h-full"
        >
          <path
            d="M16 16l20 20M36 16L16 36"
            fill="none"
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: drawCross ? 0 : 100,
              transition: 'stroke-dashoffset 0.8s ease-out 0.5s'
            }}
          />
        </svg>
      </div>

      <h2 className="text-gray-900 font-bold mb-4 text-2xl tracking-tight">Payment Failed!</h2>
      <p className="text-gray-500 text-base leading-relaxed mb-8">
        Unfortunately, your transaction could not be completed. Please check your payment details and try again.
      </p>

      {/* Redirect section */}
      <div className="mt-8 pt-6 border-t border-black/10">
        <div className="text-gray-400 text-sm mb-3">
          Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </div>
        <div className="h-1.5 bg-gray-100 rounded overflow-hidden mb-4">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-red-500 to-red-500"
            style={{ width: '100%' }}
          />
        </div>
        <button
          className="mt-4 py-3 px-6 bg-black text-white rounded-lg font-semibold w-full transition hover:bg-gray-800 hover:-translate-y-0.5"
          onClick={handleManualRedirect}
        >
          Return Home Now
        </button>
      </div>
    </div>
  );
};

export default FailureCard;
