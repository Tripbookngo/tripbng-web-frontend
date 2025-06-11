"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui";
import Button from "@/components/ui/button";

import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { GoogleIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

export default function SignIn() {
  const router = useRouter();
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState("contact");
  const [contactField, setContactField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const sendOtp = async () => {
    if (!contact) {
      toast.error("Please enter your email or phone number");
      return;
    }

    let contactField = contact.trim();

    if (/^\d{10}$/.test(contactField)) {
      contactField = `+91${contactField}`;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post("user/login", {
        contact_feild: contactField,
      });

      if (response.status === 200) {
        setContactField(contactField);
        setStep("otp");
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post("/user/verify", {
        contact_feild: contactField,
        otp: fullOtp,
        ipdetails: {
          ip: "gfg",
          logintime: "fdsfdsf",
          browserdetails: "dfdsfdaf",
        },
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(response.message);
        router.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2">
        <Image
          src="/login.jpg"
          alt="Login Image"
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === "contact"
                ? "Login to your account"
                : "Enter the OTP sent to your phone/email"}
            </p>
          </div>

          <div className="space-y-4">
            {step === "contact" ? (
              <div className="space-y-2">
                <label
                  htmlFor="contact"
                  className="block text-lg font-semibold text-black"
                >
                  Email or Phone Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="text-base sm:text-lg"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="block text-lg font-semibold text-black"
                >
                  Enter OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-base sm:text-lg border border-gray-300 rounded focus:outline-none focus:border-yellow bg-transparent"
                    />
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full font-semibold py-2.5 text-base sm:text-lg rounded-md transition flex items-center justify-center h-12 sm:h-14"
              onClick={step === "contact" ? sendOtp : verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="h-6 flex items-center">
                  {step === "contact" ? "Send OTP" : "Verify OTP"}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center w-full gap-2 mt-6">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-sm text-gray-500">Or continue with</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

          {/* Google Button */}
          <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white text-gray-700 rounded-md shadow hover:bg-gray-50 transition">
            <GoogleIcon className="w-5 h-5" size={25} />
            <span className="text-sm font-medium">Login with Google</span>
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By proceeding, you agree to our{" "}
            <Link
              href="/term-and-condition"
              className="text-blue-600 underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-blue-600 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}