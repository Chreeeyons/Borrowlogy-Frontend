import { useState } from "react";
import EditChemicalModal from "./EditChemicalModal";
import { addtoCart } from "@/services/cartService";
import { useSession } from "next-auth/react";

interface ChemicalProps {
  user_type: string;
  chemical: {
    hazard_type?: string;
    brand_name: string;
    mass: number; // changed from volume
    id: number;
    expiration_date?: string;
    location?: string;
    chemical_name: string;
  };
  refreshChemicalList: () => void;
}

const Chemical = ({
  user_type,
  chemical,
  refreshChemicalList,
}: ChemicalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | null>(1);
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session, status } = useSession();

  const handleIncrease = () => {
    if (quantity !== null && quantity < chemical.mass) {
      // updated here
      setQuantity((prev) => (prev !== null ? prev + 1 : 1));
    }
  };

  const handleDecrease = () => {
    if (quantity !== null && quantity > 1) {
      setQuantity((prev) => (prev !== null ? prev - 1 : 1));
    }
  };

  const handleSave = async () => {
    if (quantity === null) return;

    try {
      const response = await addtoCart({
        user_id: session?.user?.id ? Number(session.user.id) : 1, // Use session user ID or default to 1
        quantity: quantity,
        chemical_id: chemical.id,
      });

      setSuccessMessage("Successfully added to cart!");
      setTimeout(() => setSuccessMessage(""), 3000);
      refreshChemicalList();
    } catch (error) {
      console.error("Error adding chemical:", error);
    }
  };

  const handleDeleteChemical = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/chemicals/delete_chemical/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pk: chemical.id }), // include chemical ID in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete chemical");
      }

      refreshChemicalList(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting chemical:", error);
      alert("An error occurred while deleting the chemical.");
    }
  };

  return (
    <div>
      <div
        className="p-4 mb-2 bg-[#EEE9E5] shadow-md rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        style={{
          borderRadius: "12px",
          boxShadow: `3px 3px 6px 0px rgba(0, 0, 0, 0.25) inset`,
        }}
      >
        {/* LEFT: Chemical Info */}
        <div className="flex flex-col gap-1">
          <h2 className="text-black text-2xl md:text-4xl font-semibold mb-0 tracking-normal">
            {chemical.chemical_name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={
                chemical.mass > 0
                  ? "text-black-500 font-bold text-base"
                  : "text-red-500 font-bold text-base"
              }
            >
              {chemical.mass > 0 ? "Available" : "Out of Stock"}
            </span>
            <span className="text-black flex items-center gap-1">
              | <span className="font-bold text-base">Mass:</span>{" "}
              {chemical.mass} g
            </span>
            <span className="text-black flex items-center gap-1">
              | <span className="font-bold text-base">Brand:</span>{" "}
              {chemical.brand_name}
            </span>
            <span className="text-black flex items-center gap-1">
              | <span className="font-bold text-base">Hazard Type:</span>{" "}
              {chemical.hazard_type}
            </span>

            {user_type === "admin" && (
              <>
                <span className="text-black flex items-center gap-1">
                  | <span className="font-bold text-base">Expiry:</span>{" "}
                  {chemical.expiration_date}
                </span>
                <span className="text-black flex items-center gap-1">
                  | <span className="font-bold text-base">Location:</span>{" "}
                  {chemical.location}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap justify-end items-center gap-3 sm:gap-5">
          {user_type !== "admin" &&
            chemical.mass > 0 && ( // updated here
              <div
                className="flex items-center bg-gray-200 rounded-lg overflow-hidden text-white"
                style={{
                  boxShadow:
                    "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
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
                  max={chemical.mass} // updated here
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setQuantity(null);
                    } else {
                      const parsedVal = parseInt(val);
                      if (!isNaN(parsedVal)) {
                        setQuantity(
                          Math.max(1, Math.min(parsedVal, chemical.mass)) // updated here
                        );
                      }
                    }
                  }}
                  className="w-16 h-9 text-center bg-white-200 text-[#000000] outline-none font-bold
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

          {user_type === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                width: "120px",
                height: "38.234px",
                flexShrink: 0,
                borderRadius: "5.771px",
                background: "#FFF",
                boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
                color: "#000000",
                textAlign: "center",
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                fontFamily: "Jost",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "normal",
                fontStyle: "bold",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#03aa6c";
                e.currentTarget.style.color = "#FFF";
                e.currentTarget.style.boxShadow =
                  "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFF";
                e.currentTarget.style.color = "#000000";
                e.currentTarget.style.boxShadow =
                  "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
              }}
            >
              EDIT
            </button>
          )}

          {user_type !== "admin" &&
            chemical.mass > 0 && ( // updated here
              <button
                onClick={handleSave}
                style={{
                  width: "120px",
                  height: "38.234px",
                  flexShrink: 0,
                  borderRadius: "5.771px",
                  background: "#FFF",
                  boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
                  color: "#000000",
                  textAlign: "center",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Jost, sans-serif",
                  fontSize: "21.139px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
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
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#000000";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
                }}
              >
                ADD
              </button>
            )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditChemicalModal
          chemical={chemical}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedChemical) => {
            refreshChemicalList(); // Refresh the list to get the updated data
            setIsModalOpen(false);
          }}
          onDelete={handleDeleteChemical}
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

export default Chemical;
