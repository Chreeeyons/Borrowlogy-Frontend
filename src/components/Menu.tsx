"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, FlaskConical } from "lucide-react";
import { FiShoppingCart, FiClock, FiUsers, FiList } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { GiMicroscope } from "react-icons/gi";

interface MenuProps {
  userType: "admin" | "borrower";
  style?: React.CSSProperties;
}

export default function Menu({ userType, style }: MenuProps) {
  const router = useRouter();
  const goTo = (path: string) => {
    router.push(path);
  };
  const pathname = usePathname();

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div
      className="flex flex-col ml-8"
      style={{
        ...style, // This now applies `gridArea: "sidebar"` correctly
      }}
    >
      {/* MENU Heading */}
      <div
        className="hidden md:flex w-64 text-white p-4 mt-3 text-center items-center justify-center"
        style={{
          height: "80px",
          borderRadius: "20px",
          backgroundColor: "transparent",
        }}
      >
        <img
          src="/images/logo.png"
          alt="App Logo"
          style={{ height: "70px", maxWidth: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Menu Items Container - sidebar visible only md and up */}
      {userType === "borrower" && (
        <>
          <div
            className="hidden md:flex w-64 text-white p-5 mb-3 h-[calc(100vh-7.5rem)] shadow-lg overflow-hidden flex-col justify-between"
            style={{
              marginTop: "1rem",
              borderRadius: "20px",
              backgroundColor: "transparent",
              boxShadow: "0 0 8px 7px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Sidebar menu */}
            <ul className="flex flex-col items-start space-y-6 text-left font-semibold text-[#FFFFFF] text-[14px] font-['Jost']">
              {[
                {
                  href: "/equipment",
                  icon: <GiMicroscope className="text-lg" />,
                  label: "LAB MATERIALS",
                },
                {
                  href: "/chemicals",
                  icon: <FlaskConical className="text-lg" />,
                  label: "CHEMICALS",
                },
                {
                  href: "/cart",
                  icon: <FiShoppingCart className="text-lg" />,
                  label: "CART",
                },
                {
                  href: "/history",
                  icon: <FiClock className="text-lg" />,
                  label: "HISTORY LOG",
                },
              ].map((item) => (
                <li key={item.href} className="w-full pb-2 mt-2 first:mt-2">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 py-2 px-4 w-full transition-all duration-200 ease-in-out rounded-2xl
                      ${
                        pathname === item.href
                          ? "bg-[#04241b] shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                          : "hover:bg-gradient-to-r hover:from-black hover:to-[#0b6b4d] hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-35 flex justify-center w-full">
                <div className="w-64">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start gap-3 py-2 px-4 rounded font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      borderRadius: "20px",
                      height: "45px",
                      backgroundColor: "#5e0708",
                      boxShadow:
                        "0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)",
                      fontFamily: "Jost, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#cc1f1f"; // brighter red
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(204, 31, 31, 0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#5e0708";
                      e.currentTarget.style.boxShadow =
                        "0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)";
                    }}
                  >
                    <LogOut size={20} />
                    LOG OUT
                  </button>
                </div>
              </li>
            </ul>
          </div>

          {/* Bottom nav menu - visible only on small screens */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#83191c] shadow-inner md:hidden">
            <ul className="flex justify-around items-center py-2 text-white text-xs font-semibold font-['Jost']">
              {[
                {
                  href: "/equipment",
                  icon: <GiMicroscope className="text-xl" />,
                  label: "LAB",
                },
                {
                  href: "/chemicals",
                  icon: <FlaskConical className="text-xl" />,
                  label: "CHEM",
                },
                {
                  href: "/cart",
                  icon: <FiShoppingCart className="text-xl" />,
                  label: "CART",
                },
                {
                  href: "/history",
                  icon: <FiClock className="text-xl" />,
                  label: "HISTORY",
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center px-3 py-1 transition-colors duration-200 ease-in-out
                      ${
                        pathname === item.href
                          ? "underline underline-offset-4"
                          : "hover:underline hover:underline-offset-4"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="text-[10px] mt-1">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center justify-center px-3 py-1 text-white hover:text-[#cc1f1f] transition-colors duration-200"
                  aria-label="Log Out"
                >
                  <LogOut size={20} />
                  <span className="text-[10px] mt-1">LOG OUT</span>
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}

      {/* Admin Menu Links */}
      {userType === "admin" && (
        <div
          className="hidden md:flex w-64 text-white p-5 mb-3 h-[calc(100vh-7.5rem)] shadow-lg overflow-hidden flex-col justify-between"
          style={{
            marginTop: "1rem",
            borderRadius: "20px",
            backgroundColor: "transparent",
            boxShadow: "0 0 8px 7px rgba(0, 0, 0, 0.5)",
          }}
        >
          <ul className="flex flex-col items-start space-y-6 text-left font-semibold text-[#FFFFFF] text-[14px] font-['Jost']">
            {[
              {
                href: "/admin/requests",
                label: "REQUESTS",
                icon: <FiUsers className="text-lg" />,
              },
              {
                href: "/admin/masterlist",
                label: "MASTERLIST",
                icon: <FiList className="text-lg" />,
              },
              {
                href: "/admin/equipment",
                label: "LAB MATERIALS",
                icon: <GiMicroscope className="text-lg" />,
              },
              {
                href: "/admin/chemicals",
                label: "CHEMICALS",
                icon: <FlaskConical className="text-lg" />,
              },
            ].map((item) => (
              <li key={item.href} className="w-full pb-2 mt-2 first:mt-2">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 py-2 px-4 w-full rounded-2xl transition-all duration-200 ease-in-out
                    ${
                      pathname === item.href
                        ? "bg-[#04241b] shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                        : "hover:bg-gradient-to-r hover:from-black hover:to-[#073a2a] hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4 mt-35 flex justify-center w-full">
              <div className="w-64">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-start gap-3 py-2 px-4 rounded font-bold text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    borderRadius: "20px",
                    height: "45px",
                    backgroundColor: "#5e0708",
                    boxShadow:
                      "0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)",
                    fontFamily: "Jost, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#cc1f1f";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(204, 31, 31, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#5e0708";
                    e.currentTarget.style.boxShadow =
                      "0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)";
                  }}
                >
                  <LogOut size={20} />
                  LOG OUT
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
