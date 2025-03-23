import { useState } from "react";
import EditMaterialModal from "./EditMaterialModal";

const Material = ({
  user_type,
  material,
  onRemoveMaterial,
}: {
  user_type: string;
  material: { id: number; name: string; quantity: number };
  onRemoveMaterial: (id: number) => void;
}) => {
  const [materialState, setMaterialState] = useState(material);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newName: string, newQuantity: number) => {
    setMaterialState({ ...materialState, name: newName, quantity: newQuantity }); // Update UI
    setIsModalOpen(false); // Close modal
  };

  return (
    <div>
      <div
        key={materialState.id}
        className="p-4 mb-2 bg-[#8C1931] shadow-md flex justify-between items-center rounded-lg"
      >
        <div>
          <h2 className="text-white text-xl font-semibold mb-2 tracking-wide">
            {materialState.name}
          </h2>
          <p className="text-sm font-normal flex items-center gap-2">
            <span className={materialState.quantity > 0 ? "text-green-500" : "text-red-500"}>
              {materialState.quantity > 0 ? "Available" : "Out of Stock"}
            </span>
            <span className="text-white">| Quantity: {materialState.quantity}</span>
          </p>
        </div>

        <div className="flex items-center gap-5">
          {user_type === "admin" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#8C1931] px-5 py-2 rounded hover:bg-gray-300"
            >
              Edit
            </button>
          ) : materialState.quantity > 0 ? (
            <button className="bg-[#04543C] text-white px-4 py-2 rounded hover:bg-green-700">
              Add to Cart
            </button>
          ) : (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
              disabled
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Render Modal if Open */}
      {isModalOpen && (
        <EditMaterialModal
          material={materialState}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={() => onRemoveMaterial(materialState.id)} // ✅ Handle delete
        />
      )}
    </div>
  );
};

export default Material;
