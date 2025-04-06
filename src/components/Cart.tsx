const Cart = () => {
  return (
    <div className="border p-4 bg-[#8C1931] rounded-md text-white">
      {/* Transaction number placeholder */}
      <p className="text-2xl font-semibold tracking-wider">Transaction #___</p>

      {/* Items in cart placeholder */}
      <ul className="mt-2 list-disc pl-20">
        <li className="py-2 flex items-center">
          <span className="w-64 truncate">Item Name 1</span>
          <span className="w-20 text-right">__ pcs</span>
        </li>
        <li className="py-2 flex items-center">
          <span className="w-64 truncate">Item Name 2</span>
          <span className="w-20 text-right">__ pcs</span>
        </li>
        <li className="py-2 flex items-center">
          <span className="w-64 truncate">Item Name 3</span>
          <span className="w-20 text-right">__ pcs</span>
        </li>
      </ul>

      {/* Remarks input placeholder */}
      <label className="font-medium block mt-4">
        Remarks:
        <textarea
          className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
          placeholder="Enter remarks here..."
          readOnly
        ></textarea>
      </label>

      {/* Action buttons (placeholders) */}
      <div className="flex justify-between mt-4">
        <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Remove</button>
        <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Confirm</button>
      </div>
    </div>
  );
};

export default Cart;
