"use client";
import Materials from "@/components/MaterialContainer";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("Borrower's Requests");
  }, []);

  return (
    <div id="laboratory-materials" className="section">
      <p className="text-white text-center">ADMIN</p>

    </div>
  );
};

export default Equipments;
