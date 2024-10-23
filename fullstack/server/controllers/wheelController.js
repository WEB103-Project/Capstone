import { pool } from "../config/db.js";

const wheelController = () => {};

wheelController.getAllWheels = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM wheels");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching wheels:", error);
    res.status(409).json({ error: "Failed to fetch wheels" });
  }
};

wheelController.createWheel = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO wheels (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );
    res.status(201).json({
      message: "Wheel created successfully",
      wheel: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating wheel:", error);
    res.status(409).json({ error: "Failed to create wheel" });
  }
};

wheelController.getWheel = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM wheels WHERE id = $1 LIMIT 1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Wheel not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching wheel:", error);
    res.status(409).json({ error: "Failed to fetch wheel" });
  }
};

export default wheelController;
