// controllers/carController.js
import { pool } from "../config/database.js";
import { Car } from "../models/model.js";

// Get all cars from the database
const getAllCars = async (req, res) => {
  try {
    // SQL query to join all related tables
    const result = await pool.query(`
      SELECT 
        cars.id AS car_id, 
        cars.make, 
        cars.model, 
        cars.year, 
        cars.price, 
        carspecs.performance, 
        carspecs.mileage AS specs_mileage, 
        carspecs.volume, 
        carspecs.seats, 
        carspecs.wheel_base, 
        carspecs.towing_capacity, 
        carspecs.drivetrain, 
        carspecs.transmission, 
        performance.horsepower, 
        performance.torque, 
        performance.engine, 
        mileage.city AS mileage_city, 
        mileage.highway AS mileage_highway, 
        spacevolume.cargo_capacity, 
        spacevolume.front_head_room, 
        spacevolume.front_leg_room, 
        spacevolume.front_shoulder_room, 
        spacevolume.curb_weight, 
        spacevolume.overall_width, 
        spacevolume.overall_length, 
        cargalleries.car_id AS gallery_car_id,
        carlogos.logo AS logo_car_id
        
      FROM cars
      JOIN carspecs ON cars.specs = carspecs.id
      JOIN performance ON carspecs.performance = performance.id
      JOIN mileage ON carspecs.mileage = mileage.id
      JOIN spacevolume ON carspecs.volume = spacevolume.id
      LEFT JOIN cargalleries ON cars.id = cargalleries.id
      LEFT JOIN carlogos ON cars.id = carlogos.id
    `);

    // Map the rows into a flat structure
    const cars = result.rows.map((row) => ({
      id: row.car_id,
      make: row.make,
      model: row.model,
      year: row.year,
      price: row.price,
      performance: row.performance,
      mileage: row.specs_mileage,
      volume: row.volume,
      seats: row.seats,
      wheelBase: row.wheel_base,
      towingCapacity: row.towing_capacity,
      drivetrain: row.drivetrain,
      transmission: row.transmission,
      horsepower: row.horsepower,
      torque: row.torque,
      engine: row.engine,
      cityMileage: row.mileage_city,
      highwayMileage: row.mileage_highway,
      cargoCapacity: row.cargo_capacity,
      frontHeadRoom: row.front_head_room,
      frontLegRoom: row.front_leg_room,
      frontShoulderRoom: row.front_shoulder_room,
      curbWeight: row.curb_weight,
      overallWidth: row.overall_width,
      overallLength: row.overall_length,
      galleryCarId: row.gallery_car_id,
      logoCarUrl: row.logo_car_id,
    }));

    // Send the response
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
};

const getCar = async (req, res) => {
  const { id } = req.params;

  try {
    // Query to fetch car and join related tables if needed
    const result = await pool.query(`
      SELECT 
        cars.id AS car_id, 
        cars.make, 
        cars.model, 
        cars.year, 
        cars.price, 
        carspecs.performance, 
        carspecs.mileage AS specs_mileage, 
        carspecs.volume, 
        carspecs.seats, 
        carspecs.wheel_base, 
        carspecs.towing_capacity, 
        carspecs.drivetrain, 
        carspecs.transmission, 
        performance.horsepower, 
        performance.torque, 
        performance.engine, 
        mileage.city AS mileage_city, 
        mileage.highway AS mileage_highway, 
        spacevolume.cargo_capacity, 
        spacevolume.front_head_room, 
        spacevolume.front_leg_room, 
        spacevolume.front_shoulder_room, 
        spacevolume.curb_weight, 
        spacevolume.overall_width, 
        spacevolume.overall_length, 
        cargalleries.car_id AS gallery_car_id,
        carlogos.logo AS logo_car_id
      FROM cars
      JOIN carspecs ON cars.specs = carspecs.id
      JOIN performance ON carspecs.performance = performance.id
      JOIN mileage ON carspecs.mileage = mileage.id
      JOIN spacevolume ON carspecs.volume = spacevolume.id
      LEFT JOIN cargalleries ON cars.id = cargalleries.id
      LEFT JOIN carlogos ON cars.id = carlogos.id
      WHERE cars.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Flatten the car data
    const car = result.rows[0];
    const flattenedCar = {
      id: car.car_id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      performance: car.performance,
      mileage: car.specs_mileage,
      volume: car.volume,
      seats: car.seats,
      wheelBase: car.wheel_base,
      towingCapacity: car.towing_capacity,
      drivetrain: car.drivetrain,
      transmission: car.transmission,
      horsepower: car.horsepower,
      torque: car.torque,
      engine: car.engine,
      cityMileage: car.mileage_city,
      highwayMileage: car.mileage_highway,
      cargoCapacity: car.cargo_capacity,
      frontHeadRoom: car.front_head_room,
      frontLegRoom: car.front_leg_room,
      frontShoulderRoom: car.front_shoulder_room,
      curbWeight: car.curb_weight,
      overallWidth: car.overall_width,
      overallLength: car.overall_length,
      galleryCarId: car.gallery_car_id,
      logoCarUrl: car.logo_car_id,
    };

    res.json(flattenedCar); // Send the flattened car data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch car" });
  }
};

// Create a new car
const createCar = async (req, res) => {
  const { make, model, year, vin, color, price, mileage, car_type } = req.body;

  // Validate required fields
  if (
    !make ||
    !model ||
    !year ||
    !vin ||
    !color ||
    !price ||
    !mileage ||
    !car_type
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert the new car into the database
    const result = await pool.query(
      "INSERT INTO cars (make, model, year, vin, color, price, mileage, car_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [make, model, year, vin, color, price, mileage, car_type]
    );
    const newCar = result.rows[0];

    // Return the newly created car in response
    res
      .status(201)
      .json(
        new Car(
          newCar.id,
          newCar.make,
          newCar.model,
          newCar.year,
          newCar.vin,
          newCar.color,
          newCar.price,
          newCar.mileage,
          newCar.car_type
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create car" });
  }
};

export default { getAllCars, getCar, createCar };
