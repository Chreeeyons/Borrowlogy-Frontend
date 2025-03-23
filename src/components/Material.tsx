import { useState } from "react";
import EditMaterialModal from "./EditMaterialModal";

const Material = ({
  user_type,
  material,
<<<<<<< .merge_file_5Ofj6a
  onAddToCart,
}: {
  user_type: string;
  material: { id: number; name: string; quantity: number };
  onAddToCart: (material: { id: number; name: string; quantity: number }, quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false); // Modal state

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < material.quantity) {
      setQuantity(quantity + 1);
    } else {
      setShowModal(true); // Show modal instead of alert
    }
=======
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
>>>>>>> .merge_file_j1QVzo
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
<<<<<<< .merge_file_5Ofj6a
            <span
              className={material.quantity > 0 ? "text-green-500" : "text-red-500"}
            >
              {material.quantity > 0 ? "Available" : "Out of Stock"}
=======
            <span className={materialState.quantity > 0 ? "text-green-500" : "text-red-500"}>
              {materialState.quantity > 0 ? "Available" : "Out of Stock"}
>>>>>>> .merge_file_j1QVzo
            </span>
            <span className="text-white">| Quantity: {materialState.quantity}</span>
          </p>
        </div>

        <div className="flex items-center gap-5">
<<<<<<< .merge_file_5Ofj6a
          {user_type !== "admin" && material.quantity > 0 && (
            <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden text-white">
              <button onClick={handleDecrease} className="px-3 py-2 text-[#8C1931] hover:bg-gray-300">-</button>
              <input type="text" value={quantity} readOnly className="w-12 h-9 text-center bg-gray-200 text-[#8C1931]" />
              <button onClick={handleIncrease} className="px-3 py-2 text-[#8C1931] hover:bg-gray-300">+</button>
            </div>
          )}
=======
>>>>>>> .merge_file_j1QVzo
          {user_type === "admin" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#8C1931] px-5 py-2 rounded hover:bg-gray-300"
            >
              Edit
            </button>
<<<<<<< .merge_file_5Ofj6a
          ) : material.quantity > 0 ? (
            <button 
              className="bg-white text-[#8C1931] px-4 py-2 rounded hover:bg-[#6A1426] hover:text-white"
              onClick={() => onAddToCart(material, quantity)}
            >
=======
          ) : materialState.quantity > 0 ? (
            <button className="bg-[#04543C] text-white px-4 py-2 rounded hover:bg-green-700">
>>>>>>> .merge_file_j1QVzo
              Add to Cart
            </button>
          ) : (
            <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
              Add to Cart
            </button>
          )}
        </div>
      </div>

<<<<<<< .merge_file_5Ofj6a
      {/* Modal for exceeding quantity */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-[#8C1931] font-normal">Oops! You cannot borrow more than {material.quantity}.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Okay
            </button>
          </div>
        </div>
=======
      {/* Render Modal if Open */}
      {isModalOpen && (
        <EditMaterialModal
          material={materialState}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={() => onRemoveMaterial(materialState.id)} // ✅ Handle delete
        />
>>>>>>> .merge_file_j1QVzo
      )}
    </div>
  );
};

export default Material;
