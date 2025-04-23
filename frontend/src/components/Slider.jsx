import React, { useEffect, useState } from "react";
import api from "../API/axiosConfig";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get("slider/");
        setSlides(res.data.map((img) => img.imagen));
      } catch (err) {
        console.error("Error al obtener imágenes del slider", err);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      <div className="relative overflow-hidden w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] xl:h-[420px] bg-black">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex justify-center items-center ${
              current === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide}
              alt={`Slide ${idx + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-yellow-400" : "bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Controles */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 rounded-full p-2"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 6 10">
          <path
            d="M5 1 1 5l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 rounded-full p-2"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 6 10">
          <path
            d="m1 9 4-4-4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
