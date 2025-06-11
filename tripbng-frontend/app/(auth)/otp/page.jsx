"use client";

import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react"; // Added useState import
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";

function OtpContent() {
  const searchParams = useSearchParams();
  const number = searchParams.get("number");
  const router = useRouter();
  const [otp, setOtp] = useState(""); // State to track OTP input

  async function verifyOtp() {
    if (otp.length !== 6) {
      // Validate OTP length
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      let formattedNumber = number.trim(); // Remove spaces

      // Ensure the number starts with +91
      if (!formattedNumber.startsWith("+91")) {
        formattedNumber = `+91${formattedNumber.replace(/^(\+91|91)/, "")}`;
      }

      const response = await apiService.post("/user/verify", {
        contact_feild: formattedNumber,
        otp: otp,
        ipdetails: {
          ip: "gfg",
          logintime: "fdsfdsf",
          browserdetails: "dfdsfdaf",
        },
        // Use the OTP from state instead of hardcoded value
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        router.push("/");
        toast.success("Login Successful!");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      console.log(error);
    }
  }

  async function resendOtp() {
    try {
      const response = await apiService.post("/user/resend", {
        mobile: number,
      });
      if (response.data) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center flex-col gap-6 border rounded-xl my-10 max-w-md mx-auto p-10">
      <Image src={"/logo.png"} width={140} height={100} alt="logo" />
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-700">
          Verify Your Mobile Number
        </p>
        <p className="text-xs text-gray-500">
          Please enter the OTP received on {number}
        </p>
        <InputOTP
          className="w-full"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp} // Bind the value to state
          onChange={(value) => setOtp(value)} // Update state on change
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <p className="flex justify-between items-center text-xs">
        Didn&apos;t receive the OTP? Resend in 60 sec
        <Button
          onClick={resendOtp}
          className="font-medium py-2 rounded-md transition hover:underline"
        >
          RESEND
        </Button>
      </p>

      <Button
        className="w-full font-medium py-2 rounded-md transition"
        onClick={verifyOtp}
      >
        VERIFY
      </Button>
    </div>
  );
}

export default function Otp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpContent />
    </Suspense>
  );
}
