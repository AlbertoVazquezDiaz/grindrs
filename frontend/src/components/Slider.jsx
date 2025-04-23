import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import api from "../API/axiosConfig";

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get("slider/");
        setSlides(response.data.map((img) => img.imagen)); 
      } catch (error) {
        console.error("Error al cargar las imágenes del slider:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="min-w-full" key={index}>
            <img
              className="w-full object-cover h-[480px]"
              src={slide}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <button
        className="absolute rounded-full top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/20 text-white p-2"
        onClick={goToPrevious}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        className="absolute rounded-full top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/20 text-white p-2 cursor-pointer"
        onClick={goToNext}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-4 cursor-pointer">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
