"use client";
import History from "@/components/History"; // ✅ Ensure correct casing
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const History = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("History Log");
  }, []);

  return null; // ✅ Return an empty fragment instead of null
};

const Home = () => {
  return (
    <div id="history" className="section">
      <History />
    </div>
  );
};

export default Home;
