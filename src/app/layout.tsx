// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "./NextAuthProvider";

export const metadata: Metadata = {
  title: "Homepage | Borrowlogy",
  description: "Borrowing your Biology Lab Materials made easier!",
};

import { Kumbh_Sans } from "next/font/google";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={kumbhSans.variable}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
