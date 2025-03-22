import { useState } from "react";

const Material = ({
  user_type,
  material,
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
  };

  return (
    <div>
      <div
        key={material.id}
        className="p-4 mb-2 bg-[#8C1931] shadow-md flex justify-between items-center rounded-lg"
      >
        <div>
          <h2 className="text-white text-xl font-semibold mb-2 tracking-wide">
            {material.name}
          </h2>
          <p className="text-sm font-normal flex items-center gap-2">
            <span
              className={material.quantity > 0 ? "text-green-500" : "text-red-500"}
            >
              {material.quantity > 0 ? "Available" : "Out of Stock"}
            </span>
            {material.quantity > 0 && (
              <span className="text-white">| Quantity: {material.quantity}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-5">
          {user_type !== "admin" && material.quantity > 0 && (
            <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden text-white">
              <button onClick={handleDecrease} className="px-3 py-2 text-[#8C1931] hover:bg-gray-300">-</button>
              <input type="text" value={quantity} readOnly className="w-12 h-9 text-center bg-gray-200 text-[#8C1931]" />
              <button onClick={handleIncrease} className="px-3 py-2 text-[#8C1931] hover:bg-gray-300">+</button>
            </div>
          )}
          {user_type === "admin" ? (
            <button className="bg-white text-[#8C1931] px-5 py-2 rounded hover:bg-gray-300">
              Edit
            </button>
          ) : material.quantity > 0 ? (
            <button 
              className="bg-white text-[#8C1931] px-4 py-2 rounded hover:bg-[#6A1426] hover:text-white"
              onClick={() => onAddToCart(material, quantity)}
            >
              Add to Cart
            </button>
          ) : (
            <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
              Add to Cart
            </button>
          )}
        </div>
      </div>

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
      )}
    </div>
  );
};

export default Material;
