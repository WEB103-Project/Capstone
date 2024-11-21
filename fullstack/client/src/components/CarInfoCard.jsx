import React, { useEffect, useState } from "react";
import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Card,
  Divider,
  Image,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const CarInfoCard = ({ id }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`https://the-car-encyclopedia-api.onrender.com/api/cars/${id}`);
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
    <Card className="max-w-[340px]">
      <CardBody>
        <p>
          <strong>Body Type:</strong> {car.car_type}
        </p>
        <p>
          <strong>Year Make Model:</strong> {car.year} {car.make} {car.model}
        </p>
        <Image
          src={car.image || "https://via.placeholder.com/300"}
          alt={`${car.make} ${car.model}`}
        />
        <Divider />
        <CardHeader>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={i < (car.rating || 5) ? "text-yellow-500" : ""}
              />
            ))}
            <p className="ml-2">{car.rating || "5.0"}</p>
          </div>
        </CardHeader>
        <Divider />
        <div className="flex justify-between">
          <p>
            <strong>Fuel Economy:</strong> {car.fuel_economy || "N/A"} MPG
          </p>
        </div>
        <p className="mt-4">{car.description || "No description available."}</p>
      </CardBody>
      <CardFooter>
        <Link to={`/cardetails/${car.id}`}>
          <Button>More Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CarInfoCard;
