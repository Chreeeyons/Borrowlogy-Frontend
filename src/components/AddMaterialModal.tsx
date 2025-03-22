"use client";

import { useState, useEffect } from "react";

const AddMaterialModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (name: string, quantity: number) => void;
}) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Close modal on Esc key or clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [name, quantity]);

  const handleSave = () => {
    if (name.trim() && !isNaN(Number(quantity))) {
      onSave(name, Number(quantity));
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // Close when clicking outside modal
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-[420px] transition-opacity duration-200 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Add Material</h2>

        <input
          type="text"
          placeholder="Material Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#04543C]"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#04543C]"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#04543C] text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialModal;
