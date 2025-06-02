"use client";

import { addChemical } from "@/services/chemicalService";
import { useState, useEffect } from "react";
import Papa from "papaparse";

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
    expiration_date: "",
    location: "",
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
          expiration_date: form.expiration_date,
          location: form.location,
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

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as any[];

        const validEntries = data.filter(
          (row) =>
            row.chemical_name &&
            !isNaN(Number(row.mass)) &&
            hazardTypeOptions.some((opt) => opt.value === row.hazard_type)
        );

        for (const entry of validEntries) {
          try {
            await addChemical({
              chemical_name: entry.chemical_name,
              mass: Number(entry.mass),
              brand_name: entry.brand_name || "",
              hazard_type: entry.hazard_type || "No GHS",
              expiration_date: entry.expiration_date || "",
              location: entry.location || "",
            });
          } catch (err) {
            console.error(`Error adding ${entry.chemical_name}:`, err);
          }
        }

        onSave();
        onClose();
      },
    });
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

        <input
          type="date"
          placeholder="Expiration Date"
          value={form.expiration_date}
          onChange={(e) => setForm({ ...form, expiration_date: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />


        <div className="flex justify-between items-center gap-2">
          <div>
            <label
              htmlFor="csv-upload"
              className="inline-block px-4 py-2 bg-[#04543C] text-white rounded-lg cursor-pointer hover:bg-green-700"
            >
              Import CSV
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </div>  
          <div className="flex gap-2">
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
    </div>
  );
};

export default AddChemicalModal;
