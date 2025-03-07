import React from "react";

const Slider = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-300 ease-in-out animate-slide">
        <div className="min-w-full">
          <img
            className="w-full"
            src="https://fakeimg.pl/1900x480?font=noto"
            alt="First slide"
          />
        </div>
        <div className="min-w-full">
          <img
            className="w-full"
            src="https://fakeimg.pl/1900x480?font=noto"
            alt="Second slide"
          />
        </div>
        <div className="min-w-full">
          <img
            className="w-full"
            src="https://fakeimg.pl/1900x480?font=noto"
            alt="Third slide"
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
