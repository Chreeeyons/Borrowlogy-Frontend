"use client";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";
import HistoryContent from "@/components/History"; // Import the History component

const HistoryPage = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("History Log");
  }, [setHeaderTitle]); // Dependency added to ensure proper effect handling

  return (
    <div id="history" className="section">
      <HistoryContent /> {/* Render the History component content */}
    </div>
  );
};

export default HistoryPage;
