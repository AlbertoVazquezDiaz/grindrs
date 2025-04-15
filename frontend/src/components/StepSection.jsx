import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const StepSection = ({ step, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(!selected); // abierto si no ha sido seleccionado

  const handleSelect = (value) => {
    onSelect(step.id, value);
    setIsOpen(false); // cerrar al seleccionar
  };

  return (
    <div className="mb-6 border border-gray-700 rounded-md bg-[#1a1a1a] p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-lg font-semibold text-yellow-400">
          {step.title}
        </h2>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-300" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-300" />
        )}
      </div>

      {selected && !isOpen && (
        <div className="mt-2 text-sm text-gray-300">
          Seleccionado:{" "}
          <span className="text-yellow-300">{selected.name}</span>
        </div>
      )}

      {isOpen && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {step.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`border rounded-md p-4 transition text-gray-200 hover:border-yellow-400 ${
                selected?.id === option.id
                  ? "border-yellow-400 bg-gray-800"
                  : "border-gray-600"
              }`}
            >
              <img
                src={
                  option.image?.startsWith("data:image")
                    ? option.image
                    : `data:image/jpeg;base64,${option.image}`
                }
                alt={option.name}
                className="w-full h-20 object-contain mb-2"
              />
              <p className="text-sm text-center">{option.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepSection;
