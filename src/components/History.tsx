import { viewAllHistoryBorrower } from "@/services/historyService";
import { get } from "http";
import { use, useEffect, useState } from "react";

const History = () => {
  const handleGetAllHistoryBorrower = async () => {
    const data = await viewAllHistoryBorrower(1); // Placeholder for user_id
    setHistoryData(data);
  };
  useEffect(() => {
    handleGetAllHistoryBorrower();
  }, []);

  const [historyData, setHistoryData] = useState<any>([]);
  return (
    <div id="history" className="">
      {/* Placeholder for multiple history entries */}
      <div className="space-y-4">
        {historyData.map((history: any, index: any) => (
          <div
            key={index}
            className="border p-4 bg-[#8C1931] rounded-md text-white"
          >
            <p className="text-2xl font-semibold tracking-wider">
              Transaction #{history.id}
            </p>
            <p>Date: {new Date(history.borrow_date).toDateString()}</p>

            {/* Placeholder list of items */}
            <ul className="mt-2 list-disc pl-5">
              {history.cart.items.map((item: any, index: any) => (
                <li className="py-2 flex items-center" key={index}>
                  <span className="w-64 truncate">{item.equipment.name}</span>
                  <span className="w-20 text-right">{item.quantity} pcs</span>
                </li>
              ))}
            </ul>

            {/* Placeholder remarks */}
            <label className="font-normal block mt-4">
              Remarks:
              <textarea
                value={
                  history.remarks ? history.remarks : "No remarks provided"
                }
                readOnly
                className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
