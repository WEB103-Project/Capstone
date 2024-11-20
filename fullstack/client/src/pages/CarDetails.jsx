import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Image,
  Card,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";

const CarDetails = () => {
  const { id } = useParams(); // Extract the car ID from the URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/cars/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return <p>Loading car details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!car) {
    return <p>No car details available.</p>;
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem>
          <a href="/">Home</a>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>Car Details</BreadcrumbItem>
      </Breadcrumbs>

      {/* Hero Section with Car Image */}
      <div className="flex justify-center mb-8">
        <Image
          src={car.image || "https://via.placeholder.com/400"}
          alt={`${car.make} ${car.model}`}
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Car Information Section */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            {car.year} {car.make} {car.model}
          </h2>
          <Divider />

          {/* Specifications */}
          <div className="flex flex-col gap-2">
            <p>
              <strong>Make:</strong> {car.make}
            </p>
            <p>
              <strong>Model:</strong> {car.model}
            </p>
            <p>
              <strong>Year:</strong> {car.year}
            </p>
            <p>
              <strong>VIN:</strong> {car.vin}
            </p>
            <p>
              <strong>Color:</strong> {car.color}
            </p>
            <p>
              <strong>Price:</strong> ${car.price}
            </p>
            <p>
              <strong>Mileage:</strong> {car.mileage} miles
            </p>
            <p>
              <strong>Body Type:</strong> {car.car_type}
            </p>
          </div>
          <Divider />

          {/* Description */}
          <p className="leading-relaxed mt-4">
            {car.description || "No description available for this car."}
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex justify-between mt-8">
          <Button color="primary">Schedule a Test Drive</Button>
          <Button variant="flat">Get Financing</Button>
        </div>
      </Card>
    </div>
  );
};

export default CarDetails;
