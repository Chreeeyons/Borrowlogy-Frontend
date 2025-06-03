import { clearCart, getCart, removeCartItems } from "@/services/cartService";
import { addHistory } from "@/services/historyService";
import { updateCartItemQuantity } from "@/services/cartService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any>({ items: [] });
  const [remarks, setRemarks] = useState<string>("");
  const { data: session, status } = useSession();
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("Session:", session);
  const fetchCartData = async () => {
    try {
      const data = await getCart(session?.user?.id); // Assuming user_id is 1 for demo purposes
      console.log("Fetched Cart Data:", data);
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
    if (!session?.user?.id) return; // Ensure user ID is available
    fetchCartData();
  }, [session?.user?.id]); // Refetch when user ID changes

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
      user_id: session?.user?.id,
      cart_id: cartItems?.cart_id,
      borrower_date: new Date(),
      remarks: remarks ?? "",
    });
    fetchCartData();
    setRemarks("");
    setIsModalOpen(true); // Show modal

    // Auto-hide modal after 3 seconds
    setTimeout(() => {
      setIsModalOpen(false);
    }, 3000);
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

  const handleIncrease = async (index: number) => {
    const updatedItems = [...cartItems.items];
    updatedItems[index].quantity += 1;

    // Update backend
    await updateCartItemQuantity({
      cart_id: cartItems.cart_id,
      equipment_id: updatedItems[index].equipment_id,
      quantity: updatedItems[index].quantity,
    });

    setCartItems({ ...cartItems, items: updatedItems });
    fetchCartData(); // Refetch to sync with backend
  };

  const handleDecrease = async (index: number) => {
    const updatedItems = [...cartItems.items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;

      // Update backend
      await updateCartItemQuantity({
        cart_id: cartItems.cart_id,
        equipment_id: updatedItems[index].equipment_id,
        quantity: updatedItems[index].quantity,
      });

      setCartItems({ ...cartItems, items: updatedItems });
      fetchCartData(); // Refetch to sync with backend
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#EEE9E5",
        borderRadius: "20px",
        boxShadow: "3px 3px 6px 0px rgba(0, 0, 0, 0.25) inset",
        padding: "1rem",
        color: "#000000",
      }}
    >
      <p className="text-4xl font-semibold tracking-normal">
        Transaction #{cartItems?.cart_id}
      </p>

      {/* Select All */}
      {cartItems.items.length > 0 && (
        <div className="pl-4 sm:pl-20 mt-4">
          <label className="flex items-center space-x-2 font-bold">
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
      <ul className="mt-2 ml-4 sm:ml-12 list-disc pl-5 sm:pl-20">
        {cartItems?.items?.map((item: any, index: number) => (
          <li
            key={index}
            className="py-2 flex flex-col sm:flex-row sm:items-center"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-3"
                checked={checkedItems[index] || false}
                onChange={() => handleCheckboxChange(index)}
              />
              {/* Responsive text container: max width and truncate */}
              <span className="max-w-[16rem] sm:max-w-[16rem] truncate">
                {item.equipment_name}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center bg-white rounded-lg overflow-hidden h-9 self-start">
              <button
                onClick={() => handleDecrease(index)}
                className="w-9 h-full text-[#000000] hover:bg-gray-200 flex items-center justify-center"
                style={{
                  boxShadow: "none",
                  borderRight: "none",
                }}
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 h-full text-center bg-white text-[#000000] font-bold border-0 outline-none"
                style={{
                  boxShadow: "none",
                }}
              />
              <button
                onClick={() => handleIncrease(index)}
                className="w-9 h-full text-[#000000] hover:bg-gray-200 flex items-center justify-center"
                style={{
                  boxShadow: "none",
                  borderLeft: "none",
                }}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>


      {/* Remarks input */}
      <label className="font-bold block mt-4 text-black">
        Remarks:
        <textarea
          placeholder="Enter remarks here..."
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
          style={{
            width: "100%",
            height: "100px",
            borderRadius: "12px",
            background: "#FFF",
            boxShadow: "3px 3px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
            padding: "0.5rem",
            marginTop: "0.5rem",
            color: "#000",
            fontWeight: "400",
            fontFamily: "inherit",
            resize: "none",
          }}
        />
      </label>

      {/* Action buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleClearCart}
          style={{
            width: "120px",
            height: "38.234px",
            flexShrink: 0,
            borderRadius: "6px",
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
            (e.currentTarget as HTMLButtonElement).style.background = "#5e0708";
            (e.currentTarget as HTMLButtonElement).style.color = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.color = "#000000";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
          }}
        >
          Remove
        </button>

        <button
          onClick={handleSubmit}
          style={{
            width: "120px",
            height: "38.234px",
            flexShrink: 0,
            borderRadius: "6px",
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
            (e.currentTarget as HTMLButtonElement).style.background = "#03aa6c";
            (e.currentTarget as HTMLButtonElement).style.color = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
            (e.currentTarget as HTMLButtonElement).style.color = "#000000";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "4px 4px 8px 2px rgba(0, 0, 0, 0.3)";
          }}
          disabled={cartItems.items.length === 0}
        >
          Submit
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white/70 px-6 py-4 rounded-lg shadow-lg text-center backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl text-green-700 mb-2">✓</span>
              <p className="text-lg font-semibold text-black">
                Request Submitted!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
