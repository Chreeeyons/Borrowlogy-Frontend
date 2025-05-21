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
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Heroicons magnifying glass */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Search for materials..."
          className="w-full pl-10 pr-3 py-2 rounded-[20px] bg-[#E3E1DD] outline-none text-black"
          style={{
            boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset`,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        {user_type === "borrower" && (
    <Link href="/cart">
      <button
        className="flex items-center gap-2 ml-5 px-8 py-2 text-white rounded-[10px] font-bold transition duration-300 ease-in-out"
        style={{
          backgroundColor: '#8C1931',
          boxShadow: 'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)',
          fontFamily: 'Jost, sans-serif',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#7A1729';
          e.currentTarget.style.boxShadow =
            '0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#8C1931';
          e.currentTarget.style.boxShadow = 'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <ShoppingCart size={20} />
        Cart
      </button>
    </Link>

        )}
      {user_type === "admin" && (
        <button
          className="flex items-center gap-2 ml-5 px-8 py-2 text-white rounded-[10px] font-bold transition duration-300 ease-in-out"
          style={{
            backgroundColor: '#8C1931',
            boxShadow: 'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)',
            fontFamily: 'Jost, sans-serif',
          }}
          onClick={() => setIsAddModalOpen(true)}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#7A1729';
            e.currentTarget.style.boxShadow =
              '0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#8C1931';
            e.currentTarget.style.boxShadow =
              'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
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
