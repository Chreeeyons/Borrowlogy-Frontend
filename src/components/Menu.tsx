'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";


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
    style={style}
  >
      <h1 className="text-2xl font-bold mb-6 border-b border-red-700 pb-2 text-center tracking-wider">Menu</h1>
      
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
          <li>
            <button onClick={handleLogout}
              className="block p-2 hover:bg-red-700 rounded transition-all duration-200"
            >
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
        </ul>
      )}
    </div>
  );
}
