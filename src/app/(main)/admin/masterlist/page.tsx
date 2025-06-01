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
 const [borrowers, setBorrowers] = useState<Borrower[]>([]);


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
function toLowerCase(): string {
 throw new Error("Function not implemented.");
}