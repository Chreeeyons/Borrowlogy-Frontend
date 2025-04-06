"use client";
import HistoryComponent from "@/components/History"; // ✅ Ensure correct casing
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const History = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("History Log");
  }, []);

  return <HistoryComponent />; // ✅ Use the imported component here
};

const Home = () => {
  return (
    <div id="history" className="section">
      <History />
    </div>
  );
};

export default Home;
