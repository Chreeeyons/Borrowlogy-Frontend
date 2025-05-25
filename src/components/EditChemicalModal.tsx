import { useState, ChangeEvent, FormEvent } from "react";

interface Chemical {
  id: number;
  chemical_name: string;
  volume: number;
  volume_unit: string;
  brand_name: string;
  is_hazardous: boolean;
  expiration_date?: string;
  location?: string;
}

interface EditChemicalModalProps {
  chemical: Chemical;
  onClose: () => void;
  onSave: () => void;
  onRefresh: () => void;
}

const EditChemicalModal = ({
  chemical,
  onClose,
  onSave,
}: EditChemicalModalProps) => {
  const [formData, setFormData] = useState({
    chemical_name: chemical.chemical_name,
    volume: chemical.volume,
    volume_unit: chemical.volume_unit,
    brand_name: chemical.brand_name,
    is_hazardous: chemical.is_hazardous,
    expiration_date: chemical.expiration_date || "",
    location: chemical.location || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" && (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/chemicals/${chemical.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update chemical");
      }

      onSave();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Chemical</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Chemical Name</label>
            <input
              type="text"
              name="chemical_name"
              value={formData.chemical_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Volume</label>
            <input
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              min={0}
              step="any"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Volume Unit</label>
            <input
              type="text"
              name="volume_unit"
              value={formData.volume_unit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Brand Name</label>
            <input
              type="text"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_hazardous"
              checked={formData.is_hazardous}
              onChange={handleChange}
              id="hazardous-checkbox"
            />
            <label htmlFor="hazardous-checkbox" className="font-medium">
              Hazardous
            </label>
          </div>

          <div>
            <label className="block font-medium">Expiration Date</label>
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {error && (
            <div className="text-red-600 font-semibold">Error: {error}</div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChemicalModal;
