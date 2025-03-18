'use client';
import Materials from "@/components/Materials";
import Link from "next/link";

const Home = () => {
  return (
        <div id="laboratory-materials" className="section bg-red-500">
        <Materials />
        <Link href="/cart" className="hover:underline text-center">Cart</Link>
        </div>
  );
};

export default Home;
