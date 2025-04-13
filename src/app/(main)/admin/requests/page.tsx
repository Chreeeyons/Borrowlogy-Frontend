"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";
import { ChevronDown, ChevronUp } from "lucide-react"; // import icons

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [requests, setRequests] = useState([
    // Example data
    { borrowerName: "Janna Maureen Bantugan", date: "2023-04-01" },
    { borrowerName: "Angelinne Trocio", date: "2023-02-15" },
    { borrowerName: "Chraine Paul Tuazon", date: "2023-05-30"},
  ]);

  useEffect(() => {
    setHeaderTitle("Borrower's Requests");
  }, []);

  const toggleCard = (index: number) => {
    setExpandedCards((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Handle sorting
  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  // Sort requests based on selected order
  const sortedRequests = [...requests].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Filter requests based on the search query
  const filteredRequests = sortedRequests.filter((request) =>
    request.borrowerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="laboratory-materials" className="section">
      {/* Search Bar and Sort Dropdown on the Same Line */}
      <div className="flex items-center space-x-4 mb-4"> 
        <input
          type="text"
          placeholder="Search Borrower..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full max-w-2xl" // Make the search bar longer
        />
        <select
          className="p-2 border rounded-md ml-21"
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="asc">Sort by Date (Oldest to Newest)</option>
          <option value="desc">Sort by Date (Newest to Oldest)</option>
        </select>
      </div>


    {/* Name, Upmail, Date */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => {
          const isExpanded = expandedCards.includes(index);
          return (
            <div
              key={index}
              className="border p-4 bg-[#8C1931] rounded-md text-white cursor-pointer"
              // onClick={() => toggleCard(index)}
            >
              {/* Header with icon */}
              <div className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCard(index)}
              >
                <div>
                  <p className="text-2xl font-semibold tracking-wider">
                    {request.borrowerName}
                  </p>
                  <p className="text-sm font-normal tracking-wider mt-1">
                    {request.borrowerName.split(' ').join('').toLowerCase()}@up.edu.ph
                  </p>
                  <p className="text-xs font-light mt-1">
                    Date: {request.date}
                  </p>
                </div>
                <div className="ml-2">
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </div>
              </div>

              {/* Expandable content: Items, Remarks, Confirm Button */}
              {isExpanded && (
                <>
                <ul className="mt-4">
                  {[
                    { name: "Beaker", quantity: 1 },
                    { name: "Microscope", quantity: 2 },
                    { name: "Test Tube", quantity: 4 },
                  ].map((item, itemIndex) => (
                    <li key={itemIndex} className="py-2 flex items-center ml-10">
                      <div className="flex items-center w-64 space-x-2 truncate">
                        <input
                          type="checkbox"
                          id={`item-${index}-${itemIndex}`}
                          className="form-checkbox accent-white w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`item-${index}-${itemIndex}`}
                          className="text-white tracking-wide"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.name.toUpperCase()}
                        </label>
                      </div>
                      <span className="w-20 text-white text-right">{item.quantity} pcs</span>
                    </li>
                  ))}
                </ul>



                  <label className="font-normal block mt-4">
                    Remarks:
                    <textarea
                      value={"No remarks provided"}
                      className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
                      readOnly
                    />
                  </label>

                  <div className="flex justify-end mt-4">
                    <button className="bg-white text-[#8C1931] px-4 py-2 rounded">
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Equipments;
