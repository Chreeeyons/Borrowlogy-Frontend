"use client";

import { addChemical } from "@/services/chemicalService";
import { useState, useEffect } from "react";
import { ChangeEvent } from "react";

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCSVImport(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    setErrorMessage(null);
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        // Simple CSV parsing (assumes header: chemical_name,mass,brand_name,hazard_type)
        const lines = text.trim().split("\n");
        const [header, ...rows] = lines;
        const columns = header.split(",").map((col) => col.trim());

        for (const row of rows) {
          const values = row.split(",").map((v) => v.trim());
          if (values.length !== columns.length) continue;
          const chemical: Record<string, string> = {};
          columns.forEach((col, idx) => {
            chemical[col] = values[idx];
          });

          // Validate required fields
          if (!chemical.chemical_name || isNaN(Number(chemical.mass))) {
            setErrorMessage("Invalid data in CSV.");
            continue;
          }

          await addChemical({
            chemical_name: chemical.chemical_name,
            mass: Number(chemical.mass),
            brand_name: chemical.brand_name || "",
            hazard_type: chemical.hazard_type || "No GHS",
          });
        }
        onSave();
        onClose();
      } catch (err) {
        setErrorMessage("Failed to import CSV.");
        console.error(err);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading file.");
    };
    reader.readAsText(file);
  }

  return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white p-8 rounded-[20px] shadow-[0_0_16px_rgba(0,0,0,0.4)] w-[420px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title container with matching background and text style */}
          <div className="bg-[#83191c] py-2 px-4 rounded-[12px] mb-6 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
            <h2
              className="text-3xl font-bold text-center text-white mb-0 font-jost"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Add Chemical
            </h2>
          </div>

        <input
          type="text"
          placeholder="Chemical Name"
          value={form.chemical_name}
          onChange={(e) => setForm({ ...form, chemical_name: e.target.value })}
          className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                    font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <input
          type="text"
          placeholder="Brand Name"
          value={form.brand_name}
          onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                    font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <input
          type="number"
          placeholder="Mass (g)"
          value={form.mass}
          onChange={(e) => setForm({ ...form, mass: e.target.value })}
          className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                    font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <label className="block mb-2 font-semibold">Hazard Type</label>
        <select
          value={form.hazard_type}
          onChange={(e) => setForm({ ...form, hazard_type: e.target.value })}
          className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                    font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hazardTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

      {/* CSV Import Button */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Or Import CSV:</label>
        <label
          htmlFor="csv-upload"
          className={`
            inline-block px-6 py-2 rounded-[10px]
            bg-[#04543C] text-white font-bold
            text-center
            transition-all duration-300 ease-in-out
            shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
            hover:bg-green-700
            hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
            hover:scale-105
            cursor-pointer
          `}
        >
          Import CSV
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleCSVImport}
          className="hidden"
        />
      </div>
        {errorMessage && (
          <div className="text-red-600 mb-2 text-center">{errorMessage}</div>
        )}

        <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className={`
            px-5 py-2 rounded-[10px]
            bg-gray-300 text-black font-medium
            transition-all duration-300 ease-in-out
            shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
            hover:bg-gray-400
            hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
            hover:scale-105
          `}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`
            px-5 py-2 rounded-[10px]
            bg-[#04543C] text-white font-bold
            transition-all duration-300 ease-in-out
            shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
            hover:bg-green-700
            hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
            hover:scale-105
          `}
        >
          Save
        </button>
        </div>
      </div>
    </div>
  );
};

export default AddChemicalModal;
