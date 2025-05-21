"use client";
import { use, useEffect, useRef, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  viewAllHistory,
  viewAllHistoryBorrower,
} from "@/services/historyService";
import { approveCart } from "@/services/cartService";

import { get } from "http";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [activeBorrower, setActiveBorrower] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    { equipment: any; quantity: number }[]
  >([]);
  const [activeRequestIndex, setActiveRequestIndex] = useState<number | null>(
    null
  );
  const [checkedItems, setCheckedItems] = useState<{
    [requestIndex: number]: Set<number>;
  }>({});

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
      if (e.key === "Enter" && showModal && selectedItems.length === 0)
        setShowModal(false);
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

  const handleGetAllHistory = async () => {
    const data = await viewAllHistory(); // Placeholder for user_id
    setHistoryData(data);
    console.log(data);
  };

  useEffect(() => {
    handleGetAllHistory();
  }, []);

  const [historyData, setHistoryData] = useState<any>([]);
  const [filteredHistoryData, setFilteredHistoryData] = useState<any>([]);

  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );
  useEffect(() => {
    let filteredData = historyData;

    // Filter by search query if provided
    if (searchQuery) {
      filteredData = filteredData.filter((history: any) =>
        history.cart.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date_created based on sortOrder
    filteredData = filteredData.sort((a: any, b: any) => {
      const dateA = new Date(a.date_created).getTime();
      const dateB = new Date(b.date_created).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredHistoryData(filteredData);
  }, [historyData, searchQuery, sortOrder]);

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
      current.has(itemIndex)
        ? current.delete(itemIndex)
        : current.add(itemIndex);
      return { ...prev, [requestIndex]: current };
    });
  };

  const openConfirmModal = (
    historyId: number,
    requestIndex: number,
    cartItems: any,
    borrowerName: string
  ) => {
    console.log(requestIndex, cartItems);
    const selected = [...(checkedItems[requestIndex] || [])].map(
      (itemIndex) => cartItems[itemIndex]
    );
    const filteredSelected = selected.filter((item) => item !== undefined);
    setActiveBorrower(borrowerName);
    setSelectedItems(filteredSelected);
    setActiveRequestIndex(requestIndex);
    setShowModal(true);
    setSelectedHistoryId(historyId);
  };

  const handleApproveCart = async () => {
    await approveCart({
      cartItems: selectedItems,
      historyId: selectedHistoryId,
    });
    handleGetAllHistory();
  };
    return (
    <div id="laboratory-materials" className="section">
      <div className="flex items-center space-x-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          {/* Magnifying Glass Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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

    {/* Seach Borrower text */}
      <input
        type="text"
        placeholder="Search Borrower..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-3 py-2 rounded-[20px] bg-[#E3E1DD] outline-none text-black w-full"
        style={{
          width: "650px",   
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
        />
        </div>
      <select
        className="ml-35 px-6 py-2 text-black rounded-[10px] transition duration-300 ease-in-out cursor-pointer"
      style={{
        backgroundColor: '#E3E1DD',
        boxShadow: `
          inset 0px 3px 3px 0px rgba(0, 0, 0, 0.25), 
        `,
        fontFamily: 'Jost, sans-serif',
        fontWeight: 'bold'
      }}
        value={sortOrder}
        onChange={(e) => handleSortChange(e.target.value)}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#7A1729';
          e.currentTarget.style.color = 'white'; 
          e.currentTarget.style.boxShadow =
            '0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#E3E1DD';
          e.currentTarget.style.color = 'black';
          e.currentTarget.style.boxShadow =
            'inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <option value="asc">Sort by Date (Oldest to Newest)</option>
        <option value="desc">Sort by Date (Newest to Oldest)</option>
      </select>
      </div>

      <div className="space-y-4">
        {filteredHistoryData.map((history: any, index: any) => {
          const isExpanded = expandedCards.includes(index);
          return (
            <div
              key={index}
              style={{
                backgroundColor: "#EEE9E5",
                borderRadius: "17px",
                boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
                padding: "1rem",
                color: "#000000",
                cursor: "pointer",
              }}
            >
              <div
                className="flex justify-between items-center"
                onClick={() => toggleCard(index)}
              >
                <div>
                  <p className="text-3xl font-semibold tracking-normal">
                    {history.cart.user.name}
                  </p>
                  <p className="text-sm font-normal tracking-wider mt-1">
                    {history.cart.user.email}
                  </p>
                <p className="text-xs font-bold mt-1">
                  Date: {new Date(history.borrow_date).toLocaleString()}
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

              {isExpanded && (
                <>
                  <div className="flex items-center ml-10 mt-4 mb-2">
                    <input
                      type="checkbox"
                      id={`check-all-${index}`}
                      className="form-checkbox accent-white w-4 h-4"
                      checked={itemData.every((_, i) =>
                        checkedItems[index]?.has(i)
                      )}
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
                      className="text-black font-bold tracking-wide ml-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Select All Items
                    </label>
                  </div>
                  <hr className="border-white/30 mx-10 mb-2" />
                  <ul className="mt-4">
                    {history.cart.items.map((item: any, itemIndex: any) => (
                      <li
                        key={itemIndex}
                        className="py-2 flex items-center ml-10"
                      >
                        <div className="flex items-center w-64 space-x-2 truncate">
                          <input
                            type="checkbox"
                            id={`item-${index}-${itemIndex}`}
                            className="form-checkbox accent-white w-4 h-4"
                            checked={
                              checkedItems[index]?.has(itemIndex) || false
                            }
                            onChange={() =>
                              handleCheckboxChange(index, itemIndex)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label
                            htmlFor={`item-${index}-${itemIndex}`}
                            className="text-black tracking-normal"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.equipment.name.toLowerCase()}
                          </label>
                        </div>
                        <span className="w-20 text-black font-bold text-right">
                          {item.quantity} pcs
                        </span>
                      </li>
                    ))}
                  </ul>
                  <label className="font-bold block mt-4 text-black">
                    Remarks:
                    <textarea
                      value={history.remarks ?? "No remarks provided"}
                      readOnly
                      style={{
                        width: '100%',
                        height: '100px',
                        borderRadius: '12px',
                        background: '#FFF',
                        boxShadow: '3px 3px 2.886px 0px rgba(0, 0, 0, 0.25) inset',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        color: '#000',
                        fontWeight: '400',
                        fontFamily: 'inherit',
                        resize: 'none',
                      }}
                    />
                  </label>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() =>
                        openConfirmModal(
                          history.id,
                          index,
                          history.cart.items,
                          history.cart.user.name
                        )
                      }
                      style={{
                        width: "130px",
                        height: "38.234px",
                        flexShrink: 0,
                        borderRadius: "6px",
                        background: "#FFF",
                        boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
                        color: "#03aa6c",
                        textAlign: "center",
                        textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        fontFamily: "Jost",
                        fontSize: "16px",
                        fontWeight: 700,
                        lineHeight: "normal",
                        fontStyle: "bold",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#03aa6c";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#FFF";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#FFF";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "#03aa6c";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset";
                      }}
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
                  Confirm borrow request from{" "}
                  <span className="font-bold">{activeBorrower}</span>?
                </p>
                <p className="mb-2">Selected Items:</p>
                <ul className="list-disc pl-5 mb-4">
                  {selectedItems.map((item, i) => (
                    <li key={i}>
                      {item.equipment.name} - {item.quantity} pcs
                    </li>
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
                    onClick={() => {
                      handleApproveCart();
                      setCheckedItems((prev) => ({
                        ...prev,
                        [activeRequestIndex!]: new Set(),
                      }));
                      setActiveRequestIndex(null);
                      setShowModal(false);
                    }}
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
