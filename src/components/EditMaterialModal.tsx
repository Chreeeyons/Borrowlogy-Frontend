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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred Background */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-96">
        <h2 className="text-lg font-semibold">Edit Material</h2>
        <input
          type="text"
          className="w-full mt-4 p-2 border rounded"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          autoFocus
        />
        <input
          type="number"
          className="w-full mt-4 p-2 border rounded"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(newName, newQuantity)}
            className="px-4 py-2 bg-[#8C1931] text-white rounded hover:bg-[#6f1427]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterialModal;
