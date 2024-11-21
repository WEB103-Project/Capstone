import React, { useState, useEffect } from "react";

const CompareCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);

  // Fetch car data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("https://the-car-encyclopedia-api.onrender.com/api/cars");
        const data = await response.json();
        setCars(data);
        // Default selection
        setSelectedCar1(data[0]);
        setSelectedCar2(data[1]);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Calculate differences and determine better car
  const getComparisonResults = () => {
    if (!selectedCar1 || !selectedCar2) return { betterCar: null, reasons: [] };

    const priceDifference = selectedCar1.price - selectedCar2.price;
    const horsepowerDifference = (selectedCar1.horsepower || 0) - (selectedCar2.horsepower || 0);
    const fuelEfficiencyDifference = (selectedCar1.fuel_efficiency || 0) - (selectedCar2.fuel_efficiency || 0);

    let betterCar = null;
    let reasons = [];

    // Determine better car
    if (selectedCar1.price < selectedCar2.price) {
      betterCar = selectedCar1.name || `${selectedCar1.make} ${selectedCar1.model}`;
      reasons.push("lower price");
    } else if (selectedCar2.price < selectedCar1.price) {
      betterCar = selectedCar2.name || `${selectedCar2.make} ${selectedCar2.model}`;
      reasons.push("lower price");
    }

    if (horsepowerDifference > 0) {
      betterCar = selectedCar1.name || `${selectedCar1.make} ${selectedCar1.model}`;
      reasons.push("higher horsepower");
    } else if (horsepowerDifference < 0) {
      betterCar = selectedCar2.name || `${selectedCar2.make} ${selectedCar2.model}`;
      reasons.push("higher horsepower");
    }

    if (fuelEfficiencyDifference > 0) {
      betterCar = selectedCar1.name || `${selectedCar1.make} ${selectedCar1.model}`;
      reasons.push("better fuel efficiency");
    } else if (fuelEfficiencyDifference < 0) {
      betterCar = selectedCar2.name || `${selectedCar2.make} ${selectedCar2.model}`;
      reasons.push("better fuel efficiency");
    }

    return { betterCar, reasons, priceDifference, horsepowerDifference, fuelEfficiencyDifference };
  };

  const { betterCar, reasons, priceDifference, horsepowerDifference, fuelEfficiencyDifference } = getComparisonResults();

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
            value={selectedCar1?.id || ""}
            onChange={(e) => setSelectedCar1(cars.find((car) => car.id === parseInt(e.target.value)))}
          >
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.make} {car.model}
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
            value={selectedCar2?.id || ""}
            onChange={(e) => setSelectedCar2(cars.find((car) => car.id === parseInt(e.target.value)))}
          >
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.make} {car.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Car comparison section */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Car 1 Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          {selectedCar1 ? (
            <>
              <h5 className="text-2xl font-semibold mb-4">
                {selectedCar1.make} {selectedCar1.model}
              </h5>
              <p className="text-lg"><strong>Price:</strong> ${selectedCar1.price}</p>
              <p className="text-lg"><strong>Horsepower:</strong> {selectedCar1.horsepower || "N/A"} HP</p>
              <p className="text-lg"><strong>Fuel Efficiency:</strong> {selectedCar1.fuel_efficiency || "N/A"} MPG</p>
            </>
          ) : (
            <p>No car selected</p>
          )}
        </div>

        {/* Car 2 Details */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          {selectedCar2 ? (
            <>
              <h5 className="text-2xl font-semibold mb-4">
                {selectedCar2.make} {selectedCar2.model}
              </h5>
              <p className="text-lg"><strong>Price:</strong> ${selectedCar2.price}</p>
              <p className="text-lg"><strong>Horsepower:</strong> {selectedCar2.horsepower || "N/A"} HP</p>
              <p className="text-lg"><strong>Fuel Efficiency:</strong> {selectedCar2.fuel_efficiency || "N/A"} MPG</p>
            </>
          ) : (
            <p>No car selected</p>
          )}
        </div>
      </div>

      {/* Comparison Results */}
      <div className="bg-yellow-100 shadow-md p-4 rounded-lg mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Comparison Results</h2>
        {selectedCar1 && selectedCar2 ? (
          <>
            <p className="text-lg">Price Difference: ${Math.abs(priceDifference)}</p>
            <p className="text-lg">Horsepower Difference: {Math.abs(horsepowerDifference)} HP</p>
            <p className="text-lg">Fuel Efficiency Difference: {Math.abs(fuelEfficiencyDifference)} MPG</p>
            <h3 className="text-xl font-semibold mt-4">
              Best Option: {betterCar || "N/A"} ({reasons.join(", ")})
            </h3>
          </>
        ) : (
          <p className="text-lg">Select two cars to compare.</p>
        )}
      </div>
    </div>
  );
};

export default CompareCars;
