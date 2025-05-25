"use client";

import { addChemical } from "@/services/chemicalService";
import { useState, useEffect } from "react";

interface AddChemicalModalProps {
  onClose: () => void;
  onSave: () => void; // Simplified to just trigger refresh
}

const AddChemicalModal: React.FC<AddChemicalModalProps> = ({
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    chemical_name: "",
    volume: "",
    volume_unit: "mL", // or default to something
    brand_name: "",
    is_hazardous: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const handleSave = async () => {
    if (form.chemical_name.trim() && !isNaN(Number(form.volume))) {
      try {
        const response = await addChemical({
          chemical_name: form.chemical_name,
          volume: Number(form.volume),
          volume_unit: form.volume_unit,
          brand_name: form.brand_name,
          is_hazardous: form.is_hazardous,
        });

        if (response?.chemical) {
          onSave(); // Refresh the list
          onClose();
        } else {
          console.error("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error adding chemical:", error);
      }
    }
  };

  // const [volume, setVolume] = useState<number>(0);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Add Chemical
        </h2>

        <input
          type="text"
          placeholder="Chemical Name"
          value={form.chemical_name}
          onChange={(e) => setForm({ ...form, chemical_name: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"

        />

        <input
          type="text"
          placeholder="Brand Name"
          value={form.brand_name}
          onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />

        <input
          type="number"
          placeholder="Volume"
          value={form.volume}
          onChange={(e) => setForm({ ...form, volume: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"

        />

        <select
          value={form.volume_unit}
          onChange={(e) => setForm({ ...form, volume_unit: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        >
          <option value="mL">mL</option>
          <option value="L">L</option>
        </select>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={form.is_hazardous}
            onChange={(e) =>
              setForm({ ...form, is_hazardous: e.target.checked })
            }
            className="mr-2"
          />
          <label>Is Hazardous?</label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#04543C] text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChemicalModal;
