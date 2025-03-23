import { useState, useEffect } from 'react';

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("transactionHistory") || "[]");
    setHistory(storedHistory);
  }, []);

  return (
    <div id="history" className="">
      {history.length === 0 ? (
        <p>No borrow history yet.</p>
      ) : (
        <div>
          {history.map((transaction, index) => (
            <div 
              key={index} 
              className="border p-4 bg-[#8C1931] rounded-md text-white mt-2" // Separate box for each transaction
            >
              <p className="text-2xl font-semibold tracking-wider">Transaction #{transaction.transactionNumber}</p>
              <p>Date: {transaction.date}</p>
              
              {/* Items list with names and quantities */}
              <ul className="mt-2 list-disc pl-5">
                {transaction.cart.map((item: any) => (
                  <li key={item.id} className="py-2 flex items-center">
                    <span className="w-64 truncate">{item.name}</span>
                    <span className="w-20 text-right">{item.quantity} pcs</span>
                  </li>
                ))}
              </ul>

              <label className="font-normal block mt-4">
              Remarks:
              <textarea
                value={transaction.remarks || "No remarks provided"} // Display remarks or default text // Handle remark input
                className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
                placeholder=""
                readOnly
              />
            </label>
  
            </div>
          ))}
        </div>
      )}
    </div>
  );  
}
export default HistoryPage;
