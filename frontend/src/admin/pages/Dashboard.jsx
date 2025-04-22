import {
  CpuChipIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import api from "../../API/axiosConfig";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const usuariosResponse = await api.get("usuario/?rol=2");
        const componentesResponse = await api.get("componente/");

        setUsuariosCount(usuariosResponse.data.length);
        setProductosCount(componentesResponse.data.length);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Usuarios", "Productos"],
    datasets: [
      {
        label: "Totales",
        data: [usuariosCount, productosCount],
        backgroundColor: ["#3b82f6", "#facc15"],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container w-full">
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ventas Totales</h2>
          <p className="text-4xl font-semibold flex">
            <CurrencyDollarIcon className="h-10 w-10 me-2 text-green-600" />
            1,234
          </p>
          <p className="text-gray-600 mt-2">Ventas en el último mes</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
          <p className="text-4xl font-semibold flex">
            <UserCircleIcon className="h-10 w-10 me-2 text-blue-500" />
            {isLoading ? "..." : usuariosCount}
          </p>
          <p className="text-gray-600 mt-2">Usuarios registrados</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Órdenes</h2>
          <p className="text-4xl font-semibold flex">
            <ShoppingBagIcon className="h-10 w-10 me-2 text-gray-500" />
            456
          </p>
          <p className="text-gray-600 mt-2">Órdenes pendientes</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Productos</h2>
          <p className="text-4xl font-semibold flex">
            <CpuChipIcon className="h-10 w-10 me-2 text-yellow-400" />
            {isLoading ? "..." : productosCount}
          </p>
          <p className="text-gray-600 mt-2">Productos en venta</p>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Estadísticas</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
