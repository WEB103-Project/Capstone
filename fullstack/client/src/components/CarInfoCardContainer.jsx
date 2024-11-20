import React from "react";
import CarInfoCard from "../components/CarInfoCard";

const CarInfoCardContainer = ({ cars }) => {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {cars.map((car) => (
        <CarInfoCard key={car.id} id={car.id} />
      ))}
    </div>
  );
};

export default CarInfoCardContainer;
