"use client";

import { useState } from "react";
import Material from "@/components/Material";

const materials = [
  { id: 1, name: "Microscope", quantity: 5 },
  { id: 2, name: "Test Tube", quantity: 0 },
  { id: 3, name: "Bunsen Burner", quantity: 3 },
];

const MaterialContainer = ({ user_type }: { user_type: string }) => {
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
        <Material
          key={material.id}
          user_type={user_type}
          material={material}
        ></Material>
      ))}
    </div>
  );
};

export default MaterialContainer;
