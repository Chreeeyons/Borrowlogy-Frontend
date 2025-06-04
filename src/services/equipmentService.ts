const BASE_URL =
  "https://borrowlogy-backend-production.up.railway.app/api/equipment";

/**
 * Fetch all equipment.
 */
export const getEquipment = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get_equipment/`);
    if (!response.ok) throw new Error("Failed to fetch equipment");
    return await response.json();
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return null;
  }
};

/**
 * Add new equipment.
 * @param {object} equipmentData - { name: string, quantity: number }
 */
export const addEquipment = async (equipmentData: {
  name: string;
  quantity: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/add_equipment/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipmentData),
    });

    // Try to parse the response body even on error
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Log the backend error for debugging
      console.error("Backend error:", data);
      // Return the error to the UI
      return { error: data?.error || "Failed to add equipment" };
    }

    return data;
  } catch (error) {
    console.error("Error adding equipment:", error);
    return { error: "Network or server error" };
  }
};

/**
 * Edit existing equipment.
 * @param {object} equipmentData - { pk: number, name?: string, quantity?: number }
 */
export const editEquipment = async (equipmentData: {
  pk: number;
  name?: string;
  quantity?: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/edit_equipment/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) throw new Error("Failed to edit equipment");
    return await response.json();
  } catch (error) {
    console.error("Error editing equipment:", error);
    return null;
  }
};

/**
 * Delete equipment by ID.
 * @param {number} pk - The primary key (ID) of the equipment.
 */
export const deleteEquipment = async (pk: number) => {
  try {
    const response = await fetch(`${BASE_URL}/delete_equipment/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pk }),
    });

    if (!response.ok) throw new Error("Failed to delete equipment");
    return await response.json();
  } catch (error) {
    console.error("Error deleting equipment:", error);
    return null;
  }
};
