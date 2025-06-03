const BASE_URL = "http://127.0.0.1:8000/history/history";

export const addHistory = async (historydata: {
  user_id: any;
  cart_id: number;
  borrower_date: Date;
  remarks: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/create_history/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(historydata),
    });

    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("Error adding equipment:", error);
    return null;
  }
};

export const viewAllHistoryBorrower = async (user_id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/get_all_history_borrower/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user_id }),
    });
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};

export const viewAllHistory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get_all_history_borrower/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};
