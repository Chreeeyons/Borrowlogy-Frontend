const BASE_URL =
  "https://borrowlogy-backend-production.up.railway.app/user/user";

export const addUser = async (UserData: {
  name: string;
  email: string;
  username: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/create_borrower/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(UserData),
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

export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/userget/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }); // Assuming user_id is 1 for demo purposes
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};

export const updateHistory = async ({
  items,
  remarks,
  transaction_id,
  cart_id,
}: {
  items: any;
  remarks: string;
  transaction_id: number | null;
  cart_id: number | null;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/update_history/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items,
        remarks: remarks,
        transaction_id: transaction_id,
        cart_id: cart_id,
      }),
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("Error adding equipment:", error);
    return null;
  }
};
