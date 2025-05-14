const BASE_URL = "http://127.0.0.1:8000/cart/cart";

export const addtoCart = async (cartItemData: {
  user_id: number;
  equipment_id: number;
  quantity: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/add_item/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItemData),
    });

    if (!response.ok) {
      const errorText = await response.text(); // read full response error body
      console.error("Server responded with error:", response.status, errorText);
      throw new Error("Failed to add to cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding equipment:", error);
    return null;
  }
};

export const getCart = async (user_id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/get_cart/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    }); // Assuming user_id is 1 for demo purposes
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};

export const clearCart = async (cart_id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/clear_cart/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_id: cart_id }),
    }); // Assuming user_id is 1 for demo purposes
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};

export const approveCart = async ({
  cartItems,
  historyId,
}: {
  cartItems: any;
  historyId: any;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/approve_cart/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_items: cartItems, history_id: historyId }),
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("Error adding equipment:", error);
    return null;
  }
};

export const removeCartItems = async ({
  cart_id,
  equipment_ids,
}: {
  cart_id: number;
  equipment_ids: number[];
}) => {
  try {
    const response = await fetch(`${BASE_URL}/remove_items/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart_id, equipment_ids }),
    });

    if (!response.ok) throw new Error("Failed to remove items");
    return await response.json();
  } catch (error) {
    console.error("Error removing items:", error);
    return null;
  }
};
