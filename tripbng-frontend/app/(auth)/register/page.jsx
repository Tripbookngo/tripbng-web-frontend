"use client";

import { FacebookIcon, GoogleIcon } from "@/components/icons";
import { Input } from "@/components/ui";
import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 relative hidden md:block">
        <Image
          src="/login.jpg" 
          alt="Register background"
          layout="fill"
          objectFit="cover"
          className="rounded-l-xl"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Image src="/logo.png" width={140} height={100} alt="logo" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-lg text-gray-700">Name</p>
              <Input type="text" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-700">Number</p>
              <Input type="number" placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-700">Email</p>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-700">Password</p>
              <Input type="password" placeholder="Enter your password" />
            </div>

            <Button className="w-full font-medium py-2 rounded-md transition">
              CONTINUE
            </Button>
          </div>

          <div className="flex items-center w-full">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="text-sm text-gray-500 mx-2">Other signup option</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>

          <button className="flex items-center gap-2 shadow-sm w-full justify-center bg-white px-6 py-2 rounded-md text-gray-700 transition hover:bg-gray-50">
            <GoogleIcon className="w-5 h-5" size={25} />
            <span className="text-sm">Signup with Google</span>
          </button>
          <p className="text-xs mt-2 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>

          <p className="text-xs text-gray-500 text-center mt-6">
            By proceeding, you agree to our{" "}
            <Link href="/term-and-condition" className="underline text-blue-500">
              T&C
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
