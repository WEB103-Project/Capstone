import { pool } from "../config/db.js"; // Assuming you're using a PostgreSQL connection pool

const exteriorController = {};

/**
 * Get all exteriors.
 * @route GET /api/exteriors
 */
exteriorController.getAllExteriors = async (req, res) => {
  try {
    const query = "SELECT * FROM exteriors";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching exteriors:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exteriors." });
  }
};

/**
 * Create a new exterior.
 * @route POST /api/exteriors
 */
exteriorController.createExterior = async (req, res) => {
  const { finish, color, price } = req.body;

  if (!finish || !color || !price) {
    return res
      .status(400)
      .json({ error: "All fields are required: finish, color, price." });
  }

  try {
    const query =
      "INSERT INTO exteriors (finish, color, price) VALUES ($1, $2, $3) RETURNING *";
    const values = [finish, color, price];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating exterior:", error);
    res
      .status(409)
      .json({ error: "An error occurred while creating the exterior." });
  }
};

/**
 * Get a specific exterior by ID.
 * @route GET /api/exteriors/:id
 */
exteriorController.getExterior = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM exteriors WHERE id = $1 LIMIT 1";
    const values = [id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Exterior not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching exterior:", error);
    res
      .status(409)
      .json({ error: "An error occurred while fetching the exterior." });
  }
};

export default exteriorController;
