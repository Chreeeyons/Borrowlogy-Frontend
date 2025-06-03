"use client";

import { addEquipment } from "@/services/equipmentService";
import { useState, useEffect } from "react";
import Papa from "papaparse"; // <-- Add this import

interface AddMaterialModalProps {
  onClose: () => void;
  onSave: () => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({ name: "", quantity: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") onClose();
  //     if (e.key === "Enter") handleSave();
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => window.removeEventListener("keydown", handleKeyDown);
  //   // eslint-disable-next-line
  // }, [form]);

  const handleSave = async () => {
    setErrorMessage(""); // Clear previous errors
    if (form.name.trim() && !isNaN(Number(form.quantity))) {
      try {
        const response = await addEquipment({
          name: form.name,
          quantity: Number(form.quantity),
        });

        if (response?.equipment) {
          onSave();
          onClose();
        } else if (response?.error) {
          setErrorMessage(response.error); // Show error to user
        } else {
          setErrorMessage("Unexpected API response.");
        }
      } catch (error) {
        setErrorMessage("Error adding equipment.");
      }
    } else {
      setErrorMessage("Please enter a valid name and quantity.");
    }
  };

  // CSV import handler
  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // results.data is an array of objects
        for (const row of results.data as {
          name: string;
          quantity: string;
        }[]) {
          if (row.name && row.quantity && !isNaN(Number(row.quantity))) {
            await addEquipment({
              name: row.name,
              quantity: Number(row.quantity),
            });
          }
        }
        onSave(); // Refresh the list after import
        onClose();
      },
      error: (err) => {
        setErrorMessage("Failed to parse CSV: " + err.message);
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
          Add Material
        </h2>

        <input
          type="text"
          placeholder="Material Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#04543C]"
        />

        {errorMessage && (
          <div className="text-red-600 mb-2 text-center">{errorMessage}</div>
        )}

        <div className="flex justify-between items-center">
          {/* Left: Import CSV */}
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
              onChange={handleCSVImport}
              className="hidden"
            />
          </div>

          {/* Right: Cancel and Save buttons grouped together */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#04543C] text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default AddMaterialModal;
