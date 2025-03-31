"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowers, setBorrowers] = useState([
    { name: "Borrower1", email: "borrower1@up.edu.ph", status: "RETURNED" },
    { name: "Borrower2", email: "borrower2@up.edu.ph", status: "PENDING" },
    { name: "Borrower3", email: "borrower3@up.edu.ph", status: "RETURNED" },
    { name: "Borrower4", email: "borrower4@up.edu.ph", status: "PENDING" },
  ]);

  useEffect(() => {
    setHeaderTitle("Borrower's Master List");
  }, []);

  const filteredBorrowers = borrowers.filter((borrower) =>
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="borrow-master-list" className="section p-4 text-white">
      <div className="bg-[#8C1931] p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded text-white border border-white p-1"
          />
          <button className="bg-white text-[#8C1931] ml-14 px-6 py-2 rounded">Add</button>
        </div>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
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
                      borrower.status === "RETURNED" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {borrower.status}
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
    </div>
  );
};

export default Equipments;
