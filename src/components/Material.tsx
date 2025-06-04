import { useState } from "react";
import EditMaterialModal from "./EditMaterialModal";
import { addtoCart } from "@/services/cartService";
import { useSession } from "next-auth/react";

interface MaterialProps {
  user_type: string;
  material: { id: number; name: string; quantity: number };
  refreshEquipmentList: () => void;
}

const Material = ({
  user_type,
  material,
  refreshEquipmentList,
}: MaterialProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "https://borrowlogy-backend-production.up.railway.app/api/equipment/delete_equipment/",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pk: material.id }),
        }
      );

      if (response.ok) {
        refreshEquipmentList(); // Refresh the list after deletion
      } else {
        console.error("Failed to delete material");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const handleIncrease = () => {
    if (quantity !== null && quantity < material.quantity) {
      setQuantity((prev) => (prev !== null ? prev + 1 : 1));
    }
  };

  const handleDecrease = () => {
    if (quantity !== null && quantity > 1) {
      setQuantity((prev) => (prev !== null ? prev - 1 : 1));
    }
  };

  const handleSave = async () => {
    if (quantity === null) return; // Prevent invalid submit
    try {
      const response = await addtoCart({
        user_id: session?.user?.id ? Number(session.user.id) : 1, // Use session user ID or default to 1
        quantity: quantity,
        equipment_id: material.id,
      });

      setSuccessMessage("Successfully added to cart!");
      setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide
      refreshEquipmentList();
    } catch (error) {
      console.error("Error adding equipment:", error);
    }
  };

  return (
    <div>
      <div
        className="p-4 mb-2 bg-[#EEE9E5] shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 rounded-lg"
        style={{
          borderRadius: "12px",
          boxShadow: `3px 3px 6px 0px rgba(0, 0, 0, 0.25) inset`,
        }}
      >
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-black text-2xl sm:text-3xl md:text-4xl font-semibold mb-0 tracking-normal">
            {material.name}
          </h2>
          <p className="text-sm font-normal flex flex-wrap items-center gap-2 mt-1">
            <span
              className={
                material.quantity > 0
                  ? "text-black-500 font-bold text-base sm:text-lg"
                  : "text-red-500 font-bold text-base sm:text-lg"
              }
            >
              {material.quantity > 0 ? "Available" : "Out of Stock"}
            </span>
            <span className="text-black flex items-center gap-1">
              |<span className="font-bold text-base sm:text-lg">Quantity:</span>{" "}
              {material.quantity}
            </span>
          </p>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-3 sm:gap-5">
          {user_type !== "admin" && material.quantity > 0 && (
            <div
              className="flex items-center bg-gray-200 rounded-lg overflow-hidden text-white"
              style={{
                boxShadow: "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
              }}
            >
              <button
                onClick={handleDecrease}
                className="px-3 py-2 text-[#000000] hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                value={quantity !== null ? quantity : ""}
                min={1}
                max={material.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQuantity(null);
                  } else {
                    const parsedVal = parseInt(val);
                    if (!isNaN(parsedVal)) {
                      setQuantity(
                        Math.max(1, Math.min(parsedVal, material.quantity))
                      );
                    }
                  }
                }}
                className="w-14 h-9 text-center bg-white-200 text-[#000000] outline-none font-bold
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none 
                [-moz-appearance:textfield]"
              />
              <button
                onClick={handleIncrease}
                className="px-3 py-2 text-[#000000] hover:bg-gray-300"
              >
                +
              </button>
            </div>
          )}

          {/* Buttons for admin / user */}
          {user_type === "admin" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-[100px] sm:w-[120px] h-[38px] rounded-md bg-white text-black font-bold shadow-md hover:bg-[#03aa6c] hover:text-white transition duration-200"
              style={{
                boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
              }}
            >
              EDIT
            </button>
          ) : material.quantity > 0 ? (
            <button
              onClick={handleSave}
              className="w-[100px] sm:w-[120px] h-[38px] rounded-md bg-white text-black font-bold text-lg shadow-md hover:bg-[#03aa6c] hover:text-white transition duration-200"
              style={{
                boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
              }}
            >
              ADD
            </button>
          ) : (
            <button
              disabled
              className="w-[100px] sm:w-[120px] h-[38px] rounded-md bg-gray-400 text-white font-bold text-lg shadow-md cursor-not-allowed opacity-80"
              style={{
                boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              ADD
            </button>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditMaterialModal
          material={material}
          onClose={() => setIsModalOpen(false)}
          onSave={refreshEquipmentList}
          onDelete={handleDelete}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white/70 px-6 py-4 rounded-lg shadow-lg text-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl text-green-700 mb-2">✓</span>
              <p className="text-lg font-semibold text-black">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Material;
