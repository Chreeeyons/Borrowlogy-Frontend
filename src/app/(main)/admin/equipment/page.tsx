"use client";
import Materials from "@/components/MaterialContainer";
import { useEffect } from "react";
import {useHeader} from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Laboratory Materials");
  }
  , []);
  return (
    <div id="laboratory-materials" className="section">
      <p className="text-white text-center"></p>
      <Materials user_type="admin" />
    </div>
  );
};

export default Equipments;
