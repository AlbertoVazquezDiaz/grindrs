import React, { useState } from "react";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import {
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
      stock: "Disponible",
    },
    {
      id: 2,
      name: "Producto de Ejemplo 2",
      description: "Esta es una descripción del producto de ejemplo 2.",
      price: 39.99,
      image: "https://fakeimg.pl/600x400?font=noto",
      stock: "Soldout",
    },
    {
      id: 3,
      name: "Producto de Ejemplo 3",
      description: "Esta es una descripción del producto de ejemplo 3.",
      price: 49.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 4,
      name: "Producto de Ejemplo 4",
      description: "Esta es una descripción del producto de ejemplo 4.",
      price: 59.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 5,
      name: "Producto de Ejemplo 5",
      description: "Esta es una descripción del producto de ejemplo 5.",
      price: 69.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 6,
      name: "Producto de Ejemplo 6",
      description: "Esta es una descripción del producto de ejemplo 6.",
      price: 79.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 7,
      name: "Producto de Ejemplo 7",
      description: "Esta es una descripción del producto de ejemplo 7.",
      price: 89.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 8,
      name: "Producto de Ejemplo 8",
      description: "Esta es una descripción del producto de ejemplo 8.",
      price: 99.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 9,
      name: "Producto de Ejemplo 9",
      description: "Esta es una descripción del producto de ejemplo 9.",
      price: 109.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
    {
      id: 10,
      name: "Producto de Ejemplo 10",
      description: "Esta es una descripción del producto de ejemplo 10.",
      price: 119.99,
      image: "https://fakeimg.pl/600x400?font=noto",
    },
  ];

  return (
    <>
      <Slider />

      <div className="flex w-full mt-5">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Contenido principal */}
        <div className="flex-1 p-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Botón visible en md y menor */}
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

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {products.map((product, index) => (
              <div
                key={index}
                className="w-full sm:w-[90%] md:w-[95%] lg:w-auto mx-auto"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
