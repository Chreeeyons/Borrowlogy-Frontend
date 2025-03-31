"use client";
import { useEffect } from "react";
import { useHeader } from "@/utils/HeaderContext";

const Equipments = () => {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle("Borrower's Requests");
  }, []);

  return (
    <div id="borrow-requests" className="section p-4 text-white">
      <div className="bg-[#8C1931] p-4 rounded-lg shadow-md">
        <p className="text-transform: uppercase text-2xl font-bold">John Doe</p>
        <p>johndoe@up.edu.ph</p>
        <div className="mt-4">
          <ul className="mt-2 list-disc pl-20">
          <li className="py-2 flex items-center">
              <span className="text-white w-64 truncate">Beaker</span>
              <span className="text-white w-20 text-right">1 pcs</span>
            </li>
            <li className="py-2 flex items-center">
              <span className="text-white w-64 truncate">Microscope</span>
              <span className="text-white w-20 text-right">2 pcs</span>
            </li>
            <li className="py-2 flex items-center">
              <span className="text-white w-64 truncate">Test Tube</span>
              <span className="text-white w-20 text-right">4 pcs</span>
            </li>
          </ul>
        </div>
        <label className="font-medium block mt-4">
        Remarks:
        <textarea
          className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
          placeholder=""
          readOnly
        ></textarea>
      </label>
        <div className="flex justify-between mt-6">
          <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Back</button>
          <button className="bg-white text-[#8C1931] px-4 py-2 rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Equipments;
