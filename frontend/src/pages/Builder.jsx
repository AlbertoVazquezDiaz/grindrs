import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StepSection from "../components/StepSection";
import api from "../API/axiosConfig";

const Builder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selected, setSelected] = useState({});
  const [steps, setSteps] = useState([]);

  const handleSelect = (stepId, value) => {
    setSelected((prev) => ({ ...prev, [stepId]: value }));
    setActiveStep(stepId + 1);
  };

  useEffect(() => {
    const fetchStepsAndComponents = async () => {
      try {
        const tiposRes = await api.get("tipoComponente/");
        const compRes = await api.get("componente/");

        const stepsGenerados = tiposRes.data.map((tipo) => {
          const componentes = compRes.data.filter(
            (c) => c.tipo_componente === tipo.id
          );

          return {
            id: tipo.id,
            title: tipo.nombre,
            options: componentes.map((c) => ({
              id: c.id,
              name: `${c.marca} ${c.modelo}`,
              value: c,
              image: c.imagen1,
            })),
          };
        });

        setSteps(stepsGenerados);
      } catch (error) {
        console.error("Error cargando pasos:", error);
      }
    };

    fetchStepsAndComponents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-8 pt-6 md:p-16">
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

      {steps.length > 0 &&
        steps.map((step) => (
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
