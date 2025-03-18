'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MenuProps {
    userType: 'admin' | 'borrower';
    style?: React.CSSProperties; // Add this line
  }

export default function Menu ({userType, style}: MenuProps){
    const router = useRouter();
    const goTo = (path: string) => {
      router.push(path); }
    return (
      <div className="w-64 bg-red-900 text-white ml-8 p-3 my-3 h-full" style={style}>
        <h1 className="text-2xl font-bold mb-4">Menu</h1>
        { userType === "borrower" &&<ul className="space-y-3">
          <li>
            <Link href="/equipment" className="hover:underline">Laboratory Materials</Link>
          </li>
          <li>
            <Link href="/cart" className="hover:underline">Cart</Link>
          </li>
          <li>
            <Link href="/history" className="hover:underline">History Log</Link>
          </li>
        </ul>}

        { userType === "admin" &&<ul className="space-y-3">
            <li>
            <Link href="/admin/requests" className="hover:underline">Borrower's Request</Link>
          </li>
          <li>
            <Link href="/admin/masterlist" className="hover:underline">Master's List</Link>
          </li>
          <li>
            <Link href="/admin/equipment" className="hover:underline">Laboratory Materials</Link>
          </li>
        </ul>}
      </div>

    );
  };  