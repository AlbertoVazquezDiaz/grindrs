import React, { useEffect, useState } from "react";
import api from "../API/axiosConfig";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Landing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("componente/");
        const mapped = res.data.map((item) => ({
          id: item.id,
          name: item.nombre,
          description: item.descripcion,
          detail: `${item.marca} ${item.modelo}`,
          price: item.precio,
          image: item.imagen1,
          stock: item.stock,
          tipo_componente: item.tipo_componente, // <--- importante
        }));

        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFilter = (tipoId) => {
    if (tipoId === null) {
      setFilteredProducts(products);
    } else {
      const filtrados = products.filter(
        (product) => Number(product.tipo_componente) === Number(tipoId)
      );
      setFilteredProducts(filtrados);
    }
  };
  

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <Slider />

      <div className="flex w-full mt-5">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onFilter={handleFilter}
        />

        <div className="flex-1 p-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden bg-white text-gray-800 border border-gray-300 p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              {isSidebarOpen ? (
                <ChevronLeftIcon className="h-5 w-5" />
              ) : (
                <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>

            <h1 className="text-2xl text-white font-bold">Productos</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:w-[90%] md:w-[95%] lg:w-auto mx-auto"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Landing;
