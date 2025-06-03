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
        className="bg-white p-8 rounded-[20px] shadow-[0_0_16px_rgba(0,0,0,0.4)] w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
      {/* Title container with matching background and text style */}
      <div className="bg-[#83191c] py-2 px-4 rounded-[12px] mb-6 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
        <h2
          className="text-3xl font-bold text-center text-white mb-0 font-jost"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
        >
          Add Material
        </h2>
      </div>
    <input
      type="text"
      placeholder="Material Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                font-jost disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <input
      type="number"
      placeholder="Quantity"
      value={form.quantity}
      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
    />
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

export default AddMaterialModal;
