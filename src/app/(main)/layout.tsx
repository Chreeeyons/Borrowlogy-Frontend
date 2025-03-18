'use client';
import { ReactNode } from "react";
import Menu from "@/components/Menu";
import { usePathname } from "next/navigation";


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
const pathname = usePathname();
const userType = pathname.includes("admin") ? "admin" : "borrower";
  return (
    
    <div className="grid gap-y-[2%] gap-x-[2%]"
    style={{
        gridTemplateColumns: '0.5fr 1.5fr',
        gridTemplateRows: "0.5fr 2.5fr",
        gridTemplateAreas: `
          'sidebar header'
          'sidebar main'`,
          }}>
      <Menu userType={userType} style={{ gridArea: 'sidebar' }} />
      <section className="bg-white m-3 p-2" style={{ gridArea: 'header' }}>HEADER TOH</section>
      <main className="flex-grow p-3 m-3 h-full bg-white" style={{ gridArea: 'main' }}>{children}</main>
    </div>
  );
};

export default Layout;
