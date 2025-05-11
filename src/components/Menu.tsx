'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from 'lucide-react';

interface MenuProps {
  userType: 'admin' | 'borrower';
  style?: React.CSSProperties;
}

export default function Menu({ userType, style }: MenuProps) {
  const router = useRouter();
  const goTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    await signOut({
      callbackUrl: '/',
      redirect: true
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
        className="w-64 bg-red-900 text-white p-4 mt-3 shadow-lg text-center flex items-center justify-center"
        style={{
          height: "90px",
          borderRadius: "20px",
          boxShadow: `inset 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)`
        }}
      >
        <h1 className="text-5xl font-bold tracking-wider text-shadow">MENU</h1>
      </div>

      {/* Menu Items */}
      <div
        className="w-64 bg-red-900 text-white p-5 mb-3 h-[calc(100vh-7.5rem)] shadow-lg overflow-hidden flex flex-col justify-between"
        style={{
          marginTop: "1rem",
          borderRadius: "20px",
          boxShadow: `inset 0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)`
        }}
      >
        {/* Menu Links */}
        {userType === "borrower" && (
          <ul className="space-y-3">
            <li>
              <Link
                href="/equipment"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                Laboratory Materials
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                History Log
              </Link>
            </li>
            <li className="mt-70">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded font-bold text-white transition-all duration-300 transform hover:scale-105 hover:bg-red-700 hover:shadow-xl"
                style={{
                  backgroundColor: "#5e0708",
                  boxShadow: `0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)`
                }}
              >
                <LogOut size={20} />
                Log out
              </button>
            </li>
          </ul>
        )}

        {userType === "admin" && (
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin/requests"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                Borrower's Request
              </Link>
            </li>
            <li>
              <Link
                href="/admin/masterlist"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                Borrower's Masterlist
              </Link>
            </li>
            <li>
              <Link
                href="/admin/equipment"
                className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
              >
                Laboratory Materials
              </Link>
            </li>
            <li className="mt-80">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded font-bold text-white transition-all duration-300 transform hover:scale-105 hover:bg-red-700 hover:shadow-x2"
                style={{
                  backgroundColor: "#5e0708",
                  boxShadow: `0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)`
                }}
              >
                <LogOut size={20} />
                Log out
              </button>
            </li>
          </ul>
        )}

        {/* Logo at the Bottom */}
        <div className="mt-auto mb-0 flex justify-center">
          <img src="/images/logo.png" alt="Logo" className="w-24 h-auto" />
        </div>
      </div>
    </div>
  );
}
