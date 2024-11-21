import React, { useEffect, useState } from "react";
import {
  Button,
  Pagination,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import CarInfoCardContainer from "../components/CarInfoCardContainer";

function CarSearch() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  // Fetch cars data from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("https://the-car-encyclopedia-api.onrender.com/api/cars");
        const data = await response.json();
        setCars(data);
        setFilteredCars(data); // Initially display all cars
        const types = ["All", ...new Set(data.map((car) => car.car_type))];
        setCarTypes(types);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Handle filter change
  const handleFilter = (type) => {
    setSelectedType(type);
    if (type === "All") {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter((car) => car.car_type === type));
    }
  };

  return (
    <div className="mx-4">
      <div>
        <Breadcrumbs>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Make</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <Divider className="my-4" />
      <div>
        {/* Dynamic Filters */}
        <Navbar
          classNames={{
            item: [
              "flex",
              "relative",
              "h-full",
              "items-center",
              "data-[active=true]:after:content-['']",
              "data-[active=true]:after:absolute",
              "data-[active=true]:after:bottom-0",
              "data-[active=true]:after:left-0",
              "data-[active=true]:after:right-0",
              "data-[active=true]:after:h-1",
              "data-[active=true]:after:rounded-[2px]",
              "data-[active=true]:after:bg-[#f0b324]",
            ],
          }}
        >
          {carTypes.map((type) => (
            <NavbarItem
              key={type}
              isActive={type === selectedType}
              onClick={() => handleFilter(type)}
            >
              {type} ({type === "All" ? cars.length : cars.filter((car) => car.car_type === type).length})
            </NavbarItem>
          ))}
        </Navbar>

        <div className="my-4">
          {/* Pass Filtered Cars to Container */}
          <CarInfoCardContainer cars={filteredCars} />
        </div>
      </div>
    </div>
  );
}

export default CarSearch;
