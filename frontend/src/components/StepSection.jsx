import { useState } from "react";

const StepSection = ({ step, title, children }) => {
  const [open, setOpen] = useState(step === 1); 

  return (
    <div className="border border-gray-600 rounded mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full px-4 py-3 text-left text-white font-bold bg-black hover:bg-yellow-500 transition`}
      >
        <div className="w-8 h-8 flex items-center justify-center bg-yellow-500 text-black font-bold rounded mr-4">
          {step}
        </div>
        <span className="uppercase">{title}</span>
      </button>
      {open && <div className="p-4 bg-[#1e1e1e]">{children}</div>}
    </div>
  );
};

export default StepSection;
