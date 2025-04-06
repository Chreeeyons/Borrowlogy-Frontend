const History = () => {
  return (
    <div id="history" className="">
      {/* Placeholder for multiple history entries */}
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="border p-4 bg-[#8C1931] rounded-md text-white"
          >
            <p className="text-2xl font-semibold tracking-wider">
              Transaction #___
            </p>
            <p>Date: ________________</p>

            {/* Placeholder list of items */}
            <ul className="mt-2 list-disc pl-5">
              <li className="py-2 flex items-center">
                <span className="w-64 truncate">Item Name 1</span>
                <span className="w-20 text-right">__ pcs</span>
              </li>
              <li className="py-2 flex items-center">
                <span className="w-64 truncate">Item Name 2</span>
                <span className="w-20 text-right">__ pcs</span>
              </li>
            </ul>

            {/* Placeholder remarks */}
            <label className="font-normal block mt-4">
              Remarks:
              <textarea
                value={"No remarks provided"}
                className="w-full border rounded p-2 mt-2 font-normal text-black bg-white"
                readOnly
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
