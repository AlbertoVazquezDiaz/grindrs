import React from "react";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import { FunnelIcon } from "@heroicons/react/24/outline";

const Landing = () => {
  const products = [
    {
      name: "Producto de Ejemplo 1",
      description: "Esta es una descripción del producto de ejemplo 1.",
      price: 29.99,
      image: "https://fakeimg.pl/600x400?font=noto",
      stock: "Disponible" // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 2",
      description: "Esta es una descripción del producto de ejemplo 2.",
      price: 39.99,
      image: "https://fakeimg.pl/600x400?font=noto",
      stock: "Soldout" // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 3",
      description: "Esta es una descripción del producto de ejemplo 3.",
      price: 49.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 4",
      description: "Esta es una descripción del producto de ejemplo 4.",
      price: 59.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 5",
      description: "Esta es una descripción del producto de ejemplo 5.",
      price: 69.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 6",
      description: "Esta es una descripción del producto de ejemplo 6.",
      price: 79.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 7",
      description: "Esta es una descripción del producto de ejemplo 7.",
      price: 89.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 8",
      description: "Esta es una descripción del producto de ejemplo 8.",
      price: 99.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
      name: "Producto de Ejemplo 9",
      description: "Esta es una descripción del producto de ejemplo 9.",
      price: 109.99,
      image: "https://fakeimg.pl/600x400?font=noto", // URL de imagen de ejemplo
    },
    {
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
        <Sidebar />
        <div className="flex flex-col w-full p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-gray-100 font-bold">Productos</h1>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5" />
              <p>Filtrar</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
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
