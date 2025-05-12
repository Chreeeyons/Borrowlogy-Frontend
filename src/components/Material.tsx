import { useState } from "react";
import EditMaterialModal from "./EditMaterialModal";
import { addtoCart } from "@/services/cartService";

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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/equipment/delete_equipment/",
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
        user_id: 1,
        quantity: quantity,
        equipment_id: material.id,
      });

      setSuccessMessage("Successfully added to cart!");
<<<<<<< HEAD

      setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide

=======
      setTimeout(() => setSuccessMessage(""), 3000); // Auto-hide
>>>>>>> 4b07b6a ([fix][janna] allow deleting and typing new quantity in the input field)
      refreshEquipmentList();
    } catch (error) {
      console.error("Error adding equipment:", error);
    }
  };

  return (
    <div>
      <div
        className="p-4 mb-2 bg-[#83191c] shadow-md flex justify-between items-center rounded-lg"
        style={{
          borderRadius: "12px",
          boxShadow:
            "inset 0px 2px 4px rgba(0, 0, 0, 0.7), inset 0px 2px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div>
          <h2 className="text-white text-3xl font-semibold mb-2 tracking-normal">
            {material.name}
          </h2>
          <p className="text-sm font-normal flex items-center gap-2">
            <span
              className={
                material.quantity > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {material.quantity > 0 ? "Available" : "Out of Stock"}
            </span>
            <span className="text-white">| Quantity: {material.quantity}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-5">
          {user_type !== "admin" && material.quantity > 0 && (
            <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden text-white">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 text-[#8C1931] hover:bg-gray-300"
              >
                -
              </button>
              <input
<<<<<<< HEAD
                type="text"
                value={quantity}
                readOnly
                className="w-12 h-9 text-center font-bold bg-gray-200 text-[#8C1931]"
=======
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
                className="w-16 h-9 text-center bg-gray-200 text-[#8C1931] outline-none 
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none 
                [-moz-appearance:textfield]"
>>>>>>> 4b07b6a ([fix][janna] allow deleting and typing new quantity in the input field)
              />
              <button
                onClick={handleIncrease}
                className="px-3 py-2 text-[#8C1931] hover:bg-gray-300"
              >
                +
              </button>
            </div>
          )}

          {user_type === "admin" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                width: "138.509px",
                height: "38.234px",
                flexShrink: 0,
                borderRadius: "5.771px",
                background: "#FFF",
                boxShadow: "6px 6px 4px 0px rgba(0, 0, 0, 0.25) inset",
                color: "#8C1931",
                textAlign: "center",
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                fontFamily: "Jost",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "normal",
                fontStyle: "bold",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#03aa6c";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFF";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#FFF";
                (e.currentTarget as HTMLButtonElement).style.color = "#8C1931";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "6px 6px 4px 0px rgba(0, 0, 0, 0.25) inset";
              }}
            >
              EDIT
            </button>
          ) : material.quantity > 0 ? (
            <div className="flex flex-col items-start">
              <button
                className="bg-[#04543C] text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <button
              disabled
              style={{
                width: "138.509px",
                height: "38.234px",
                flexShrink: 0,
                borderRadius: "5.771px",
                background: "#B0B0B0",
                boxShadow: "inset 0px 2.886px 2.886px rgba(0, 0, 0, 0.25)",
                color: "#FFFFFF",
                textAlign: "center",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                fontFamily: "Jost, sans-serif",
                fontSize: "21.139px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                cursor: "not-allowed",
                opacity: 0.8,
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
              <p className="text-lg font-semibold text-[#04543C]">
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
