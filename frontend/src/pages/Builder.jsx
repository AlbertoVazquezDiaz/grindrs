import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StepSection from "../components/StepSection";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";

const Builder = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selected, setSelected] = useState({});
  const [steps, setSteps] = useState([]);
  const [allComponentes, setAllComponentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (stepId, value) => {
    setSelected((prev) => ({ ...prev, [stepId]: value }));

    // Si se selecciona la marca del procesador, resetear procesador seleccionado
    if (stepId === 1) {
      setSelected((prev) => {
        const updated = { ...prev };
        delete updated[2]; // Borrar selección de procesador anterior si hay
        return updated;
      });
    }

    setActiveStep(stepId + 1);
  };

  useEffect(() => {
    const fetchStepsAndComponents = async () => {
      try {
        setIsLoading(true);
        const tiposRes = await api.get("tipoComponente/");
        const compRes = await api.get("componente/");

        setAllComponentes(compRes.data);

        const stepsGenerados = [];

        // Paso 1: Selección de marca del procesador
        stepsGenerados.push({
          id: 1,
          title: "Marca del procesador",
          options: [
            {
              id: "amd",
              name: "AMD",
              value: "AMD",
              image:
                "https://esports.as.com/2025/02/14/bonus/videojuegos/Logo-AMD_1876022385_1296616_1440x600.jpg",
            },
            {
              id: "intel",
              name: "Intel",
              value: "Intel",
              image:
                "https://www.intel.la/content/dam/logos/intel-header-logo.svg",
            },
          ],
        });

        const tipoProcesador = tiposRes.data.find(
          (t) => t.nombre.toLowerCase() === "procesador"
        );
        const procesadores = compRes.data.filter(
          (c) =>
            c.tipo_componente === tipoProcesador?.id &&
            (!selected[1] ||
              c.marca.toLowerCase() === selected[1].toLowerCase())
        );

        stepsGenerados.push({
          id: 2,
          title: "Selecciona un procesador",
          options: procesadores.map((c) => ({
            id: c.id,
            name: `${c.marca} ${c.modelo}`,
            value: c,
            image: c.imagen1,
          })),
        });

        tiposRes.data
          .filter((t) => t.nombre.toLowerCase() !== "procesador")
          .forEach((tipo, index) => {
            const componentes = compRes.data.filter(
              (c) => c.tipo_componente === tipo.id
            );
            stepsGenerados.push({
              id: index + 3,
              title: tipo.nombre,
              options: componentes.map((c) => ({
                id: c.id,
                name: `${c.marca} ${c.modelo}`,
                value: c,
                image: c.imagen1,
              })),
            });
          });

        setSteps(stepsGenerados);
      } catch (error) {
        console.error("Error cargando pasos:", error);
        toast.error(
          "Error cargando pasos. Por favor, intenta nuevamente más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStepsAndComponents();
  }, [selected[1]]); // Se vuelve a ejecutar cuando cambia la marca del procesador

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

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent" />
        </div>
      ) : (
        steps.length > 0 &&
        steps.map((step) => (
          <StepSection
            key={step.id}
            step={step}
            isOpen={activeStep === step.id}
            selected={selected[step.id]}
            onSelect={handleSelect}
          />
        ))
      )}
    </div>
  );
};

export default Builder;
