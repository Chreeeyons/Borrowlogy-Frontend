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
  return headerTitle;
}

// export function Header() {
//   const { headerTitle } = useHeader();
//   return (
//     <div className="">
//       {headerTitle}
//     </div>
//   );
// }

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const userType = pathname.includes("admin") ? "admin" : "borrower";

  return (
    <HeaderProvider>
      <div
        className={`${poppins.className} grid gap-2 h-screen text-gray-800`}
        style={{
          gridTemplateColumns: "0.2fr 3.5fr",
          gridTemplateRows: "0.2fr 3.5fr",
          gridTemplateAreas: `
            'sidebar header'
            'sidebar main'`,
        }}
      >
      <Menu userType={userType} style={{ gridArea: 'sidebar' }} />

      {/* Header */}
      <section
        className="bg-[#F6B82F] text-white font-medium text-xl flex items-center px-5 shadow-lg rounded-lg m-3 tracking-wider"
        style={{ gridArea: "header", height: "70px" }}
      >
        <Header />
      </section>


        {/* Main Content */}
        <main
          className="p-6 m-3 bg-white rounded-lg shadow-2xl text-base leading-relaxed"
          style={{
            gridArea: "main",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 115px)", // Adjusted height
            maxHeight: "calc(100vh - 70px)", // Ensures it doesn’t exceed
            overflowY: "auto",
            margin: "0 1rem 1rem 1rem",
          }}
        >
          {children}
        </main>
      </div>
    </HeaderProvider>
  );
};

export default Layout;
