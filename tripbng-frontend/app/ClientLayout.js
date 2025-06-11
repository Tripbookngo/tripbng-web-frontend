// components/layout/ClientLayout.js
"use client";  // Ensure this is a client component

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showFooter = pathname !== "/Account"; // Footer visibility logic

  return (
    <>
      {/* {children} */}
      {showFooter && <Footer />}
    </>
  );
}
