'use client';

import { useState } from "react";

const materials = [
  { id: 1, name: "Microscope", quantity: 5 },
  { id: 2, name: "Test Tube", quantity: 0 },
  { id: 3, name: "Bunsen Burner", quantity: 3 },
];

const Materials = ({ user_type }: { user_type: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(user_type);
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 ml-64">
      <h1 className="text-3xl font-bold mb-4">Laboratory Materials</h1>
      <input
        type="text"
        placeholder="Search for materials..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredMaterials.map((material) => (
        <div
          key={material.id}
          className="p-4 mb-4 bg-white shadow-md flex justify-between items-center rounded-lg"
        >
          <div>
            <h2 className="text-xl font-semibold">{material.name}</h2>
            <p
              className={`font-bold ${
                material.quantity > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {material.quantity > 0 ? "Available" : "Out of Stock"}
            </p>
            <p className="text-gray-500">Quantity: {material.quantity}</p>
          </div>
          {user_type === "admin" ? (
            <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600">
              Edit
            </button>
          ) : ( material.quantity > 0 ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed"
            >
              Add to Cart
            </button>
          ): <button
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
          disabled
        >
          Add to Cart
        </button>)}
        </div>
      ))}
    </div>
  );
};

export default Materials;
