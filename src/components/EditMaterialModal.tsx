import { useState, useEffect } from "react";

interface Material {
  id: number;
  name: string;
  quantity: number;
}

interface EditMaterialModalProps {
  material: Material;
  onClose: () => void;
  onSave: (newName: string, newQuantity: number) => void;
}

const EditMaterialModal: React.FC<EditMaterialModalProps> = ({ material, onClose, onSave }) => {
  const [newName, setNewName] = useState<string>(material.name);
  const [newQuantity, setNewQuantity] = useState<number>(material.quantity);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        onSave(newName, newQuantity);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [newName, newQuantity, onClose, onSave]); // Dependencies ensure it updates correctly

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-[420px] transition-opacity duration-200 opacity-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Edit Material</h2>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1931]"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
        <input
          type="number"
          className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8C1931]"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(newName, newQuantity)}
            className="px-5 py-2 bg-[#8C1931] text-white rounded-lg hover:bg-[#6f1427] transition font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialModal;