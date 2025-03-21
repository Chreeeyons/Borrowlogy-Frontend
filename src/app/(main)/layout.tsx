"use client";
import { ReactNode } from "react";
import Menu from "@/components/Menu";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { HeaderProvider } from "@/utils/HeaderContext";
import { useHeader } from "@/utils/HeaderContext";

interface LayoutProps {
  children: ReactNode;
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Header() {
  const { headerTitle } = useHeader();
  return (
    <div className="text-white text-center text-xl font-bold">
      {headerTitle}
    </div>
  );
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const userType = pathname.includes("admin") ? "admin" : "borrower";

  return (
    <HeaderProvider>
      <div
        className={`${poppins.className} grid gap-2 h-screen text-gray-800`}
        style={{
          gridTemplateColumns: "0.5fr 2fr",
          gridTemplateRows: "0.4fr 3fr",
          gridTemplateAreas: `
            'sidebar header'
            'sidebar main'`,
        }}
      >
      <Menu userType={userType} style={{ gridArea: 'sidebar' }} />

        {/* Header */}
        <section
          className="bg-[#F6B82F] text-white font-bold text-xl flex items-center justify-center shadow-lg rounded-lg p-5 m-3 tracking-wide"
          style={{ gridArea: "header", height: "70px" }}
        >
          <Header />
        </section>

        {/* Main Content */}
        <main
          className="flex-grow p-6 m-3 h-full bg-white rounded-lg shadow-2xl text-base leading-relaxed"
          style={{ gridArea: "main", minHeight: "75vh" }}
        >
          {children}
        </main>
      </div>
    </HeaderProvider>
  );
};

export default Layout;
