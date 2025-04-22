import React, { createContext, useContext, useState } from "react";

const BuilderContext = createContext();

export const BuilderProvider = ({ children }) => {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  const selectComponent = (stepId, value) => {
    setSelectedComponents((prev) => ({ ...prev, [stepId]: value }));
    setActiveStep(stepId + 1);
  };

  const resetBuilder = () => {
    setSelectedComponents({});
    setActiveStep(1);
  };

  return (
    <BuilderContext.Provider
      value={{ selectedComponents, activeStep, selectComponent, setActiveStep, resetBuilder }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => useContext(BuilderContext);
