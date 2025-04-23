import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import StepSection from "../components/StepSection";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";
import { CartContext } from "../contexts/contexts";

const Builder = () => {
  const { addComputerToCart, isAuthenticated } = useContext(CartContext);

  const [activeStep, setActiveStep] = useState(1);
  const [selected, setSelected] = useState({});
  const [steps, setSteps] = useState([]);
  const [compatibilidadMap, setCompatibilidadMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleSelect = (stepId, value) => {
    setSelected((prev) => {
      const updated = { ...prev, [stepId]: value };
      if (stepId === 1) {
        delete updated[2];
      }
      return updated;
    });
    setActiveStep(stepId + 1);
  };

  useEffect(() => {
    const fetchStepsAndComponents = async () => {
      try {
        setIsLoading(true);
        const tiposRes = await api.get("tipoComponente/");
        const compRes = await api.get("componente/");
        const compatRes = await api.get("compatibilidades/");

        const allComponents = compRes.data;
        const map = {};
        compatRes.data.forEach(({ componente_base, componente_compatible }) => {
          if (!map[componente_base.id]) map[componente_base.id] = new Set();
          map[componente_base.id].add(componente_compatible.id);
        });
        setCompatibilidadMap(map);

        const stepsGenerados = [];

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

        const procesadores = allComponents.filter(
          (c) =>
            c.tipo_componente === tipoProcesador?.id &&
            (!selected[1] ||
              c.marca.toLowerCase() === selected[1].toLowerCase())
        );

        stepsGenerados.push({
          id: 2,
          title: "Procesador",
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
            const procesadorSeleccionado = selected[2]?.id;
            let compatibles = allComponents.filter(
              (c) => c.tipo_componente === tipo.id
            );

            if (
              procesadorSeleccionado &&
              compatibilidadMap[procesadorSeleccionado]
            ) {
              const tieneCompatDeEsteTipo = compatibles.some((c) =>
                compatibilidadMap[procesadorSeleccionado].has(c.id)
              );
              if (tieneCompatDeEsteTipo) {
                compatibles = compatibles.filter((c) =>
                  compatibilidadMap[procesadorSeleccionado].has(c.id)
                );
              }
            }

            stepsGenerados.push({
              id: index + 3,
              title: tipo.nombre,
              options: compatibles.map((c) => ({
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
  }, [selected[1], selected[2]]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar esta PC al carrito.");
      return;
    }

    const componentes = Object.entries(selected)
      .filter(([stepId]) => Number(stepId) > 1)
      .map(([stepId, comp]) => ({
        id: comp.id,
        nombre: comp.nombre,
        cantidad: 1,
        stock: comp.stock || 0,
      }));

    const sinStock = componentes.find((c) => c.stock <= 0);
    if (sinStock) {
      toast.error(
        `El componente ${sinStock.nombre} no tiene stock disponible.`
      );
      return;
    }

    const total = componentes.reduce(
      (acc, comp) =>
        acc +
        (Number(
          selected[
            Object.keys(selected).find((k) => selected[k].id === comp.id)
          ].precio
        ) || 0),
      0
    );

    const computer = {
      id: Date.now(),
      nombre: "PC personalizada",
      descripcion: "Equipo armado por el usuario",
      componentes,
      precio: total,
      tipo: "computadora",
    };

    addComputerToCart(computer);
  };

  const totalPrecio = Object.entries(selected)
    .filter(([stepId]) => Number(stepId) > 1)
    .reduce((acc, [, comp]) => acc + (Number(comp.precio) || 0), 0);

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

      {!isLoading && Object.keys(selected).length >= steps.length && (
        <div className="bg-gray-800 p-6 mt-8 rounded-lg text-white">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">
            Resumen
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selected)
              .filter(([stepId]) => Number(stepId) > 1)
              .map(([stepId, comp]) => (
                <li
                  key={comp.id}
                  className="bg-gray-900 p-4 rounded-lg flex items-center gap-4"
                >
                  <img
                    src={comp.imagen1}
                    alt={comp.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold text-yellow-300">
                      {comp.marca} {comp.modelo}
                    </h3>
                    <p>
                      {Number(comp.precio).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
          <div className="mt-4 text-xl font-bold text-right">
            Total:{" "}
            {totalPrecio.toLocaleString("es-MX", {
              style: "currency",
              currency: "MXN",
            })}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddToCart}
              className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 transition hover:cursor-pointer"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;
