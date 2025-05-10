"use client";
import Materials from "@/components/MaterialContainer";
import Link from "next/link";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";


const Equipments = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("LABORATORY MATERIALS");
  }, []);
  return null;
};

const Home = () => {
  return (
    <div id="laboratory-materials" className="section">
      <Equipments /> {}
      <Materials user_type="borrower" />
      {/* <Link href="/cart" className="hover:underline text-center block mt-4">
        Cart
      </Link> */}
    </div>
  );
};

export default Home;
