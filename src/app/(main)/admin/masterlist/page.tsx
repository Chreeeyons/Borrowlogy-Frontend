"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";
import { addUser, getUsers } from "@/services/userService";

// Interfaces
interface BorrowTransaction {
  transactionId: number;
  borrowedDate: string;
  returnedDate?: string;
  materials: {
    name: string;
    quantity: number;
  }[];
  borrowerRemarks?: string;
  labTechRemarks?: string;
}

interface Borrower {
  name: string;
  email: string;
  transactions: BorrowTransaction[];
}

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [borrowers, setBorrowers] = useState<Borrower[]>([
    {
      name: "Ronan L. Alcordo",
      email: "rlalcordo@up.edu.ph",
      transactions: [
        {
          transactionId: 1,
          borrowedDate: "03/25/2025",
          returnedDate: "03/25/2025",
          materials: [
            { name: "BEAKER", quantity: 1 },
            { name: "MICROSCOPE", quantity: 2 },
            { name: "TEST TUBE", quantity: 4 },
          ],
          borrowerRemarks: "",
          labTechRemarks: "",
        },
        {
          transactionId: 2,
          borrowedDate: "03/25/2025",
          materials: [
            { name: "BEAKER", quantity: 1 },
            { name: "MICROSCOPE", quantity: 2 },
          ],
        },
      ],
    },
  ]);

  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(
    null
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<BorrowTransaction | null>(null);
  const [newBorrower, setNewBorrower] = useState({
    name: "",
    email: "",
    transactions: [] as BorrowTransaction[],
  });

  useEffect(() => {
    getUsersData();
    setHeaderTitle("Borrower's Masterlist");
  }, []);

  const getUsersData = async () => {
    const response = await getUsers();
    console.log(response);
  };

  const filteredBorrowers = borrowers.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOverallStatus = (user: Borrower): "RETURNED" | "PENDING" => {
    return user.transactions.every((t) => t.returnedDate)
      ? "RETURNED"
      : "PENDING";
  };

  const handleAddBorrower = () => {
    setBorrowers([
      ...borrowers,
      {
        ...newBorrower,
        transactions: [],
      },
    ]);
    setNewBorrower({ name: "", email: "", transactions: [] });
    setIsAddingNew(false);
  };

  const statusColor = (returned: boolean) =>
    returned ? "text-green-800 font-semibold" : "text-yellow-700 font-semibold";

  const buttonBase = "px-6 py-2 rounded shadow-md font-bold transition-colors duration-300";
  const buttonPrimary = `${buttonBase} bg-white text-[#8C1931] hover:bg-green-600 hover:text-white`;

  // Detailed Transaction View
  if (selectedTransaction && selectedBorrower) {
    return (
      <div className="p-6 text-white">
        <div className="bg-[#8C1931] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {selectedBorrower.name}
              </h2>
              <p className="text-md">{selectedBorrower.email}</p>
            </div>
            <span
              className={`px-4 py-2 rounded font-bold ${
                selectedTransaction.returnedDate
                  ? "bg-green-700"
                  : "bg-yellow-500"
              }`}
            >
              {selectedTransaction.returnedDate ? "RETURNED" : "PENDING"}
            </span>
          </div>

          <table className="w-full mb-6 text-white table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Date Borrowed</th>
                <th className="px-4 py-2">Date Returned</th>
              </tr>
            </thead>
            <tbody>
              {selectedTransaction.materials.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity} pcs</td>
                  <td className="px-4 py-2">{selectedTransaction.borrowedDate}</td>
                  <td className="px-4 py-2">{selectedTransaction.returnedDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-bold mb-2">BORROWER’S REMARKS:</h3>
              <textarea
                value={selectedTransaction.borrowerRemarks || ""}
                readOnly
                className="w-full h-28 p-2 rounded text-black bg-white"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">LAB TECH’S REMARKS:</h3>
              <textarea
                value={selectedTransaction.labTechRemarks || ""}
                onChange={(e) =>
                  setSelectedTransaction({
                    ...selectedTransaction,
                    labTechRemarks: e.target.value,
                  })
                }
                className="w-full h-28 p-2 rounded text-black bg-white"
              />
            </div>
          </div>

          <button
            onClick={() => setSelectedTransaction(null)}
            className="bg-white text-[#8C1931] px-6 py-2 rounded shadow-md font-bold hover:bg-green-600 hover:text-white transition-colors duration-300"
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }

  // Borrower Detail View
  if (selectedBorrower) {
    return (
      <div className="p-6 text-white">
        <div className="bg-[#8C1931] rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white">
            {selectedBorrower.name}
          </h2>
          <p className="text-md mb-6">{selectedBorrower.email}</p>

          <table className="w-full mb-4 text-white table-auto">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Transaction No.</th>
                <th className="px-4 py-2">Date Borrowed</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedBorrower.transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-[#a63a4f]"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <td className="px-4 py-2">#{tx.transactionId}</td>
                  <td className="px-4 py-2">{tx.borrowedDate}</td>
                  <td className={`px-4 py-2 ${statusColor(!!tx.returnedDate)}`}>
                    {tx.returnedDate ? "Returned" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setSelectedBorrower(null)}
            className="bg-white text-[#8C1931] px-6 py-2 rounded shadow-md font-bold hover:bg-green-600 hover:text-white transition-colors duration-300 mt-4"
            >
            BACK
          </button>
        </div>
      </div>
    );
  }

  // Masterlist View
  return (
<div className="relative p-6 text-white">
  <div className="flex items-center mb-4 w-full relative">
    {/* Heroicons magnifying glass */}
    <div className="absolute left-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>
    </div>

    <input
      type="text"
      placeholder="Search for borrowers..."
      className="w-full pl-10 pr-3 py-2 rounded-[20px] bg-[#E3E1DD] outline-none text-black"
      style={{
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset',
      }}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
      <button
        onClick={() => setIsAddingNew(true)}
        className="flex items-center gap-2 ml-5 px-8 py-2 text-white rounded-[10px] font-bold transition duration-300 ease-in-out"
        style={{
          backgroundColor: '#8C1931',
          boxShadow: 'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)',
          fontFamily: 'Jost, sans-serif',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#7A1729';
          e.currentTarget.style.boxShadow =
            '0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#8C1931';
          e.currentTarget.style.boxShadow =
            'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span className="text-lg">+</span> Add
      </button>
      </div>

      <div className="bg-[#EEE9E5] rounded-lg shadow-md text-[#8C1931] p-4">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="font-bold text-lg">
            <th className="px-4 py-2">NAME</th>
            <th className="px-4 py-2">EMAIL</th>
            <th className="px-4 py-2">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filteredBorrowers.map((borrower, index) => {
            const status = getOverallStatus(borrower);
            return (
              <tr
                key={index}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => setSelectedBorrower(borrower)}
              >
                <td className="px-4 py-2">{borrower.name}</td>
                <td className="px-4 py-2">{borrower.email}</td>
                <td className="px-4 py-2 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 inline-block rounded text-white text-sm ${
                      status === "RETURNED" ? "bg-green-700" : "bg-yellow-500"
                    }`}
                  >
                    {status}
                  </span>
                  <span className="text-[#8C1931] text-4xl">▾</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Add Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-[#8C1931] rounded-lg p-6 w-full max-w-md mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Add New Borrower
            </h2>

            <div className="mb-4">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                className="w-full p-2 text-black rounded border border-[#8C1931]"
                value={newBorrower.name}
                onChange={(e) =>
                  setNewBorrower({ ...newBorrower, name: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                className="w-full p-2 text-black rounded border border-[#8C1931]"
                value={newBorrower.email}
                onChange={(e) =>
                  setNewBorrower({ ...newBorrower, email: e.target.value })
                }
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
                onClick={() => {
                  handleAddBorrower();
                  handleSubmit();
                }}
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
