import { Cross2Icon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { Input } from "../ui";
import Link from "next/link";
import Button from "../ui/button";
import { GoogleIcon } from "../icons";
import { ReloadIcon } from "@radix-ui/react-icons";
import { apiService } from "@/lib/api";
import toast from "react-hot-toast";

export default function SlideInLogin({ onClose }) {
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [contactField, setContactField] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, step]);

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
        setStep(2);
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
        toast.success("Login successful");
        onClose();
        window.location.reload();
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

  const handleBackdropClick = (e) => {
    if (e.target.id === "backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-40 bg-black bg-opacity-70 flex justify-end transition-opacity duration-300"
    >
      <div className="w-full sm:w-1/3 h-full bg-white shadow-xl z-50 p-6 transition-transform duration-300 transform translate-x-0 overflow-y-auto">
        <button className="text-red-500 mb-4" onClick={onClose}>
          <Cross2Icon className="w-6 h-6" />
        </button>

        {step === 1 && (
          <div className="flex flex-col justify-center items-center gap-4 h-full max-w-md mx-auto p-4">
            <img src="/logo.png" alt="logo" width={200} height={100} />

            <div className="space-y-2 w-full">
              <p className="text-lg text-gray-700 font-medium">Login</p>
              <Input
                type="text"
                placeholder="Enter your email or phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="text-base sm:text-lg"
              />
            </div>

            <Button
              onClick={sendOtp}
              className="w-full font-semibold py-2.5 text-base sm:text-lg rounded-md transition flex items-center justify-center h-12 sm:h-14"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="h-6 flex items-center">
                  CONTINUE
                </span>
              )}
            </Button>

            <div className="flex items-center w-full max-w-xs mt-4">
              <span className="border-t border-gray-300 flex-grow"></span>
              <span className="text-sm text-gray-500 mx-2">
                Other login option
              </span>
              <span className="border-t border-gray-300 flex-grow"></span>
            </div>

            <button className="flex items-center gap-2 shadow-sm w-full max-w-xs justify-center bg-white px-6 py-2 rounded-md text-gray-700 mt-2 transition hover:bg-gray-50">
              <GoogleIcon className="w-5 h-5 mr-2" size={25} />
              <span className="text-sm">Login with Google</span>
            </button>

            <p className="text-xs mt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 underline">
                Register
              </Link>
            </p>

            <p className="text-xs text-gray-500 text-center mt-2">
              By proceeding, you agree to our{" "}
              <Link href="/term-and-condition" className="underline text-blue">
                T&C
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline text-blue">
                Privacy Policy
              </Link>
            </p>
          </div>
        )}

{step === 2 && (
  <div className="flex flex-col justify-center items-center gap-4 h-full max-w-md mx-auto p-4">
    <img src="/logo.png" alt="logo" width={200} height={100} />
    <div className="space-y-2 w-full">
      <p className="text-lg text-gray-700 font-medium">Enter OTP</p>
      <div className="flex justify-between gap-2 w-full pb-5">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            inputMode="numeric"
            value={otp[index]}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (!val) return;
              const newOtp = [...otp];
              newOtp[index] = val;
              setOtp(newOtp);
              const nextInput = document.getElementById(`otp-${index + 1}`);
              if (nextInput) nextInput.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[index]) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) prevInput.focus();
              }
            }}
            id={`otp-${index}`}
            className="w-14 h-16 text-center border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-yellow"
          />
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>
          Didn't receive the OTP?{" "}
          {resendTimer > 0 ? (
            `Resend in ${resendTimer}s`
          ) : (
            <button
              className="text-blue-500 underline"
              onClick={() => {
                handleSendOtp();
                setResendTimer(60);
              }}
            >
              RESEND
            </button>
          )}
        </span>
      </div>
    </div>

    <Button
      onClick={verifyOtp}
      className="w-full font-semibold py-2.5 text-base sm:text-lg rounded-md transition flex items-center justify-center h-12 sm:h-14"
      disabled={isLoading}
    >
      {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="h-6 flex items-center">
                  VERIFY & LOGIN
                </span>
              )}
    </Button>
  </div>
)}

      </div>
    </div>
  );
}
