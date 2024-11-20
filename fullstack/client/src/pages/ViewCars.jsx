import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ViewCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch car data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/cars");
        const data = await response.json();
        setCars(data);
        setFilteredCars(data); // Initially, show all cars
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = cars.filter(
      (car) =>
        car.make.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.year.toString().includes(term) ||
        car.color.toLowerCase().includes(term) ||
        car.price.toString().includes(term) ||
        car.car_type.toLowerCase().includes(term)
    );

    setFilteredCars(filtered);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Cars</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by make, model, year, color, etc."
        value={searchTerm}
        onChange={handleSearch}
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
      />

      {/* Display Filtered Cars */}
      <div>
        {filteredCars.length > 0 ? (
          <ul className="grid gap-4">
            {filteredCars.map((car) => (
              <li
                key={car.id}
                className="p-4 border border-gray-300 rounded-md shadow-md"
              >
                <h2 className="text-lg font-bold">
                  {car.make} {car.model}
                </h2>
                <p>Year: {car.year}</p>
                <p>Color: {car.color}</p>
                <p>Price: ${car.price}</p>
                <p>Mileage: {car.mileage} miles</p>
                <p>Type: {car.car_type}</p>

                {/* More Details Button */}
                <div className="mt-4">
                  <Link
                    to={`/cardetails/${car.id}`}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600"
                  >
                    More Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No cars found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default ViewCars;
