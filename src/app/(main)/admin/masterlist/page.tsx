"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";

// Placeholder data for borrowers
// You can replace this with actual data from your API or state management
const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowers, setBorrowers] = useState<Array<{ name: string; email: string; status: string }>>([
    { name: "Borrower1", email: "borrower1@up.edu.ph", status: "RETURNED" },
    { name: "Borrower2", email: "borrower2@up.edu.ph", status: "PENDING" },
    { name: "Borrower3", email: "borrower3@up.edu.ph", status: "RETURNED" },
    { name: "Borrower4", email: "borrower4@up.edu.ph", status: "PENDING" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newBorrower, setNewBorrower] = useState({ name: "", email: "" });

  // Set the header title when the component mounts
  useEffect(() => {
    setHeaderTitle("Borrower's Master List");
  }, []);

  // Filter borrowers based on the search query
  const filteredBorrowers = borrowers.filter((borrower) =>
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    setShowModal(true); // Show the modal when the "Add" button is clicked
  };

  const handleCancel = () => {
    setShowModal(false); // Hide the modal when "Cancel" is clicked
    setNewBorrower({ name: "", email: "" }); // Reset form data
  };

  const handleConfirm = () => {
    if (newBorrower.name && newBorrower.email) {
      // Assign an empty string to status for new borrowers
      const newBorrowerWithStatus = { ...newBorrower, status: "" };
      setBorrowers([...borrowers, newBorrowerWithStatus]); // Add the new borrower to the list
      setShowModal(false); // Close the modal
      setNewBorrower({ name: "", email: "" }); // Reset form data
    } else {
      alert("Please fill in both name and email.");
    }
  };

  return (
    <div id="borrow-master-list" className="section p-2 text-white">
      <div className="bg-[#8C1931] p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded text-white border border-white p-1"
          />
          <button
            onClick={handleAddClick}
            className="ml-2 px-6 py-2 bg-[#04543C] text-white rounded hover:bg-green-700 flex items-center gap-1"
          >
            <span className="text-lg">+</span> Add
          </button>
        </div>

        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="p-2 tracking-wider text-lg">Name</th>
              <th className="p-2 tracking-wider text-lg">Email</th>
              <th className="p-2 tracking-wider text-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.map((borrower, index) => (
              <tr key={index}>
                <td className="p-2">{borrower.name}</td>
                <td className="p-2">{borrower.email}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 w-24 inline-block text-center rounded text-white ${
                      borrower.status === "RETURNED" ? "bg-green-500" : borrower.status === "" ? "bg-[#8C1931]" : "bg-yellow-500"
                    }`}
                  >
                    {/* Display status for newly added borrowers (Default status: Empty with bg-[#8C1931]) */}
                    {borrower.status === "" ? "" : borrower.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-6">
          <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Back</button>
          <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Save</button>
        </div>
      </div>

      {/* Modal for adding new borrower */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-[#04543C] text-center">Add Borrower</h2>
            <div className="mb-4">
              <label className="block mb-2 text-black">Name</label>
              <input
                type="text"
                value={newBorrower.name}
                onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                value={newBorrower.email}
                onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#04543C] text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipments;
