import { useState } from "react";
import EditChemicalModal from "./EditChemicalModal";
import { addtoCart } from "@/services/cartService";

interface ChemicalProps {
  user_type: string;
  chemical: {
    is_hazardous: boolean;
    brand_name: string;
    mass: number;        // changed from volume
    id: number;
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

  const handleIncrease = () => {
    if (quantity !== null && quantity < chemical.mass) {  // updated here
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
      await addtoCart({
        user_id: 1,
        quantity: quantity,
        chemical_id: chemical.id,
      } as any);

      setSuccessMessage("Successfully added to cart!");
      setTimeout(() => setSuccessMessage(""), 3000);
      refreshChemicalList();
    } catch (error) {
      console.error("Error adding chemical:", error);
    }
  };

  return (
    <div>
      <div
        className="p-4 mb-2 bg-[#EEE9E5] shadow-md flex justify-between items-center rounded-lg"
        style={{
          borderRadius: "12px",
          boxShadow: `3px 3px 6px 0px rgba(0, 0, 0, 0.25) inset`,
        }}
      >
        <div>
          <h2 className="text-black text-4xl font-semibold mb-0 tracking-normal">
            {chemical.chemical_name}
          </h2>
          <p className="text-sm font-normal flex items-center gap-2">
            <span
              className={
                chemical.mass > 0  // updated here
                  ? "text-black-500 font-bold text-lg"
                  : "text-red-500 font-bold text-lg"
              }
            >
              {chemical.mass > 0 ? "Available" : "Out of Stock"} {/* updated here */}
            </span>
            <span className="text-black flex items-center gap-1">
              |<span className="font-bold text-lg">Mass:</span>{" "} {/* updated label */}
              {chemical.mass} g {/* updated here */}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-5">
          {user_type !== "admin" && chemical.mass > 0 && (  // updated here
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
                max={chemical.mass}  // updated here
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setQuantity(null);
                  } else {
                    const parsedVal = parseInt(val);
                    if (!isNaN(parsedVal)) {
                      setQuantity(
                        Math.max(1, Math.min(parsedVal, chemical.mass))  // updated here
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

          {user_type !== "admin" && chemical.mass > 0 && (  // updated here
            <button
              onClick={handleSave}
              style={{
                width: '120px',
                height: '38.234px',
                flexShrink: 0,
                borderRadius: '5.771px',
                background: '#FFF',
                boxShadow: "4px 4px 8px 2px rgba(0, 0, 0, 0.3)",
                color: '#000000',
                textAlign: 'center',
                textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                fontFamily: 'Jost, sans-serif',
                fontSize: '21.139px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#03aa6c';
                (e.currentTarget as HTMLButtonElement).style.color = '#FFF';
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  '6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFF';
                (e.currentTarget as HTMLButtonElement).style.color = '#000000';
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
          onRefresh={refreshChemicalList} 
          onSave={() => {}}
        />
      )}

      {successMessage && (
        <div className="mt-2 text-green-600 font-semibold">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Chemical;
