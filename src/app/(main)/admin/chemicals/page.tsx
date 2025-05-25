"use client";
import Chemical from "@/components/ChemicalContainer";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Chemicals");
  }, []);
  return (
    <div id="laboratory-materials" className="section">
      <p className="text-white text-center"></p>
      <Chemical user_type="admin" />
    </div>
  );
};

export default Equipments;
