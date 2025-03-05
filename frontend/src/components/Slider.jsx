import React from "react";
import Carousel from "react-bootstrap/Carousel";

const Slider = () => {
  return (
    <Carousel controls={false} indicators={false} interval={3000} pause={false}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://fakeimg.pl/1900x480?font=noto"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://fakeimg.pl/1900x480?font=noto"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://fakeimg.pl/1900x480?font=noto"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
