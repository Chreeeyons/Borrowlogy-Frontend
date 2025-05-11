import { viewAllHistoryBorrower } from "@/services/historyService";
import { get } from "http";
import { use, useEffect, useState } from "react";

const History = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);

  const handleGetAllHistoryBorrower = async () => {
    const data = await viewAllHistoryBorrower(1); // Placeholder for user_id
    setHistoryData(data);
  };

  useEffect(() => {
    handleGetAllHistoryBorrower();
  }, []);

  return (
    <div id="history">
      {/* Placeholder for multiple history entries */}
      <div className="space-y-4">
        {historyData.map((history: any, index: any) => (
          <div
            key={index}
            style={{
              backgroundColor: '#83191c',
              borderRadius: '20px',
              boxShadow: '6px 6px 4px 0px rgba(0, 0, 0, 0.25) inset',
              padding: '1rem',
              color: '#FFF',
            }}
          >
            <p className="text-3xl font-semibold tracking-normal">
              Transaction #{history.id}
            </p>
            <p>Date: {new Date(history.borrow_date).toDateString()}</p>

            {/* Placeholder list of items */}
            <ul className="mt-2 list-disc pl-5">
              {history.cart.items.map((item: any, itemIndex: any) => (
                <li className="py-2 flex items-center" key={itemIndex}>
                  <span className="w-64 truncate">{item.equipment.name}</span>
                  <span className="w-20 text-right">{item.quantity} pcs</span>
                </li>
              ))}
            </ul>

            {/* Styled remarks */}
            <label className="font-bold block mt-4 text-white">
              REMARKS:
              <textarea
                value={
                  history.remarks ? history.remarks : 'No remarks provided'
                }
                readOnly
                style={{
                  width: '100%',
                  height: '100px',
                  borderRadius: '10px',
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
