"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import "./globals.css"; // still needed for Tailwind resets and fonts
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  const handleLogin = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  useEffect(() => {
    console.log("Session data2:", session);
    // Redirect to main page if user is logged in
    if (session?.user?.user_type) {
      if (session.user.user_type === "borrower")
        window.location.href = "/equipment";
      else if (session.user.user_type === "lab_technician")
        window.location.href = "/admin/requests"; // Redirect to lab technician page if user is logged in
    }
  }, [session?.user]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black text-white font-sans">
      {/* Hero Section */}
      <header
        className="hero flex items-center min-h-screen px-6 sm:px-10 md:px-[5%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="hero-content text-left animate-fadeSlideIn opacity-100 max-w-[90%] sm:max-w-[80%] md:max-w-none">
          {/* Title */}
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] font-bold font-jost mb-1 text-[#5E0708] text-shadow leading-none">
            Borrowlogy
          </h1>

          {/* Tagline */}
          <p className="tagline text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] lg:text-[1.5rem] font-normal mt-5 mb-1 text-[#5E0708]">
            Borrowing your Biology Lab Materials made easier!
          </p>

          {/* Introduction Text */}
          <p className="intro mt-6 text-[1rem] sm:text-[1.1rem] md:text-[1.15rem] lg:text-[1.2rem] leading-8 max-w-[650px] text-left px-1 text-[#5E0708]">
            Borrowlogy is a platform for university biology students to easily
            borrow lab materials. With Borrowlogy, students can quickly access
            the tools they need for their experiments and stay organized with a
            comprehensive history log to track all their borrowing activities.
            Simplifying material access, so you can focus on learning!
          </p>

          {/* Login Button */}
          <div className="mt-8">
            <button
              className="bg-[#5E0708] text-white px-9 py-3 text-lg rounded-xl transition-all hover:bg-[#8A0A0B] uppercase font-bold"
              onClick={handleLogin}
            >
              Log in
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
