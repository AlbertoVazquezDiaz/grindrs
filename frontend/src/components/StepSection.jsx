import { useState, useEffect } from "react";

const StepSection = ({ step, isOpen, selected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  useEffect(() => {
    if (isOpen && !selected) {
      setIsExpanded(true);
    }
  }, [isOpen, selected]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="mb-4 border border-gray-700 rounded bg-[#111] text-white">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center px-4 py-3 bg-black text-yellow-400 text-sm font-bold uppercase tracking-wide"
      >
        {step.title}
        <span>{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {step.options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(step.id, option.value);
                setIsExpanded(false); // cerrar al seleccionar
              }}
              className={`flex flex-col items-center justify-center p-4 border rounded transition duration-200 cursor-pointer ${
                selected === option.value
                  ? "border-yellow-400"
                  : "border-gray-600 hover:border-yellow-500"
              }`}
            >
              {option.image && (
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-20 h-20 object-contain mb-2"
                />
              )}
              <p className="text-sm text-center text-white">{option.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepSection;
