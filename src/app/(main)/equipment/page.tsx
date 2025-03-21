"use client";
import Materials from "@/components/MaterialContainer";
import Link from "next/link";

const Home = () => {
  return (
    <div id="laboratory-materials" className="section bg-red-500">
      <Materials user_type="borrower" />
      <Link href="/cart" className="hover:underline text-center">
        Cart
      </Link>
    </div>
  );
};

export default Home;
