import {
  CpuChipIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

/* import ProductData from "../components/ProductData"; */

const Dashboard = () => {
  return (
    <div className="container w-full">
      {/* Cambiado de flex a grid correctamente */}
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
            456
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
            <CpuChipIcon className="h-10 w-10 me-2 text-gray-500" />
            152
          </p>
          <p className="text-gray-600 mt-2">Productos en venta</p>
        </div>
      </div>
      <div>
        {/* <ProductData /> */}
      </div>
    </div>
  );
};

export default Dashboard;
