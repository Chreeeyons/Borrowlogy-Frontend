"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

const Cart = () => {
  const searchParams = useSearchParams();
  const cartData = searchParams.get("cart");

  const [transactionNumber, setTransactionNumber] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [remarks, setRemarks] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const effectRan = useRef(false);

  // Load transaction number from localStorage
  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const lastTransaction = localStorage.getItem("lastTransactionNumber");
    const newTransactionNumber = lastTransaction ? parseInt(lastTransaction, 10) + 1 : 1;

    setTransactionNumber(newTransactionNumber);
    localStorage.setItem("lastTransactionNumber", newTransactionNumber.toString());
  }, []);

  // Parse cart data from URL params
  useEffect(() => {
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Invalid cart data:", error);
      }
    }
  }, [cartData]);

  // Function to confirm the transaction
  const confirmTransaction = () => {
    const transactionHistory = JSON.parse(localStorage.getItem("transactionHistory") || "[]");
    const newTransaction = {
      transactionNumber,
      date: new Date().toLocaleString(),
      cart,
      remarks,
    };
    transactionHistory.push(newTransaction);
    localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));

    // Clear cart and close modal
    setCart([]);
    setRemarks("");
    setShowConfirmModal(false);
    console.log("Transaction confirmed");
  };

  // Function to confirm transaction cancellation
  const confirmCancelTransaction = () => {
    setCart([]);
    localStorage.removeItem("lastTransactionNumber");
    setTransactionNumber(1);
    setRemarks("");
    setShowModal(false);
  };

  if (cart.length === 0) return null;

  return (
    <div className="border p-4 bg-[#8C1931] rounded-md text-white">
      <p className="text-2xl font-semibold tracking-wider">Transaction #{transactionNumber}</p>

      <ul className="mt-2 list-disc pl-20">
        {cart.map((item) => (
          <li key={item.id} className="py-2 flex items-center">
            <span className="w-64 truncate">{item.name}</span>
            <span className="w-20 text-right">{item.quantity} pcs</span>
          </li>
        ))}
      </ul>

      <label className="font-medium block mt-4">
        Remarks:
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
          placeholder="Enter remarks here..."
        ></textarea>
      </label>

      <div className="flex justify-between mt-4">
        <button onClick={() => setShowModal(true)} className="bg-white text-[#8C1931] px-4 py-2 rounded">
          Remove
        </button>
        <button onClick={() => setShowConfirmModal(true)} className="bg-white text-[#8C1931] px-4 py-2 rounded">
          Confirm
        </button>
      </div>

      {/* Confirmation Modal for Cancelling */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-md shadow-lg">
            <p className="text-lg font-normal">Are you sure you want to cancel this transaction?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">
                No
              </button>
              <button onClick={confirmCancelTransaction} className="px-4 py-2 bg-red-500 text-white rounded">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Completing Transaction */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-md shadow-lg">
            <p className="text-lg font-semibold">Are you sure you want to confirm this transaction?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowConfirmModal(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">
                No
              </button>
              <button onClick={confirmTransaction} className="px-4 py-2 bg-green-500 text-white rounded">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
