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
          {step.options.map((option) => {
            const stock =
              typeof option.value === "object" && "stock" in option.value
                ? option.value.stock
                : null;

            const isOutOfStock = stock !== null && stock <= 0;

            return (
              <div
                key={option.value.id || option.id}
                onClick={() => {
                  if (!isOutOfStock) {
                    onSelect(step.id, option.value);
                    setIsExpanded(false);
                  }
                }}
                className={`relative flex flex-col items-center justify-center p-4 border rounded transition duration-200 ${
                  selected === option.value
                    ? "border-yellow-400"
                    : "border-gray-600 hover:border-yellow-500"
                } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isOutOfStock && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Sin stock
                  </span>
                )}

                {option.image && (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-20 h-20 object-contain mb-2"
                  />
                )}
                <p className="text-sm text-center text-white">{option.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StepSection;
