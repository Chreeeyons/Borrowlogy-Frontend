import { useState, useEffect } from "react";

const hazardTypeOptions = [
  { value: "No GHS", label: "No GHS" },
  { value: "Flammable", label: "Flammable" },
  { value: "Harmful", label: "Harmful" },
  { value: "Health Hazard", label: "Health Hazard" },
  { value: "Acute Toxicity", label: "Acute Toxicity" },
  { value: "Environmental Hazard", label: "Environmental Hazard" },
];

interface Chemical {
  id: number;
  chemical_name: string;
  mass: number;
  brand_name: string;
  hazard_type?: string;
  expiration_date?: string;
  location?: string;
}

interface EditChemicalModalProps {
  chemical: Chemical;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const handleEditChemical = async (id: number, updatedData: Partial<Chemical>) => {
  try {
    const response = await fetch("http://localhost:8000/api/chemicals/edit_chemical/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pk: id, ...updatedData }),
    });

    if (!response.ok) throw new Error("Failed to update chemical.");
    return response.json();
  } catch (error) {
    console.error("Error updating chemical:", error);
    return null;
  }
};

const EditChemicalModal: React.FC<EditChemicalModalProps> = ({ chemical, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<Chemical>(chemical);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter") handleSave();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const handleMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setForm({ ...form, mass: 0 });
      return;
    }
    if (/^\d+(\.\d{0,2})?$/.test(value)) {
      setForm({ ...form, mass: parseFloat(value) });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (await handleEditChemical(chemical.id, form)) {
      onSave();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[450px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Edit Chemical</h2>

        <input
          type="text"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          placeholder="Chemical Name"
          value={form.chemical_name}
          onChange={(e) => setForm({ ...form, chemical_name: e.target.value })}
          disabled={loading}
        />

        <input
          type="text"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          placeholder="Brand Name"
          value={form.brand_name}
          onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          disabled={loading}
        />

        <input
          type="text"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          placeholder="Mass (g/ml)"
          value={form.mass === 0 ? "" : form.mass.toString()}
          onChange={handleMassChange}
          disabled={loading}
          inputMode="decimal"
        />

        <select
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          value={form.hazard_type || ""}
          onChange={(e) => setForm({ ...form, hazard_type: e.target.value })}
          disabled={loading}
        >
          <option value="">Select Hazard Type</option>
          {hazardTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          value={form.expiration_date || ""}
          onChange={(e) => setForm({ ...form, expiration_date: e.target.value })}
          disabled={loading}
        />

        <input
          type="text"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          placeholder="Location"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          disabled={loading}
        />

        <div className="flex justify-between mt-6">
          <button onClick={onDelete} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" disabled={loading}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#8C1931] text-white rounded-lg hover:bg-[#6f1427]"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditChemicalModal;
