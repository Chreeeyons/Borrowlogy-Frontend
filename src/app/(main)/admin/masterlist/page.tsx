"use client";
import Materials from "@/components/MaterialContainer";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const MasterList = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("Borrower's Masterlist");
  }, []);

  return (
    <div id="laboratory-materials" className="section">
      <p className="text-white text-center">ADMIN</p>
      <Materials />
    </div>
  );
};

export default MasterList;
