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
  <div className="space-y-4">
    {historyData.map((history: any, index: any) => (
      <div
        key={index}
        style={{
          backgroundColor: '#EEE9E5',
          borderRadius: '20px',
          boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.25) inset',
          padding: '1rem',
          color: '#000000',
        }}
      >
        <p className="text-4xl font-semibold tracking-normal">
          Transaction #{history.id}
        </p>

        <p className="text-base">
          <span className="font-bold">Date:</span>{' '}
          {new Date(history.borrow_date).toDateString()}{' '}
          <span className="text-sm text-gray-600">
            ({new Date(history.borrow_date).toLocaleTimeString()})
          </span>
        </p>

        <ul className="mt-2 space-y-1 pl-6">
          {history.cart.items.map((item: any, itemIndex: any) => (
            <li className="flex items-center gap-2" key={itemIndex}>
              <span className="w-2 h-2 rounded-full bg-[#5e0708] mt-[2px]"></span>
              <span className="w-64 truncate font-semibold">{item.equipment.name}</span>
              <span className="w-20 text-right">{item.quantity} pcs</span>
            </li>
          ))}
        </ul>

            {/* Styled remarks */}
            <label className="font-bold block mt-4 text-black">
              Remarks:
              <textarea
                value={
                  history.remarks ? history.remarks : 'No remarks provided'
                }
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
