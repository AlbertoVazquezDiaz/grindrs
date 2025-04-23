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
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [usuariosCount, setUsuariosCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const usuariosResponse = await api.get("usuario/?rol=2");
        const componentesResponse = await api.get("componente/");
        const ventasResponse = await api.get("ventas/");
        const totalSalesResponse = await api.get("ventas/total/");

        setUsuariosCount(usuariosResponse.data.length);
        setProductosCount(componentesResponse.data.length);
        setSalesCount(ventasResponse.data.length);
        setTotalSales(totalSalesResponse.data.total_ventas);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Usuarios", "Productos", "Pedidos"],
    datasets: [
      {
        label: "Totales",
        data: [usuariosCount, productosCount, salesCount],
        backgroundColor: ["#3b82f6", "#facc15", "#6b7280"],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.raw}` } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieData = {
    labels: ["Usuarios", "Productos", "Pedidos"],
    datasets: [
      {
        data: [usuariosCount, productosCount, salesCount],
        backgroundColor: ["#3b82f6", "#facc15", "#6b7280"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="container w-full">
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ventas totales</h2>
          <p className="text-3xl font-semibold flex items-center">
            <CurrencyDollarIcon className="h-10 w-10 me-2 text-green-600" />
            {isLoading ? (
              <div className="loader w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              totalSales.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            )}
          </p>
          <p className="text-gray-600 mt-2">Total histórico</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
          <p className="text-4xl font-semibold flex items-center">
            <UserCircleIcon className="h-10 w-10 me-2 text-blue-500" />
            {isLoading ? (
              <div className="loader w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              usuariosCount
            )}
          </p>
          <p className="text-gray-600 mt-2">Usuarios registrados</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
          <p className="text-4xl font-semibold flex items-center">
            <ShoppingBagIcon className="h-10 w-10 me-2 text-gray-500" />
            {isLoading ? (
              <div className="loader w-6 h-6 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              salesCount
            )}
          </p>
          <p className="text-gray-600 mt-2">Órdenes pendientes</p>
        </div>
        <div className="shadow-xl p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Productos</h2>
          <p className="text-4xl font-semibold flex items-center">
            <CpuChipIcon className="h-10 w-10 me-2 text-yellow-400" />
            {isLoading ? (
              <div className="loader w-6 h-6 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              productosCount
            )}
          </p>
          <p className="text-gray-600 mt-2">Productos en venta</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Estadísticas</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Proporción</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
