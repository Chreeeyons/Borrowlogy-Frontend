"use client";

import { useState, useEffect } from "react";
import Material from "@/components/Material";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import AddMaterialModal from "@/components/AddMaterialModal";
import { getEquipment } from "../services/equipmentService";

interface Equipment {
  id: number;
  name: string;
  quantity: number;
}

const MaterialContainer = ({ user_type }: { user_type: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);

  // Fetch Equipment from API
  const fetchEquipment = async () => {
    try {
      const response = await getEquipment();
      if (response?.equipment && Array.isArray(response.equipment)) {
        setEquipmentList(response.equipment);
        setFilteredEquipment(response.equipment); // Initialize filtered list
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Filter equipment list when searchTerm changes
  useEffect(() => {
    setFilteredEquipment(
      equipmentList.filter((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, equipmentList]);
  // TODO: Replace the following line with the actual cart retrieval logic (e.g., from context, props, or state)
    const cart = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
      { id: 1, name: "Item 4" },
      { id: 2, name: "Item 5" },
      { id: 3, name: "Item 6" }
    ]; // Placeholder: replace with actual cart data source
    const cartCount = cart.length;
    console.log("Cart Count:", cartCount);

  return (
    <div className="p-1 w-full max-w-full">
      {/* Search & Actions */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search for materials..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {user_type === "borrower" && (
         <Link href="/cart">
            <button className="flex items-center gap-2 ml-5 px-8 py-2 bg-[#8C1931] text-white rounded hover:bg-[#661222]">
              <ShoppingCart size={20} />
              Cart
            </button>
          </Link>       
        )}
        {user_type === "admin" && (
          <button
            className="ml-2 px-6 py-2 bg-[#04543C] text-white rounded hover:bg-green-700 flex items-center gap-1"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="text-lg">+</span> Add
          </button>
        )}
      </div>

      {/* Equipment List */}
      {filteredEquipment.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4">
          Oops! No materials match your search.
        </p>
      ) : (
        filteredEquipment.map((material) => (
          <Material
            key={material.id}
            user_type={user_type}
            material={material}
            refreshEquipmentList={async () => await fetchEquipment()}
          />
        ))
      )}

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <AddMaterialModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={async () => {
            await fetchEquipment();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MaterialContainer;
