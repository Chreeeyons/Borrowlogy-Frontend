"use client";
import { useEffect, useRef, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [activeBorrower, setActiveBorrower] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<{ name: string; quantity: number }[]>([]);
  const [activeRequestIndex, setActiveRequestIndex] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [requestIndex: number]: Set<number> }>({});

  const modalRef = useRef<HTMLDivElement>(null);

  const [requests, setRequests] = useState([
    { borrowerName: "Janna Maureen Bantugan", date: "2023-04-01" },
    { borrowerName: "Angelinne Trocio", date: "2023-02-15" },
    { borrowerName: "Chraine Paul Tuazon", date: "2023-05-30" },
  ]);

  const itemData = [
    { name: "Beaker", quantity: 1 },
    { name: "Microscope", quantity: 2 },
    { name: "Test Tube", quantity: 4 },
  ];

  useEffect(() => {
    setHeaderTitle("Borrower's Requests");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
      if (e.key === "Enter" && showModal && selectedItems.length === 0) setShowModal(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, selectedItems]);

  const toggleCard = (index: number) => {
    setExpandedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSortChange = (order: string) => setSortOrder(order);

  const sortedRequests = [...requests].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredRequests = sortedRequests.filter((request) =>
    request.borrowerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (requestIndex: number, itemIndex: number) => {
    setCheckedItems((prev) => {
      const current = new Set(prev[requestIndex] || []);
      current.has(itemIndex) ? current.delete(itemIndex) : current.add(itemIndex);
      return { ...prev, [requestIndex]: current };
    });
  };

  const openConfirmModal = (requestIndex: number, borrowerName: string) => {
    const selected = [...(checkedItems[requestIndex] || [])].map(
      (itemIndex) => itemData[itemIndex]
    );
    setActiveBorrower(borrowerName);
    setSelectedItems(selected);
    setActiveRequestIndex(requestIndex);
    setShowModal(true);
  };

  return (
    <div id="laboratory-materials" className="section">
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search Borrower..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full max-w-2xl"
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

      <div className="space-y-4">
        {filteredRequests.map((request, index) => {
          const isExpanded = expandedCards.includes(index);
          return (
            <div key={index} className="border p-4 bg-[#8C1931] rounded-md text-white cursor-pointer">
              <div className="flex justify-between items-center" onClick={() => toggleCard(index)}>
                <div>
                  <p className="text-2xl font-semibold tracking-wider">{request.borrowerName}</p>
                  <p className="text-sm font-normal tracking-wider mt-1">
                    {request.borrowerName.split(" ").join("").toLowerCase()}@up.edu.ph
                  </p>
                  <p className="text-xs font-light mt-1">Date: {request.date}</p>
                </div>
                <div className="ml-2">
                  {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </div>

              {isExpanded && (
                <>
                  <div className="flex items-center ml-10 mt-4 mb-2">
                    <input
                      type="checkbox"
                      id={`check-all-${index}`}
                      className="form-checkbox accent-white w-4 h-4"
                      checked={
                        itemData.every((_, i) => checkedItems[index]?.has(i))
                      }
                      onChange={(e) => {
                        const allChecked = e.target.checked;
                        setCheckedItems((prev) => {
                          const updated = new Set<number>();
                          if (allChecked) {
                            itemData.forEach((_, i) => updated.add(i));
                          }
                          return { ...prev, [index]: updated };
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={`check-all-${index}`}
                      className="text-white tracking-wide ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Select All Items
                    </label>
                  </div>
                  <hr className="border-white/30 mx-10 mb-2" />
                  <ul className="mt-4">
                    {itemData.map((item, itemIndex) => (
                      <li key={itemIndex} className="py-2 flex items-center ml-10">
                        <div className="flex items-center w-64 space-x-2 truncate">
                          <input
                            type="checkbox"
                            id={`item-${index}-${itemIndex}`}
                            className="form-checkbox accent-white w-4 h-4"
                            checked={checkedItems[index]?.has(itemIndex) || false}
                            onChange={() => handleCheckboxChange(index, itemIndex)}
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
                    <button
                      className="bg-white text-[#8C1931] px-4 py-2 rounded"
                      onClick={() => openConfirmModal(index, request.borrowerName)}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-black"
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Request</h2>
            {selectedItems.length > 0 ? (
              <>
                <p className="mb-2">
                  Confirm borrow request from <span className="font-bold">{activeBorrower}</span>?
                </p>
                <p className="mb-2">Selected Items:</p>
                <ul className="list-disc pl-5 mb-4">
                  {selectedItems.map((item, i) => (
                    <li key={i}>{item.name} - {item.quantity} pcs</li>
                  ))}
                </ul>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-[#8C1931] text-white rounded hover:bg-[#a31f3c]"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please select at least one item to proceed with confirmation.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-[#8C1931] text-white rounded hover:bg-[#a31f3c]"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipments;