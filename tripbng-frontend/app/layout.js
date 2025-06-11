"use client";
import { Poppins } from "next/font/google";
import "../style/globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ClientLayout from "./ClientLayout";
import { useNavbarLogic } from "@/components/useNavbarLogic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


const LazyLoading = dynamic(() => import("../components/ui/loading"), {
  ssr: false, 
});

export default function RootLayout({ children }) {
  const { isNavFixed, showTabsInNav } = useNavbarLogic();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-red text-foreground leading-relaxed",
         
        )}
        style={{
          fontFamily: `'Poppins', 'Segoe UI Symbol', 'Noto Sans', sans-serif`,
        }}
      >
        <Navbar isFixed={isNavFixed} showTabsInNav={showTabsInNav} />
        <main className="">
          <Suspense fallback={<LazyLoading />}>{children}</Suspense>
        </main>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
