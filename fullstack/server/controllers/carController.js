import { pool } from "../config/db.js";

const carController = () => {};

carController.getAllCars = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
        c.id AS car_id,
        c.name AS car_name,
        cb.id AS base_model_id,
        cb.model AS base_model_name,
        cb.price AS base_model_price,
        i.id AS interior_id,
        i.price AS interior_price,
        e.id AS exterior_id,
        e.price AS exterior_price,
        w.id AS wheel_id,
        w.price AS wheel_price
      FROM cars c
      JOIN car_base cb ON c.base_model_id = cb.id
      JOIN interiors i ON c.interior_type_id = i.id
      JOIN exteriors e ON c.exterior_type_id = e.id
      JOIN wheels w ON c.wheel_type_id = w.id`);

    const response = result.rows.map((row) => {
      const {
        car_id,
        car_name,
        base_model_id,
        base_model_price,
        interior_id,
        interior_price,
        exterior_id,
        exterior_price,
        wheel_id,
        wheel_price,
      } = row;
      const totalPrice =
        base_model_price + interior_price + exterior_price + wheel_price;
      return {
        carId: car_id,
        baseModelId: base_model_id,
        carName: car_name,
        interiorTypeId: interior_id,
        exteriorTypeId: exterior_id,
        wheelTypeId: wheel_id,
        price: totalPrice,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

carController.createCar = async (req, res) => {
  try {
    const { name, baseModelId, interiorId, exteriorId, wheelId, price } =
      req.body;

    // Check if the base model, interior, exterior, and wheel exist
    const checkBaseModelQuery = "SELECT * FROM car_base WHERE id = $1";
    const baseModelResult = await pool.query(checkBaseModelQuery, [
      baseModelId,
    ]);
    if (baseModelResult.rowCount === 0) {
      return res.status(404).json({ error: "Base model not found" });
    }

    const checkInteriorQuery = "SELECT * FROM interiors WHERE id = $1";
    const interiorResult = await pool.query(checkInteriorQuery, [interiorId]);
    if (interiorResult.rowCount === 0) {
      return res.status(404).json({ error: "Interior type not found" });
    }

    const checkExteriorQuery = "SELECT * FROM exteriors WHERE id = $1";
    const exteriorResult = await pool.query(checkExteriorQuery, [exteriorId]);
    if (exteriorResult.rowCount === 0) {
      return res.status(404).json({ error: "Exterior type not found" });
    }

    const checkWheelQuery = "SELECT * FROM wheels WHERE id = $1";
    const wheelResult = await pool.query(checkWheelQuery, [wheelId]);
    if (wheelResult.rowCount === 0) {
      return res.status(404).json({ error: "Wheel type not found" });
    }

    // Calculate the total price
    const totalPrice =
      parseFloat(baseModelResult.rows[0].price) +
      parseFloat(interiorResult.rows[0].price) +
      parseFloat(exteriorResult.rows[0].price) +
      parseFloat(wheelResult.rows[0].price);

    // Insert the car
    const carQuery = `
      INSERT INTO cars (name, base_model_id, interior_type_id, exterior_type_id, wheel_type_id, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const carResult = await pool.query(carQuery, [
      name,
      baseModelId,
      interiorId,
      exteriorId,
      wheelId,
      totalPrice,
    ]);

    const carId = carResult.rows[0].id;
    res.status(201).json({
      message: "Car created successfully",
      carId: carId,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(409).json({ error: "Failed to create car" });
  }
};

carController.getCar = async (req, res) => {
  console.log("TEST");
  
  const { carId } = req.params;
  try {
    const query = `
        SELECT 
        c.id,
        c.name,
        cb.base_model,
        cb.make,
        cb.year,
        cb.bodyStyle,
        i.material AS interior_material,
        i.color AS interior_color,
        e.finish AS exterior_finish,
        e.color AS exterior_color,
        w.name AS wheels,
        FROM cars c
      JOIN car_base cb ON c.base_model_id = cb.id
      JOIN interiors i ON c.interior_type_id = i.id
      JOIN exteriors e ON c.exterior_type_id = e.id
      JOIN wheels w ON c.wheel_type_id = w.id
      WHERE c.id = $1 LIMIT 1`;

    const values = [parseInt(carId)];
    const results = await pool.query(query, values);

    res.status(201).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

// Remember to do these
carController.deleteCar = async (req, res) => {};

carController.updateCar = async (req, res) => {};

export default carController;
