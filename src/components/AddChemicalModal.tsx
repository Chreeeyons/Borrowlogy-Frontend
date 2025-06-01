"use client";

import { addChemical } from "@/services/chemicalService";
import { useState, useEffect } from "react";

interface AddChemicalModalProps {
  onClose: () => void;
  onSave: () => void;
}

// Match these options to your Django HAZARD_TYPE_CHOICES exactly
const hazardTypeOptions = [
  { value: "No GHS", label: "No GHS" },
  { value: "Flammable", label: "Flammable" },
  { value: "Harmful", label: "Harmful" },
  { value: "Health Hazard", label: "Health Hazard" },
  { value: "Acute Toxicity", label: "Acute Toxicity" },
  { value: "Environmental Hazard", label: "Environmental Hazard" },
];

const AddChemicalModal: React.FC<AddChemicalModalProps> = ({
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    chemical_name: "",
    mass: "",
    brand_name: "",
    hazard_type: "No GHS",
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
    if (form.chemical_name.trim() && !isNaN(Number(form.mass))) {
      try {
        const response = await addChemical({
          chemical_name: form.chemical_name,
          mass: Number(form.mass),
          brand_name: form.brand_name,
          hazard_type: form.hazard_type,
        });

        if (response?.chemical) {
          onSave();
          onClose();
        } else {
          console.error("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error adding chemical:", error);
      }
    }
  };

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
          placeholder="Mass (g)"
          value={form.mass}
          onChange={(e) => setForm({ ...form, mass: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />

        <label className="block mb-2 font-semibold">Hazard Type</label>
        <select
          value={form.hazard_type}
          onChange={(e) => setForm({ ...form, hazard_type: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        >
          {hazardTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

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
