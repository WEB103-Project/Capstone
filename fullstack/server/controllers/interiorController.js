import { pool } from "../config/db.js";

const interiorController = () => {};

interiorController.getAllInteriors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM interiors");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching interiors:", error);
    res.status(409).json({ error: "Failed to fetch interiors" });
  }
};

interiorController.createInterior = async (req, res) => {
  const { material, color, price } = req.body;

  if (!material || !color || !price) {
    return res
      .status(409)
      .json({ error: "Material, color, and price are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO interiors (material, color, price) VALUES ($1, $2, $3) RETURNING *",
      [material, color, price]
    );
    res.status(201).json({
      message: "Interior created successfully",
      interior: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating interior:", error);
    res.status(409).json({ error: "Failed to create interior" });
  }
};

interiorController.getInterior = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM interiors WHERE id = $1 LIMIT 1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interior not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching interior:", error);
    res.status(409).json({ error: "Failed to fetch interior" });
  }
};

export default interiorController;
