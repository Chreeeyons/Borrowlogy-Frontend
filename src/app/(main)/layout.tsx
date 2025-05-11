"use client";
import { ReactNode } from "react";
import Menu from "@/components/Menu";
import { usePathname } from "next/navigation";
import { HeaderProvider } from "@/utils/HeaderContext";
import { useHeader } from "@/utils/HeaderContext";

interface LayoutProps {
  children: ReactNode;
}

export function Header() {
  const { headerTitle } = useHeader();
  return (
<h1
  style={{
    fontFamily: 'Jost',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  }}
  className="text-3xl sm:text-4xl md:text-5xl font-bold"
>
  {headerTitle}
</h1>
  );
}


const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const userType = pathname.includes("admin") ? "admin" : "borrower";

  return (
    <HeaderProvider>
      <div
        className="grid gap-2 h-screen text-gray-800"
        style={{
          fontFamily: "Jost",
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
          className="bg-[#83191c] text-white font-medium text-xl flex items-center px-5 shadow-lg rounded-lg m-3 tracking-wider"
          style={{
            borderRadius: "20px", 
            gridArea: "header",
            height: "90px",
            boxShadow: `
              inset 0px 4px 4px rgba(0, 0, 0, 0.25), 
              inset 0px 4px 4px rgba(0, 0, 0, 0.25)
            `
          }}
        >
          <Header />
        </section>

        {/* Main Content */}
        <main
          className="p-6 m-3 bg-white rounded-lg shadow-3xl text-base leading-relaxed"
          style={{
            borderRadius: "20px",
            gridArea: "main",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 125px)",
            maxHeight: "calc(100vh - 70px)",
            overflowY: "auto",
            margin: "0 1rem 1rem 1rem",
            boxShadow: `
              inset 0px 4px 5px rgba(0, 0, 0, 0.5), 
              inset 4px 4px 4px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          {children}
        </main>
      </div>
    </HeaderProvider>
  );
};

export default Layout;
