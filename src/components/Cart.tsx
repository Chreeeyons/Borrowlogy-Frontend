import { clearCart, getCart, removeCartItems } from "@/services/cartService";
import { addHistory } from "@/services/historyService";
import { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any>({ items: [] });
  const [remarks, setRemarks] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCartData = async () => {
    try {
      const data = await getCart(1); // Assuming user_id is 1 for demo purposes
      const itemsWithQuantity =
        data?.items?.map((item: any) => ({
          ...item,
          quantity: item.total_quantity ?? 1,
        })) ?? [];

      setCartItems({ ...data, items: itemsWithQuantity });

      const initialCheckedState = itemsWithQuantity.reduce(
        (acc: any, _item: any, index: number) => {
          acc[index] = false;
          return acc;
        },
        {}
      );
      setCheckedItems(initialCheckedState);
      setSelectAll(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updated = {
      ...checkedItems,
      [index]: !checkedItems[index],
    };
    setCheckedItems(updated);

    const allChecked = Object.values(updated).every(Boolean);
    setSelectAll(allChecked);
  };

  const handleSelectAllChange = () => {
    const newValue = !selectAll;
    const newChecked = Object.keys(checkedItems).reduce(
      (acc: any, key: string) => {
        acc[Number(key)] = newValue;
        return acc;
      },
      {}
    );
    setCheckedItems(newChecked);
    setSelectAll(newValue);
  };

  const handleSubmit = async () => {
    await addHistory({
      user_id: 1,
      cart_id: cartItems?.cart_id,
      borrower_date: new Date(),
      remarks: remarks ?? "",
    });
    fetchCartData();
    setRemarks("");
    setIsModalOpen(true); // show modal
  };

  const handleClearCart = async () => {
    const itemsToRemove = cartItems.items
      .map((item: any, index: number) =>
        checkedItems[index] ? item.equipment_id : null
      )
      .filter((id: number | null) => id !== null);

    if (itemsToRemove.length === 0) {
      alert("Please select items to remove.");
      return;
    }

    await removeCartItems({
      cart_id: cartItems?.cart_id,
      equipment_ids: itemsToRemove,
    });

    fetchCartData();
  };

  const handleIncrease = (index: number) => {
    const updatedItems = [...cartItems.items];
    updatedItems[index].quantity += 1;
    setCartItems({ ...cartItems, items: updatedItems });
  };

  const handleDecrease = (index: number) => {
    const updatedItems = [...cartItems.items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
      setCartItems({ ...cartItems, items: updatedItems });
    }
  };

  return (
    <div
      className="p-4 text-white"
      style={{
        backgroundColor: "#83191c",
        borderRadius: "16px",
        boxShadow: "6px 6px 4px 0px rgba(0, 0, 0, 0.25) inset",
      }}
    >
      {/* Transaction number placeholder */}
      <p className="text-4xl font-semibold tracking-normal">
        Transaction #{cartItems?.cart_id}
      </p>

      {/* Select All */}
      {cartItems.items.length > 0 && (
        <div className="pl-20 mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <span>Select All</span>
          </label>
        </div>
      )}

      {/* Items in cart */}
      <ul className="mt-2 ml-12 list-disc pl-20">
        {cartItems?.items?.map((item: any, index: number) => (
          <li key={index} className="py-2 flex items-center">
            <input
              type="checkbox"
              className="mr-3"
              checked={checkedItems[index] || false}
              onChange={() => handleCheckboxChange(index)}
            />
            <span className="w-64 truncate">{item.equipment_name}</span>

            {/* Quantity Selector */}
            <div className="ml-4 flex items-center bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => handleDecrease(index)}
                className="px-3 py-1 text-[#8C1931] hover:bg-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 h-9 text-center bg-white text-[#8C1931] font-bold" //bold or not bold
              />
              <button
                onClick={() => handleIncrease(index)}
                className="px-3 py-1 text-[#8C1931] hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Remarks input placeholder */}
      <label className="font-bold block mt-4 text-white">
        REMARKS:
        <textarea
          style={{
            width: "100%",
            height: "100px",
            borderRadius: "10px",
            background: "#FFF",
            boxShadow: "3px 3px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
            padding: "0.5rem",
            marginTop: "0.5rem",
            color: "#000",
            fontWeight: "400",
            fontFamily: "inherit",
            resize: "vertical", // optional, allows resizing
          }}
          placeholder="Enter remarks here..."
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
        />
      </label>

      {/* Action buttons (styled per Figma) */}
      <div className="flex justify-between mt-4 gap-4">
        <button
          onClick={handleClearCart}
          style={{
            width: "138.509px",
            height: "38.234px",
            flexShrink: 0,
            borderRadius: "5.771px",
            background: "#FFF",
            boxShadow: "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
            color: "#8C1931",
            textAlign: "center",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            fontFamily: "Jost, sans-serif",
            fontSize: "21.139px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#5e0708";
            (e.currentTarget as HTMLButtonElement).style.color = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.color = "#8C1931";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset";
          }}
        >
          REMOVE
        </button>

        <button
          onClick={handleSubmit}
          style={{
            width: "138.509px",
            height: "38.234px",
            flexShrink: 0,
            borderRadius: "5.771px",
            background: "#FFF",
            boxShadow: "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
            color: "#8C1931",
            textAlign: "center",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            fontFamily: "Jost, sans-serif",
            fontSize: "21.139px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#5e0708";
            (e.currentTarget as HTMLButtonElement).style.color = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.color = "#8C1931";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25) inset";
          }}
          disabled={cartItems.items.length === 0}
        >
          SUBMIT
        </button>
      </div>
      {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg text-center text-black">
          <p className="text-lg font-semibold">Request Submitted!</p>
          <p className="mt-2">Your transaction has been recorded.</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-[#04543C] text-white rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
