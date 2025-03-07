import React from "react";
import Slider from "../components/Slider";
import Sidebar from "../components/Sidebar";

const Landing = () => {
  return (
    <>
      <Slider />
      <div className="flex">
        <Sidebar />
        
      </div>
    </>
  );
};

export default Landing;
