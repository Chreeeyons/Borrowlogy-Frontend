"use client";

import { useState, useEffect } from "react";
import Chemical from "@/components/Chemicals";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import AddChemicalModal from "@/components/AddChemicalModal";
import { getChemicals } from "@/services/chemicalService";

interface ChemicalItem {
  id: number;
  chemical_name: string;
  mass: number;        // changed from volume
  brand_name: string;
  is_hazardous: boolean;
  expiration_date?: string;
  location?: string;
}

const ChemicalContainer = ({ user_type }: { user_type: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [chemicalList, setChemicalList] = useState<ChemicalItem[]>([]);
  const [filteredChemicals, setFilteredChemicals] = useState<ChemicalItem[]>([]);

  // Fetch chemicals from API
  const fetchChemicals = async () => {
    try {
      const response = await getChemicals();
      if (response?.chemicals && Array.isArray(response.chemicals)) {
        setChemicalList(response.chemicals);
        setFilteredChemicals(response.chemicals);
      }
    } catch (error) {
      console.error("Error fetching chemicals:", error);
    }
  };

  useEffect(() => {
    fetchChemicals(); // ✅ your actual backend fetch
  }, []);

  useEffect(() => {
    setFilteredChemicals(
      chemicalList.filter((chem) =>
        chem.chemical_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, chemicalList]);

  return (
    <div className="p-1 w-full max-w-full">
      {/* Search & Actions */}
      <div className="flex items-center mb-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
            placeholder="Search for chemicals..."
            className="w-full pl-10 pr-3 py-2 rounded-[20px] bg-[#E3E1DD] outline-none text-black"
            style={{ boxShadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset` }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {user_type === "borrower" && (
        <Link href="/cart">
          <button
            className="hidden md:flex items-center gap-2 ml-5 px-8 py-2 text-white rounded-[10px] font-bold transition duration-300 ease-in-out"
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
              backgroundColor: "#8C1931",
              boxShadow: "inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)",
              fontFamily: "Jost, sans-serif",
            }}
            onClick={() => setIsAddModalOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#7A1729";
              e.currentTarget.style.boxShadow =
                "0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8C1931";
              e.currentTarget.style.boxShadow =
                "inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span className="text-lg">+</span> Add
          </button>
        )}
      </div>

      {/* Chemical List */}
      {filteredChemicals.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4">
          Oops! No chemicals match your search.
        </p>
      ) : (
        filteredChemicals.map((chem) => (
          <Chemical
            key={chem.id}
            user_type={user_type}
            chemical={chem}
            refreshChemicalList={async () => await fetchChemicals()}
          />
        ))
      )}

      {/* Add Chemical Modal */}
      {isAddModalOpen && (
        <AddChemicalModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={async () => {
            await fetchChemicals();
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChemicalContainer;
