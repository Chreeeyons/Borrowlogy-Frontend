"use client";

import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { signIn } from "next-auth/react";
// import { signIn, signOut } from "next-auth/react";

export default function Home() {
  const handleLogin = async () => {
    try {
      // Redirects the user to Google authentication and then to /equipment
      await signIn("google", { callbackUrl: "/equipment" });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const clearCookies = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    console.log("All cookies cleared!");
  };

  // const handleLogout = () => {
  //   clearCookies(); // Clear all cookies
  //   signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
  // };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Top and Bottom Borders */}
      <div className="top-border fixed top-0 left-0 w-full h-5 bg-[#5E0708] z-10"></div>
      <div className="bottom-border fixed bottom-0 left-0 w-full h-5 bg-[#5E0708] z-10"></div>

      {/* Right Border */}
      <div className="right-border fixed top-0 right-0 h-full w-[400px] z-40">
        <Image
          src="/images/left border 1.png"
          alt="Right Border"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Microscope */}
      <div className="microscope fixed bottom-[-6px] right-[250px] w-auto h-[700px] z-30">
        <Image
          src="/images/microscope 1.png"
          alt="Microscope"
          width={700}
          height={700}
        />
      </div>

      {/* RBC */}
      <div className="rbc fixed top-[-10px] right-[250px] w-[800px] h-[300px] z-20">
        <Image src="/images/rbc 1.png" alt="RBC" width={800} height={300} />
      </div>

      {/* Logo */}
      <div className="logo fixed top-[80px] left-[50px] w-[200px] h-auto z-50">
        <Image
          src="/images/Borrowlogy-logo.png"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>

      {/* Main Content */}
      <div className="container font-sans w-[700px] absolute top-1/2 left-[50px] transform -translate-y-1/2 text-left z-50">
        <h1 className="text-[45px] text-[#5E0708] mb-4 tracking-widest drop-shadow-lg">
          Borrowing your Biology Lab Materials made easier!
        </h1>
        <p className="text-[18px] font-light text-[#5E0708] leading-6 mb-8 mr-12">
          Borrowlogy is a platform for university biology students to easily
          borrow lab materials. With Borrowlogy, students can quickly access the
          tools they need for their experiments and stay organized with a
          comprehensive history log to track all their borrowing activities.
          Simplifying material access, so you can focus on learning!
        </p>

        {/* Button Container */}
        <div className="button-container flex gap-4">
          {/* Borrower Login Button */}
          <Link href="/login/">
            <button className="btn bg-[#5E0708] text-white px-6 py-3 text-[16px] rounded-md transition-all hover:bg-[#8A0A0B]">
              Log in as Borrower
            </button>
          </Link>

          {/* Technician Login Button */}
          <Link href="/admin/login/">
            <button className="btn bg-[#5E0708] text-white px-6 py-3 text-[16px] rounded-md transition-all hover:bg-[#8A0A0B]">
              Log in as Technician
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
