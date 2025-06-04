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
    const response = await fetch(
      "https://borrowlogy-backend-production.up.railway.app/api/equipment/edit_equipment/",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pk: id, ...updatedData }),
      }
    );

    if (!response.ok) throw new Error("Failed to update material.");
    return response.json();
  } catch (error) {
    console.error("Error updating material:", error);
    return null;
  }
};

const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  material,
  onClose,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState<Material>(material);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter") handleSave();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

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
    if (
      await handleEdit(material.id, {
        name: form.name,
        quantity: form.quantity,
      })
    ) {
      onSave();
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
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 font-jost"
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
              Edit Material
            </h2>
          </div>
          <input
            type="text"
            className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#8C1931] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
                    font-jost"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
            placeholder="Enter material name"
          />

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.quantity === 0 ? "" : form.quantity.toString()}
            onChange={handleQuantityChange}
            disabled={loading}
            className={`
            w-full p-4 mb-2
            rounded-[12px]
            bg-[#EEE9E5] text-black
            shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)]
            placeholder-gray-500
            font-jost text-base
            focus:outline-none focus:ring-2 focus:ring-[#8C1931] focus:border-[#8C1931]
            hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]
            transition-all duration-300 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          />

          <div className="flex justify-between items-center mt-6 font-jost">
            <button
              onClick={handleDeleteClick}
              disabled={loading}
              className={`
              px-6 py-2 rounded-[10px]
              bg-red-600 text-white font-bold
              text-center
              transition-all duration-300 ease-in-out
              shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]  // Adding a visible shadow
              hover:bg-red-700
              hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]  // Stronger shadow on hover
              hover:scale-105  // Slight scaling effect on hover
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
                bg-gray-200 text-gray-800 font-medium
                border border-gray-300
                shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)]  // Add visible shadow
                hover:bg-gray-400 hover:text-black
                hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]  // Stronger shadow on hover
                hover:scale-105  // Slight scaling effect on hover
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
                shadow-[0_4px_8px_0px_rgba(0,0,0,0.2)]  // Add visible shadow
                hover:bg-[#04743C]
                hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.3)]  // Stronger shadow on hover
                hover:scale-105  // Slight scaling effect on hover
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
              Are you sure you want to delete this material?
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

export default EditMaterialModal;
