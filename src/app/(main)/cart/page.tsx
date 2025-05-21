"use client";
import Cart from "@/components/Cart";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("Cart");
  }, []);

  return null; // ✅ Ensures it doesn't break React rules
};

const Home = () => {
  return (
    <div>
      {/* ✅ Ensures Equipments is executed for setting the header */}
      <Equipments />  
      
      <div id="cart-section" className="section">
        <Cart />
      </div>
    </div>
  );
};

export default Home;
