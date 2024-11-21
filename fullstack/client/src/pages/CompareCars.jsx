import React, { useState } from "react";

const CompareCars = () => {
  const carOptions = [
    {
      id: 1,
      name: "Car A",
      brand: "Brand A",
      price: 30000,
      horsepower: 200,
      fuelEfficiency: 25, // MPG
    },
    {
      id: 2,
      name: "Car B",
      brand: "Brand B",
      price: 28000,
      horsepower: 180,
      fuelEfficiency: 30, // MPG
    },
    {
      id: 3,
      name: "Car C",
      brand: "Brand C",
      price: 35000,
      horsepower: 220,
      fuelEfficiency: 20, // MPG
    },
    {
      id: 4,
      name: "Car D",
      brand: "Brand D",
      price: 27000,
      horsepower: 170,
      fuelEfficiency: 32, // MPG
    },
  ];

  const [selectedCar1, setSelectedCar1] = useState(carOptions[0]);
  const [selectedCar2, setSelectedCar2] = useState(carOptions[1]);

  const handleCar1Change = (event) => {
    const selectedId = parseInt(event.target.value);
    setSelectedCar1(carOptions.find((car) => car.id === selectedId));
  };

  const handleCar2Change = (event) => {
    const selectedId = parseInt(event.target.value);
    setSelectedCar2(carOptions.find((car) => car.id === selectedId));
  };

  // Calculate differences and determine better car
  const priceDifference = selectedCar1.price - selectedCar2.price;
  const horsepowerDifference = selectedCar1.horsepower - selectedCar2.horsepower;
  const fuelEfficiencyDifference = selectedCar1.fuelEfficiency - selectedCar2.fuelEfficiency;

  const determineBetterCar = () => {
    let betterCar = "";
    let reasons = [];

    if (selectedCar1.price < selectedCar2.price) {
      betterCar = selectedCar1.name;
      reasons.push("lower price");
    } else if (selectedCar2.price < selectedCar1.price) {
      betterCar = selectedCar2.name;
      reasons.push("lower price");
    }

    if (selectedCar1.horsepower > selectedCar2.horsepower) {
      betterCar = selectedCar1.name;
      reasons.push("higher horsepower");
    } else if (selectedCar2.horsepower > selectedCar1.horsepower) {
      betterCar = selectedCar2.name;
      reasons.push("higher horsepower");
    }

    if (selectedCar1.fuelEfficiency > selectedCar2.fuelEfficiency) {
      betterCar = selectedCar1.name;
      reasons.push("better fuel efficiency");
    } else if (selectedCar2.fuelEfficiency > selectedCar1.fuelEfficiency) {
      betterCar = selectedCar2.name;
      reasons.push("better fuel efficiency");
    }

    return { betterCar, reasons };
  };

  const { betterCar, reasons } = determineBetterCar();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Compare Cars</h1>

      {/* Dropdowns for selecting cars */}
      <div className="flex justify-center gap-8 mb-8">
        <div>
          <label htmlFor="car1" className="block text-lg font-medium mb-2">
            Select Car 1:
          </label>
          <select
            id="car1"
            className="p-2 border rounded"
            value={selectedCar1.id}
            onChange={handleCar1Change}
          >
            {carOptions.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="car2" className="block text-lg font-medium mb-2">
            Select Car 2:
          </label>
          <select
            id="car2"
            className="p-2 border rounded"
            value={selectedCar2.id}
            onChange={handleCar2Change}
          >
            {carOptions.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Car comparison section */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Car 1 Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h5 className="text-2xl font-semibold mb-4">{selectedCar1.name}</h5>
          <p className="text-lg"><strong>Brand:</strong> {selectedCar1.brand}</p>
          <p className="text-lg"><strong>Price:</strong> ${selectedCar1.price}</p>
          <p className="text-lg"><strong>Horsepower:</strong> {selectedCar1.horsepower} HP</p>
          <p className="text-lg"><strong>Fuel Efficiency:</strong> {selectedCar1.fuelEfficiency} MPG</p>
        </div>

        {/* Car 2 Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h5 className="text-2xl font-semibold mb-4">{selectedCar2.name}</h5>
          <p className="text-lg"><strong>Brand:</strong> {selectedCar2.brand}</p>
          <p className="text-lg"><strong>Price:</strong> ${selectedCar2.price}</p>
          <p className="text-lg"><strong>Horsepower:</strong> {selectedCar2.horsepower} HP</p>
          <p className="text-lg"><strong>Fuel Efficiency:</strong> {selectedCar2.fuelEfficiency} MPG</p>
        </div>
      </div>

      {/* Comparison Results */}
      <div className="bg-yellow-100 shadow-md p-4 rounded-lg mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Comparison Results</h2>
        <p className="text-lg">Price Difference: ${Math.abs(priceDifference)}</p>
        <p className="text-lg">Horsepower Difference: {Math.abs(horsepowerDifference)} HP</p>
        <p className="text-lg">Fuel Efficiency Difference: {Math.abs(fuelEfficiencyDifference)} MPG</p>
        <h3 className="text-xl font-semibold mt-4">
          Best Option: {betterCar} ({reasons.join(", ")})
        </h3>
      </div>
    </div>
  );
};

export default CompareCars;
