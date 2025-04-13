import { motion } from "framer-motion";
import { useState } from "react";
import StepSection from "../components/StepSection";

const steps = [
    {
      id: 1,
      title: "Marca del procesador",
      options: [
        { name: "AMD", value: "amd", image: "/images/amd.png" },
        { name: "Intel", value: "intel", image: "/images/intel.png" },
      ],
    },
    {
      id: 2,
      title: "Procesador",
      options: [], 
    },
  ];

const Builder = () => {

  const [activeStep, setActiveStep] = useState(1);
  const [selected, setSelected] = useState({});

  const handleSelect = (stepId, value) => {
    setSelected((prev) => ({ ...prev, [stepId]: value }));
    setActiveStep(stepId + 1);
  };


  return (
    <div className="flex flex-col h-screen p-16 pt-8">
      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Tu computadora
      </motion.h1>

      <motion.h1
        className="text-4xl font-bold text-yellow-400 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        a la medida.
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Arma la computadora de tus sueños.
      </motion.p>

      {steps.map((step) => (
        <StepSection
          key={step.id}
          step={step}
          isOpen={activeStep === step.id}
          selected={selected[step.id]}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default Builder;
