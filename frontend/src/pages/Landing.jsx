import React, { useState } from "react";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import {
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Landing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const products = [
    {
      id: 1,
      name: "Producto de Ejemplo 1",
      description: "Esta es una descripción del producto de ejemplo 1.",
      price: 29.99,
      image: "https://fakeimg.pl/600x400?font=noto",
      stock: "Disponible", // URL de imagen de ejemplo
    },
    {
      id: 2,
      name: "Producto de Ejemplo 2",
      description: "Esta es una descripción del producto de ejemplo 2.",
      price: 39.99,
      image: "https://fakeimg.pl/600x400?font=noto",
      stock: "Soldout", // URL de imagen de ejemplo
    },
    {
      id: 3,
      name: "Producto de Ejemplo 3",
      description: "Esta es una descripción del producto de ejemplo 3.",
      price: 49.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 4,
      name: "Producto de Ejemplo 4",
      description: "Esta es una descripción del producto de ejemplo 4.",
      price: 59.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 5,
      name: "Producto de Ejemplo 5",
      description: "Esta es una descripción del producto de ejemplo 5.",
      price: 69.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 6,
      name: "Producto de Ejemplo 6",
      description: "Esta es una descripción del producto de ejemplo 6.",
      price: 79.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 7,
      name: "Producto de Ejemplo 7",
      description: "Esta es una descripción del producto de ejemplo 7.",
      price: 89.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 8,
      name: "Producto de Ejemplo 8",
      description: "Esta es una descripción del producto de ejemplo 8.",
      price: 99.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 9,
      name: "Producto de Ejemplo 9",
      description: "Esta es una descripción del producto de ejemplo 9.",
      price: 109.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      id: 10,
      name: "Producto de Ejemplo 10",
      description: "Esta es una descripción del producto de ejemplo 10.",
      price: 119.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen
    },
    // Agrega más productos según sea necesario
  ];

  return (
    <>
      <Slider />
      <div className="flex mx-auto w-24/25">
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 left-4 transform -translate-y-1/2 p-2 bg-gray-500/80 text-white rounded-lg z-50 sm:hidden shadow-lg"
        >
          {isSidebarOpen ? (
            <ChevronLeftIcon className="h-6 w-6" /> // Ícono cuando está desplegada
          ) : (
            <ChevronRightIcon className="h-6 w-6" /> // Ícono cuando está plegada
          )}
        </button>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <div className="flex flex-col w-full p-4 ">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-gray-100 font-bold">Productos</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
