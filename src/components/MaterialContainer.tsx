"use client";

import { useState } from "react";
import Material from "@/components/Material";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const materials = [
  { id: 1, name: "Microscope", quantity: 5 },
  { id: 2, name: "Test Tube", quantity: 0 },
  { id: 3, name: "Bunsen Burner", quantity: 3 },
  { id: 4, name: "Erlenmeyer Flask", quantity: 3 },
  { id: 5, name: "Funnel", quantity: 3 },
  { id: 6, name: "Graduated Cylinder", quantity: 0 },
];

const MaterialContainer = ({ user_type }: { user_type: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ id: number; name: string; quantity: number }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (material: { id: number; name: string; quantity: number }, quantity: number) => {
    const existingItem = cart.find((item) => item.id === material.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantity + quantity > material.quantity) {
      setErrorMessage(`Cannot borrow more than available quantity (${material.quantity} left).`);
      setShowModal(true);
      return;
    }

    setCart((prevCart) => {
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === material.id ? { ...item, quantity: currentQuantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...material, quantity }];
      }
    });
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-1 w-full max-w-full">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search for materials..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {user_type === "borrower" && (
          <Link href={{ pathname: "/cart", query: { cart: JSON.stringify(cart) } }}>
            <button className="flex items-center gap-2 ml-15 px-5 py-3 bg-[#8C1931] text-white rounded hover:bg-[#6A1426] min-w-max whitespace-nowrap">
              <ShoppingCart size={20} />
              <span className="justify-center">Cart ({cart.length})</span>
            </button>
          </Link>
        )}

        {user_type === "admin" && (
          <button className="ml-2 px-6 py-2 bg-[#04543C] text-white rounded hover:bg-green-700">
            Add
          </button>
        )}
      </div>

      {filteredMaterials.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4">Oops! No materials match your search</p>
      ) : (
        filteredMaterials.map((material) => (
          <Material key={material.id} user_type={user_type} material={material} onAddToCart={handleAddToCart} />
        ))
      )}

      {/* Modal for Borrowing Limit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <p className="text-[#8C1931] font-normal">{errorMessage}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialContainer;
