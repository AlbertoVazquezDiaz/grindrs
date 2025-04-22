import { useEffect, useState } from "react";
import api from "../API/axiosConfig";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [componentesMap, setComponentesMap] = useState({});
  const [computadorasMap, setComputadorasMap] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        const [ventasRes, compRes, pcRes] = await Promise.all([
          api.get(`ventas/?usuario=${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("componente/"),
          api.get("computadoras/"),
        ]);

        const componentesObj = {};
        compRes.data.forEach((c) => (componentesObj[c.id] = c));

        const computadorasObj = {};
        pcRes.data.forEach((pc) => (computadorasObj[pc.id] = pc));

        setComponentesMap(componentesObj);
        setComputadorasMap(computadorasObj);
        setOrders(ventasRes.data);
      } catch (error) {
        toast.error("No se pudieron cargar tus órdenes.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-[#1e1e1e] text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Historial de compras</h1>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No tienes órdenes registradas.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#2d2d2d] rounded-lg p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-yellow-300">
                Orden #{order.id}
              </h2>
              <p className="text-sm text-gray-400 mb-2">
                Fecha: {new Date(order.fecha_venta).toLocaleDateString("es-MX")}
              </p>
              <p className="text-gray-300 mb-4 font-bold">
                Total: ${Number(order.total).toLocaleString("es-MX")}
              </p>

              <ul className="space-y-2 text-sm">
                {order.detalles.map((item, i) => {
                  const compu = computadorasMap[item.computadora];
                  const comp = componentesMap[item.componente];
                  const nombre =
                    compu?.nombre || comp?.nombre || "Producto desconocido";
                  const tipo = comp
                    ? comp.tipo_componente?.nombre || "Componente"
                    : "Computadora";

                  return (
                    <li
                      key={i}
                      className="flex justify-between border-b border-gray-600 pb-1"
                    >
                      <span>
                        {tipo}: {nombre}{" "}
                        <span className="text-gray-400">x{item.cantidad}</span>
                      </span>
                      <span className="text-gray-300 font-semibold">
                        ${Number(item.subtotal).toLocaleString("es-MX")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
