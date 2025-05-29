import { useState, useEffect } from "react";

interface Material {
  id: number;
  name: string;
  quantity: number;
}

interface EditMaterialModalProps {
  material: Material;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const handleEdit = async (id: number, updatedData: Partial<Material>) => {
  try {
    const response = await fetch("http://localhost:8000/api/equipment/edit_equipment/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pk: id, ...updatedData }),
    });

    if (!response.ok) throw new Error("Failed to update material.");
    return response.json();
  } catch (error) {
    console.error("Error updating material:", error);
    return null;
  }
};

const EditMaterialModal: React.FC<EditMaterialModalProps> = ({ material, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState<Material>(material);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter") handleSave();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input (will be treated as 0)
    if (value === "") {
      setForm({ ...form, quantity: 0 });
      return;
    }
    
    // Only allow numbers
    if (/^\d+$/.test(value)) {
      setForm({ ...form, quantity: parseInt(value, 10) });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (await handleEdit(material.id, { name: form.name, quantity: form.quantity })) {
      onSave();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[420px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Edit Material</h2>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={loading}
        />

        <input
          type="text" // Changed from number to text
          className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8C1931]"
          value={form.quantity === 0 ? "" : form.quantity.toString()} // Show empty string for 0
          onChange={handleQuantityChange}
          disabled={loading}
          inputMode="numeric" // Show numeric keyboard on mobile
          pattern="[0-9]*" // Pattern for numeric input
        />

        <div className="flex justify-between mt-6">
          <button onClick={onDelete} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 bg-[#8C1931] text-white rounded-lg hover:bg-[#6f1427]" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialModal;