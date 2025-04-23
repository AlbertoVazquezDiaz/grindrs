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

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      {/* Carousel wrapper */}
      <div className="relative overflow-hidden w-full h-[220px] sm:h-[280px] md:h-[400px] lg:h-[480px] xl:h-[600px]">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex justify-center items-center transition-opacity duration-700 ease-in-out ${
              current === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            data-carousel-item
          >
            <img
              src={slide}
              alt={`Slide ${idx + 1}`}
              className="max-h-full w-auto object-contain mx-auto"
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-yellow-400" : "bg-white"
            }`}
            aria-label={`Slide ${idx + 1}`}
            aria-current={current === idx}
          />
        ))}
      </div>

      {/* Controles */}
      <button
        type="button"
        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2"
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 6 10">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 1 1 5l4 4"
          />
        </svg>
      </button>

      <button
        type="button"
        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2"
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 6 10">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
