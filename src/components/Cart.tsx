import { clearCart, getCart } from "@/services/cartService";
import { addHistory } from "@/services/historyService";
import { use, useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});

  const fetchCartData = async () => {
    try {
      const data = await getCart(1); // Assuming user_id is 1 for demo purposes
      setCartItems(data);

      // Initialize checked state for each item
      const initialCheckedState = data?.items?.reduce((acc: any, item: any, index: number) => {
        acc[index] = false;
        return acc;
      }, {});
      setCheckedItems(initialCheckedState);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSubmit = async () => {
    await addHistory({
      user_id: 1, // Assuming user_id is 1 for demo purposes
      cart_id: cartItems?.cart_id, // Assuming cart_id is available in cartItems
      borrower_date: new Date(), // Current date
      remarks: remarks ?? "",
    }); // Replace with actual remarks input
    fetchCartData(); // Refresh cart data after submission
    setRemarks(""); // Clear remarks input
  };

  const handleClearCart = async () => {
    await clearCart(cartItems?.cart_id); // Assuming cart_id is available in cartItems
    fetchCartData(); // Refresh cart data after clearing
  };

  return (
    <div className="border p-4 bg-[#8C1931] rounded-md text-white">
      {/* Transaction number placeholder */}
      <p className="text-2xl font-semibold tracking-wider">
        Transaction #{cartItems?.cart_id}
      </p>

      {/* Items in cart placeholder */}
      <ul className="mt-2 list-disc pl-20">
        {cartItems?.items?.map((item: any, index: number) => (
          <li key={index} className="py-2 flex items-center">
            <input
              type="checkbox"
              className="mr-3"
              checked={checkedItems[index] || false}
              onChange={() => handleCheckboxChange(index)}
            />
            <span className="w-64 truncate">{item.equipment_name}</span>
            <span className="w-20 text-right">{item.total_quantity} pcs</span>
          </li>
        ))}
      </ul>

      {/* Remarks input placeholder */}
      <label className="font-medium block mt-4">
        Remarks:
        <textarea
          className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
          placeholder="Enter remarks here..."
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
        ></textarea>
      </label>

      {/* Action buttons (placeholders) */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-white text-[#8C1931] px-4 py-2 rounded"
          onClick={handleClearCart}
        >
          Remove
        </button>
        <button
          className="bg-white text-[#8C1931] px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Cart;