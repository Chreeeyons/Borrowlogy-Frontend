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
    // Clear client-side storage if needed
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out from NextAuth and redirect
    await signOut({
      callbackUrl: '/', // Where to redirect after logout
      redirect: true // Let NextAuth handle the redirect
    });
  };
  return (
<div
  className="w-64 bg-red-900 text-white ml-8 p-5 my-3 h-[calc(100vh-1.5rem)] rounded-lg shadow-lg overflow-hidden"
  style={{
    ...style,
    boxShadow: `
      inset 6px 0 8px -4px rgba(0, 0, 0, 0.5),   /* Left shadow */
      inset 0 -6px 8px -4px rgba(0, 0, 0, 0.5)   /* Bottom shadow */
    `,
  }}
>
      <h1 className="text-2xl font-bold mb-6 border-b border-red-700 pb-2 text-center tracking-wider">MENU</h1>
      
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
          <li className="mt-80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-bold text-white transition-all duration-300 transform hover:scale-105 hover:bg-red-700 hover:shadow-xl"
            style={{
              backgroundColor: "#5e0708",
              boxShadow: `
                0 -2px 4px rgba(0, 0, 0, 0.4),  /* Top shadow */
                0 2px 4px rgba(0, 0, 0, 0.4)    /* Bottom shadow */
              `,
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
            className="w-full flex items-center justify-center gap-2 py-2 rounded font-bold text-white transition-all duration-300 transform hover:scale-105 hover:bg-red-700 hover:shadow-xl"
            style={{
              backgroundColor: "#5e0708",
              boxShadow: `
                0 -2px 4px rgba(0, 0, 0, 0.4),  /* Top shadow */
                0 2px 4px rgba(0, 0, 0, 0.4)    /* Bottom shadow */
              `,
            }}
          >
            <LogOut size={20} />
            Log out
          </button>
        </li>
        </ul>
      )}
    </div>
  );
}
