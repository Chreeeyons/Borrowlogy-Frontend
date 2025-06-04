import { useState, useEffect, useRef } from "react";

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
  onSave: (updatedChemical: Chemical) => void; // Changed to accept the updated chemical
  onDelete: () => void;
}

const handleEditChemical = async (
  id: number,
  updatedData: Partial<Chemical>
) => {
  try {
    const response = await fetch(
      "https://borrowlogy-backend-production.up.railway.app/api/chemicals/chemicals/edit_chemical/",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pk: id, ...updatedData }),
      }
    );

    if (!response.ok) throw new Error("Failed to update chemical.");
    return response.json();
  } catch (error) {
    console.error("Error updating chemical:", error);
    return null;
  }
};

const EditChemicalModal: React.FC<EditChemicalModalProps> = ({
  chemical,
  onClose,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState<Chemical>(chemical);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    if (prevOpenRef.current !== false) {
      document.body.style.overflow = false ? "hidden" : "unset";
      prevOpenRef.current = false;
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

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
    const updatedChemical = await handleEditChemical(chemical.id, form);
    if (updatedChemical) {
      onSave({ ...form, id: chemical.id }); // Pass the updated chemical data back
      onClose();
    }
    setLoading(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    onDelete();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <div
          className="relative bg-white p-8 rounded-[20px] shadow-[0_0_16px_rgba(0,0,0,0.24)] w-[420px] transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title container with background and padding */}
          <div className="bg-[#83191c] py-2 px-4 rounded-[12px] mb-6 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
            <h2
              className="text-3xl font-bold text-center text-white mb-0 font-jost"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Edit Chemical
            </h2>
          </div>

          <input
            type="text"
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                      rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                      focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                      transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                      font-jost"
            placeholder="Chemical Name"
            value={form.chemical_name}
            onChange={(e) =>
              setForm({ ...form, chemical_name: e.target.value })
            }
            disabled={loading}
          />

          <input
            type="text"
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                      rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                      focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                      transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                      font-jost"
            placeholder="Brand Name"
            value={form.brand_name}
            onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
            disabled={loading}
          />

          <input
            type="text"
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                    font-jost"
            placeholder="Mass (g/ml)"
            value={form.mass === 0 ? "" : form.mass.toString()}
            onChange={handleMassChange}
            disabled={loading}
            inputMode="decimal"
          />

          <select
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                    font-jost"
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
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                    font-jost"
            value={form.expiration_date || ""}
            onChange={(e) =>
              setForm({ ...form, expiration_date: e.target.value })
            }
            disabled={loading}
          />

          <input
            type="text"
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                    font-jost"
            placeholder="Location"
            value={form.location || ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            disabled={loading}
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={handleDeleteClick}
              disabled={loading}
              className={`
              px-6 py-2 rounded-[10px]
              bg-red-500 text-white font-bold
              text-center
              transition-all duration-300 ease-in-out
              shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
              hover:bg-red-700
              hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
              hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            >
              Delete
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className={`
              px-6 py-2 rounded-[10px]
              bg-gray-300 text-gray-800 font-medium
              border border-gray-300
              shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)]
              hover:bg-gray-400 hover:text-black
              hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]
              hover:scale-105
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className={`
              px-6 py-2 rounded-[10px]
              bg-[#04543C] text-white font-bold
              shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)]
              hover:bg-[#04743C]
              hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]
              hover:scale-105
              transition-all duration-300 ease-in-out
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 font-jost">
          <div
            className="bg-white rounded-[20px] p-8 w-full max-w-md shadow-[3px_3px_6px_rgba(0,0,0,0.25)_inset]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-[#8C1931] text-center mb-4 drop-shadow-sm">
              Confirm Deletion
            </h2>
            <p className="text-center text-gray-700 mb-6">
              Are you sure you want to delete this chemical?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-6 py-2 rounded-lg font-semibold border border-[#8C1931] text-[#8C1931] bg-white shadow-sm hover:bg-[#8C1931] hover:text-white hover:shadow-md transition-all duration-300"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 rounded-lg font-semibold bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditChemicalModal;
