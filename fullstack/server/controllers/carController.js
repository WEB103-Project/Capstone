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

    // Map the rows into objects, including all related data
    const cars = result.rows.map((row) => ({
      id: row.car_id,
      make: row.make,
      model: row.model,
      year: row.year,
      specs: {
        performance: row.performance,
        mileage: row.specs_mileage,
        volume: row.volume,
        seats: row.seats,
        wheelBase: row.wheel_base,
        towingCapacity: row.towing_capacity,
        drivetrain: row.drivetrain,
        transmission: row.transmission,
      },
      performance: {
        horsepower: row.horsepower,
        torque: row.torque,
        engine: row.engine,
      },
      mileage: {
        city: row.mileage_city,
        highway: row.mileage_highway,
      },
      volume: {
        cargoCapacity: row.cargo_capacity,
        frontHeadRoom: row.front_head_room,
        frontLegRoom: row.front_leg_room,
        frontShoulderRoom: row.front_shoulder_room,
        curbWeight: row.curb_weight,
        overallWidth: row.overall_width,
        overallLength: row.overall_length,
      },
      galleries: {
        galleryCarId: row.gallery_car_id,
      },
      logos: {
        logoCarId: row.logo_car_id,
      },
    }));

    // Send the response
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
};

// Get a single car by ID
const getCar = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(result.rows[0]); // Send the found car data
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


