"use client";
import { useEffect, useState } from "react";
import { useHeader } from "@/utils/HeaderContext";
import { addUser, getUsers } from "@/services/userService";
import Papa from "papaparse"; // For CSV parsing


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
 const [borrowers, setBorrowers] = useState<Borrower[]>([]);

 // CSV Import Handler
 const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;
   const reader = new FileReader();
   reader.onload = (event) => {
     const text = event.target?.result as string;
     // Simple CSV parsing: expects "name,email" per line
     const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
     const newBorrowers: Borrower[] = [];
     for (const line of lines) {
       const [name, email] = line.split(",").map(s => s.trim());
       if (name && email) {
         newBorrowers.push({ name, email, transactions: [] });
       }
     }
     setBorrowers(prev => [...prev, ...newBorrowers]);
   };
   reader.readAsText(file);
 };


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
   if (response && response.custom_users) {
     setBorrowers(response.custom_users);
   }
 };


 const filteredBorrowers = borrowers.filter((b) => {
   if(b.name)
   return b.name.toLowerCase().includes(searchQuery ? searchQuery.toLowerCase():"")
   else
   return false
   }
 );


 const [errorMessage, setErrorMessage] = useState("");
 const [successMessage, setSuccessMessage] = useState("");


 const handleSubmit = async () => {
   function isValidUPEMail(email: string) {
     const regex = /^[a-zA-Z0-9._%+-]+@up\.edu\.ph$/;
     return regex.test(email);
   }


   if (!isValidUPEMail(newBorrower.email)) {
     setErrorMessage("Please enter a valid UP email address.");
     setTimeout(() => setErrorMessage(""), 3000);
     return;
   } else if (!newBorrower.name.trim()) {
     setErrorMessage("Please fill all of the fields.");
     setTimeout(() => setErrorMessage(""), 3000);
     return;
   } else {
     await addUser({
       email: newBorrower.email,
       name: newBorrower.name,
       username: "user_" + newBorrower.name,
     })
       .then((response) => {
         if (response) {
           setSuccessMessage("User added successfully!");
           handleAddBorrower();
           setTimeout(() => setSuccessMessage(""), 3000);
         }
       })
       .catch((error) => {
         console.error("Error adding user:", error);
         setErrorMessage("Failed to add user.");
         setTimeout(() => setErrorMessage(""), 3000);
       });
   }
 };


 const getOverallStatus = (user: Borrower): "RETURNED" | "PENDING" | "" => {
   if (user.transactions.length === 0) return ""; // No status for new users
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


 const statusColor = (status: "RETURNED" | "PENDING" | "") => {
   if (status === "RETURNED") return "text-green-800 font-semibold";
   if (status === "PENDING") return "text-yellow-700 font-semibold";
   return ""; // No color for users with no status
 };

 const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async function (results: Papa.ParseResult<any>) {
      const parsedData = results.data as { name: string; email: string }[];

      const validUsers = parsedData.filter(user =>
        /^[a-zA-Z0-9._%+-]+@up\.edu\.ph$/.test(user.email) &&
        user.name.trim() !== ""
      );

      for (const user of validUsers) {
        try {
          const response = await addUser({
            name: user.name,
            email: user.email,
            username: `user_${user.name}`,
          });

          if (response) {
            setBorrowers(prev => [
              ...prev,
              {
                name: user.name,
                email: user.email,
                transactions: [],
              },
            ]);
          }
        } catch (error) {
          console.error(`Error adding ${user.email}:`, error);
        }
      }

      // ✅ Close the modal after CSV is processed
      setIsAddingNew(false);
    },
  });
};



 const buttonBase =
   "px-6 py-2 rounded shadow-md font-bold transition-colors duration-300";
 const buttonPrimary = `${buttonBase} bg-white text-[#8C1931] hover:bg-green-600 hover:text-white`;


 // Detailed Transaction View
 if (selectedTransaction && selectedBorrower) {
   return (
     <div className="p-6 text-black">
       <div className="bg-[#EEE9E5] rounded-[20px] p-6 shadow-[inset_3px_3px_6px_0px_rgba(0,0,0,0.25)]">
         <div className="flex justify-between items-center mb-4">
           <div>
             <h2
               className="text-4xl font-bold text-black"
               style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.4)" }}
             >
               {selectedBorrower.name}
             </h2>
             <p className="text-md">{selectedBorrower.email}</p>
           </div>
           <span
             className={`px-4 py-1.5 rounded-full font-semibold text-white shadow-md tracking-wide uppercase text-sm transition-all duration-200 ${
               selectedTransaction.returnedDate
                 ? "bg-green-700 hover:bg-green-800"
                 : "bg-yellow-500 hover:bg-yellow-600"
             }`}
           >
             {selectedTransaction.returnedDate ? "RETURNED" : "PENDING"}
           </span>
         </div>


         <table className="w-full mb-6 text-black table-auto">
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
                 <td className="px-4 py-2">
                   {selectedTransaction.borrowedDate}
                 </td>
                 <td className="px-4 py-2">
                   {selectedTransaction.returnedDate || "-"}
                 </td>
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
               style={{
                 borderRadius: "12px",
                 background: "#FFF",
                 boxShadow: "3px 3px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
                 padding: "0.5rem",
                 marginTop: "0.5rem",
                 color: "#000",
                 fontWeight: 400,
                 fontFamily: "inherit",
                 resize: "none",
                 width: "100%",
                 height: "7rem",
               }}
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
               style={{
                 borderRadius: "12px",
                 background: "#FFF",
                 boxShadow: "3px 3px 2.886px 0px rgba(0, 0, 0, 0.25) inset",
                 padding: "0.5rem",
                 marginTop: "0.5rem",
                 color: "#000",
                 fontWeight: 400,
                 fontFamily: "inherit",
                 resize: "none",
                 width: "100%",
                 height: "7rem",
               }}
             />
           </div>
         </div>
         <button
           onClick={() => setSelectedTransaction(null)}
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
             cursor: "pointer",
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = "#03aa6c";
             e.currentTarget.style.color = "#FFF";
             e.currentTarget.style.boxShadow =
               "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = "#FFF";
             e.currentTarget.style.color = "#03aa6c";
             e.currentTarget.style.boxShadow =
               "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset";
           }}
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
     <div className="p-6 text-black">
       <div className="bg-[#EEE9E5] rounded-[20px] p-6 shadow-[inset_3px_3px_6px_0px_rgba(0,0,0,0.25)]">
         <h2
           className="text-4xl font-bold text-black"
           style={{ textShadow: "2px 2px 6px rgba(0, 0, 0, 0.4)" }}
         >
           {selectedBorrower.name}
         </h2>
         <p className="text-md mb-6 text-black">{selectedBorrower.email}</p>


         <table className="w-full mb-4 text-black table-auto">
           <thead>
             <tr className="text-center">
               <th className="px-1 py-2 text-xl">Transaction No.</th>{""}
               {/* Increased font size */}
               <th className="px-1 py-2 text-xl">Date Borrowed</th>{""}
               {/* Increased font size */}
               <th className="px-1 py-2 text-xl">Status</th>{""}
               {/* Increased font size */}
             </tr>
           </thead>
           <tbody>
             {selectedBorrower.transactions.map((tx, index) => (
               <tr
                 key={index}
                 className="cursor-pointer hover:bg-[#6B8E23] hover:shadow-lg hover:border-[#6B8E23] transition-all duration-300 ease-in-out hover:text-white"
                 onClick={() => setSelectedTransaction(tx)}
               >
                 <td className="px-4 py-2 text-center">{tx.transactionId}</td>{" "}
                 {/* Centered text */}
                 <td className="px-4 py-2 text-center">
                   {tx.borrowedDate}
                 </td>{" "}
                 {/* Centered text */}
                 <td
                   className={`px-4 py-2 text-center ${statusColor(
                     tx.returnedDate ? "RETURNED" : "PENDING"
                   )}`}
                   style={{
                     textShadow: "1px 1px 5px rgba(255, 255, 255, 0.7)",
                   }}
                 >
                   {tx.returnedDate ? "RETURNED" : "PENDING"}
                 </td>


               </tr>
             ))}
           </tbody>
         </table>
         <button
           onClick={() => setSelectedBorrower(null)}
           style={{
             width: "130px",
             height: "38.234px",
             flexShrink: 0,
             borderRadius: "6px",
             background: "rgb(255, 255, 255)",
             boxShadow: "rgba(0, 0, 0, 0.25) 4px 4px 4px 0px inset",
             color: "rgb(3, 170, 108)",
             textAlign: "center",
             textShadow: "rgba(0, 0, 0, 0.25) 0px 2px 4px",
             fontFamily: "Jost",
             fontSize: "16px",
             fontWeight: 700,
             lineHeight: "normal",
             cursor: "pointer",
           }}
           className="font-bold transition-all duration-300 mt-4"
           onMouseEnter={(e) => {
             e.currentTarget.style.background = "#03aa6c";
             e.currentTarget.style.color = "#FFF";
             e.currentTarget.style.boxShadow =
               "6px 6px 8px 0px rgba(0, 0, 0, 0.4) inset";
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = "#FFF";
             e.currentTarget.style.color = "#03aa6c";
             e.currentTarget.style.boxShadow =
               "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset";
           }}
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
           boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
         }}
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
       />
       <button
         onClick={() => setIsAddingNew(true)}
         className="flex items-center gap-2 ml-5 px-8 py-2 text-white rounded-[10px] font-bold transition duration-300 ease-in-out"
         style={{
           backgroundColor: "#8C1931",
           boxShadow: "inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)",
           fontFamily: "Jost, sans-serif",
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.backgroundColor = "#7A1729";
           e.currentTarget.style.boxShadow =
             "0 0 12px 3px rgba(140, 25, 49, 0.75), inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)";
           e.currentTarget.style.transform = "scale(1.05)";
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.backgroundColor = "#8C1931";
           e.currentTarget.style.boxShadow =
             "inset 0px 2.886px 2.886px 0px rgba(0, 0, 0, 0.25)";
           e.currentTarget.style.transform = "scale(1)";
         }}
       >
         <span className="text-lg">+</span> Add
       </button>
     </div>
     <div className="bg-[#EEE9E5] rounded-[20px] shadow-[inset_3px_3px_6px_0px_rgba(0,0,0,0.25)] p-4 text-[#000000] font-jost">
       <table className="w-full text-center table-auto">
         <thead>
           <tr
             className="text-black text-3xl font-bold"
             style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
           >
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
                 className="hover:bg-[#E3E1DD] hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-in-out cursor-pointer rounded-full"
                 onClick={() => setSelectedBorrower(borrower)}
               >
                 <td className="px-4 py-2">{borrower.name}</td>
                 <td className="px-4 py-2">{borrower.email}</td>
                 {status ? (
                   <td className="px-4 py-2 flex items-center justify-center gap-1">
                     <span
                       className={`px-4 py-1.5 inline-block rounded-full text-white text-sm font-semibold shadow-md transition-all duration-200 ${
                         status === "RETURNED"
                           ? "bg-green-700 hover:bg-green-800"
                           : "bg-yellow-500 hover:bg-yellow-600"
                       }`}
                     >
                       {status}
                     </span>
                     <span className="text-[#000000] text-3xl">▾</span>
                   </td>
                 ) : (
                   <td className="px-4 py-2 text-center text-gray-400 italic">    </td>
                 )}


               </tr>
             );
           })}
         </tbody>
       </table>
       {/* Success Message */}
       {successMessage && (
         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
           <div className="bg-white/70 px-6 py-4 rounded-lg shadow-lg text-center backdrop-blur-sm">
             <div className="flex flex-col items-center justify-center">
               <span className="text-3xl text-green-700 mb-2">✓</span>
               <p className="text-lg font-semibold text-black">
                 {successMessage}
               </p>
             </div>
           </div>
         </div>
       )}


       {/* Error Message */}
       {errorMessage && (
         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
           <div className="bg-white/70 px-6 py-4 rounded-lg shadow-lg text-center backdrop-blur-sm">
             <div className="flex flex-col items-center justify-center">
               <span className="text-3xl text-red-700 mb-2">✗</span>
               <p className="text-lg font-semibold text-black">
                 {errorMessage}
               </p>
             </div>
           </div>
         </div>
       )}
     </div>

      {/* Add Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white p-8 rounded-[20px] shadow-[0_0_16px_rgba(0,0,0,0.4)] w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title container with matching background and text style */}
            <div className="bg-[#83191c] py-2 px-4 rounded-[12px] mb-6 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)]">
              <h2
                className="text-3xl font-bold text-center text-white mb-0 font-jost"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Add New Borrower
              </h2>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-black">Name:</label>
              <input
                type="text"
                className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                          rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                          focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                          transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                          font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
                value={newBorrower.name}
                onChange={(e) =>
                  setNewBorrower({ ...newBorrower, name: e.target.value })
                }
              />
            </div>

      <div className="mb-4">
        <label className="block mb-1 text-black">Email (UP mail):</label>
        <input
          type="email"
          className="w-full p-4 mb-2 bg-[#EEE9E5] text-black placeholder-gray-500 
                    rounded-[12px] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] 
                    focus:ring-2 focus:ring-[#04543C] focus:outline-none 
                    transition-all duration-300 hover:bg-[#f5e4e0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] 
                    font-jost text-base disabled:opacity-50 disabled:cursor-not-allowed"
          value={newBorrower.email}
          onChange={(e) =>
            setNewBorrower({ ...newBorrower, email: e.target.value })
          }
        />
      </div>

      {/* CSV Import Button */}
      <div className="mb-4">
        <label className="block mb-1 text-black font-medium">Or Import CSV:</label>
        <label
          htmlFor="csv-upload"
          className={`
            inline-block px-6 py-2 rounded-[10px]
            bg-[#04543C] text-white font-bold
            text-center
            transition-all duration-300 ease-in-out
            shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
            hover:bg-green-700
            hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
            hover:scale-105
            cursor-pointer
          `}
        >
          Import CSV
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleCSVImport}
          className="hidden"
        />
      </div>
        {errorMessage && (
          <div className="text-red-600 mb-2 text-center">{errorMessage}</div>
        )}
           <div className="flex justify-end gap-2">
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAddingNew(false)}
                className={`
                  px-5 py-2 rounded-[10px]
                  bg-gray-300 text-black font-medium
                  transition-all duration-300 ease-in-out
                  shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
                  hover:bg-gray-400
                  hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
                  hover:scale-105
                `}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddBorrower();
                  handleSubmit();
                }}
                className={`
                  px-5 py-2 rounded-[10px]
                  bg-[#04543C] text-white font-bold
                  transition-all duration-300 ease-in-out
                  shadow-[0_4px_8px_0px_rgba(0,0,0,0.3)]
                  hover:bg-green-700
                  hover:shadow-[0_6px_12px_0px_rgba(0,0,0,0.4)]
                  hover:scale-105
                `}
              >
                Save
              </button>
            </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};


export default Equipments;
function toLowerCase(): string {
 throw new Error("Function not implemented.");
}