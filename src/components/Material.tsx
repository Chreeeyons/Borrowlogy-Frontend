const Material = ({
  user_type,
  material,
}: {
  user_type: string;
  material: { id: number; name: string; quantity: number };
}) => (
  <div>
    <div
      key={material.id}
      className="p-4 mb-4 bg-white shadow-md flex justify-between items-center rounded-lg"
    >
      <div>
        <h2 className="text-xl font-semibold">{material.name}</h2>
        <p
          className={`font-bold ${
            material.quantity > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {material.quantity > 0 ? "Available" : "Out of Stock"}
        </p>
        <p className="text-gray-500">Quantity: {material.quantity}</p>
      </div>
      {user_type === "admin" ? (
        <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600">
          Edit
        </button>
      ) : material.quantity > 0 ? (
        <button className="bg-red-500 text-white px-4 py-2 rounded cursor-not-allowed">
          Add to Cart
        </button>
      ) : (
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
          disabled
        >
          Add to Cart
        </button>
      )}
    </div>
  </div>
);

export default Material;
