"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";

//PLACEHOLDER ONLY
const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [borrowers, setBorrowers] = useState([
    {
      name: "Chraine Paul Tuazon",
      email: "cstuazon3@up.edu.ph",
      borrowHistory: [
        { material: "Beaker", quantity: 1, borrowedDate: "03/25/2025", returnedDate: "03/25/2025" },
        { material: "Microscope", quantity: 2, borrowedDate: "03/25/2025", returnedDate: "03/25/2025" },
        { material: "Test Tube", quantity: 4, borrowedDate: "03/25/2025", returnedDate: "03/25/2025" }
      ],
      remarks: ""
    }
  ]);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    email: "",
    borrowHistory: [],
    remarks: ""
  });

  useEffect(() => {
    setHeaderTitle("BORROWER'S MASTERLIST");
  }, []);

  const filteredBorrowers = borrowers.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  interface BorrowHistoryItem {
    material: string;
    quantity: number;
    borrowedDate: string;
    returnedDate?: string;
  }

  interface Borrower {
    name: string;
    email: string;
    borrowHistory: BorrowHistoryItem[];
    remarks: string;
  }

  const getStatus = (user: Borrower): "RETURNED" | "PENDING" => {
    return user.borrowHistory.every((item) => item.returnedDate) ? "RETURNED" : "PENDING";
  };

  const handleAddBorrower = () => {
    setBorrowers([...borrowers, newBorrower]);
    setNewBorrower({ name: "", email: "", borrowHistory: [], remarks: "" });
    setIsAddingNew(false);
  };

  // Borrower detail view
  if (selectedBorrower) {
    const status = getStatus(selectedBorrower);
    return (
      <div className="p-6 text-white">
        <div className="bg-[#8C1931] rounded-lg p-6">
          <h2 className="text-3xl font-bold flex items-center justify-between">
            {selectedBorrower.name}
            <span className={`ml-4 px-3 py-1 text-sm rounded ${
              status === "RETURNED" ? "bg-green-700" : "bg-yellow-500"
            }`}>
              {status}
            </span>
          </h2>
          <p className="text-md mb-4">{selectedBorrower.email}</p>

          <table className="w-full mb-4 text-white">
            <thead>
              <tr>
                <th className="text-left">Material</th>
                <th>Quantity</th>
                <th>Date Borrowed</th>
                <th>Date Returned</th>
              </tr>
            </thead>
            <tbody>
              {selectedBorrower.borrowHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.material}</td>
                  <td>{item.quantity} pcs</td>
                  <td>{item.borrowedDate}</td>
                  <td>{item.returnedDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-4">
            <label className="block font-bold mb-2">REMARKS:</label>
            <textarea
              className="w-full h-28 p-2 text-white rounded border border-white"
              value={selectedBorrower.remarks}
              onChange={(e) =>
                setSelectedBorrower({ ...selectedBorrower, remarks: e.target.value })
              }
            />
          </div>

          <button
            onClick={() => setSelectedBorrower(null)}
            className="text-[#8C1931] bg-white px-6 py-2 rounded shadow-md"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="relative p-6 text-white">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="flex-grow p-2 rounded text-black border-2 border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setIsAddingNew(true)}
          className="ml-2 bg-[#8C1931] px-4 py-2 rounded shadow-md"
        >
          <span>+</span> ADD
        </button>
      </div>

      <div className="bg-[#EEE9E5] rounded-lg shadow-md text-[#8C1931] p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="font-bold text-lg">
              <th>NAME</th>
              <th>EMAIL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.map((borrower, index) => {
              const status = getStatus(borrower);
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-200 cursor-pointer"
                  onClick={() => setSelectedBorrower(borrower)}
                >
                  <td className="py-2">{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>
                    <span
                      className={`px-3 py-1 inline-block rounded text-white text-sm ${
                        status === "RETURNED" ? "bg-green-700" : "bg-yellow-500"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-[#8C1931] rounded-lg p-6 w-full max-w-md mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Borrower</h2>

            <div className="mb-4">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                className="w-full p-2 text-black rounded border border-[#8C1931]"
                value={newBorrower.name}
                onChange={(e) => setNewBorrower({ ...newBorrower, name: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="w-full p-2 text-black rounded border border-[#8C1931]"
                value={newBorrower.email}
                onChange={(e) => setNewBorrower({ ...newBorrower, email: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingNew(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBorrower}
                className="bg-[#04543C] text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipments;
