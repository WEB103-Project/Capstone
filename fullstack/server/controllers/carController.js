// controllers/carController.js
import { pool } from "../config/database.js";
import { Car } from "../models/model.js";

// Get all cars from the database
const getAllCars = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars");
    const cars = result.rows.map(
      (row) => new Car(row.id, row.make, row.model, row.year, row.vin, row.color, row.price, row.mileage, row.car_type)
    );
    res.json(cars); // Return the list of cars in JSON format
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
};

// Create a new car
const createCar = async (req, res) => {
  const { make, model, year, vin, color, price, mileage, car_type } = req.body;

  // Validate required fields
  if (!make || !model || !year || !vin || !color || !price || !mileage || !car_type) {
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
    res.status(201).json(new Car(newCar.id, newCar.make, newCar.model, newCar.year, newCar.vin, newCar.color, newCar.price, newCar.mileage, newCar.car_type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create car" });
  }
};

export default { getAllCars, createCar };