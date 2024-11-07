import { pool } from "../config/db.js";

const userController = {};

/**
 * Creates a new user in the database.
 *
 * @param {Request} req - The Express request object, containing user information in the body.
 * @param {Response} res - The Express response object, returning the newly created user's ID.
 *
 * @route POST /users
 *
 * @example
 * // Request body: { "username": "john_doe", "role": "user", "email": "john@example.com", "first_name": "John", "last_name": "Doe", "phone_number": "1234567890" }
 * // Response: { "message": "User created successfully", "userId": 1 }
 *
 * @returns {Object} 201 - Success message with user ID
 * @returns {string} 400 - Error message if creation fails
 */
userController.createUser = async (req, res) => {
  const { username, role, email, first_name, last_name, phone_number } =
    req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO Users (username, role, email, first_name, last_name, phone_number, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id
      `,
      [username, role, email, first_name, last_name, phone_number]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
};

/**
 * Retrieves all users from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, returning an array of user objects.
 *
 * @route GET /users
 *
 * @example
 * // Response: [{ "id": 1, "username": "john_doe", "role": "user", ... }, ...]
 *
 * @returns {Array} 200 - Success response with list of users
 * @returns {string} 500 - Error message if retrieval fails
 */
userController.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, role, email, first_name, last_name, phone_number, created_at
      FROM Users
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

/**
 * Retrieves a single user by ID from the database.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a user object.
 *
 * @route GET /users/:id
 *
 * @example
 * // Response: { "id": 1, "username": "john_doe", "role": "user", ... }
 *
 * @returns {Object} 200 - Success response with user details
 * @returns {string} 404 - Error message if user not found
 * @returns {string} 500 - Error message if retrieval fails
 */
userController.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, username, role, email, first_name, last_name, phone_number, created_at
      FROM Users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

/**
 * Updates a user's details in the database.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters and updated fields in the body.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route PUT /users/:id
 *
 * @example
 * // Request body: { "email": "new_email@example.com", "phone_number": "0987654321" }
 * // Response: { "message": "User updated successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if user not found
 * @returns {string} 500 - Error message if update fails
 */
userController.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role, email, first_name, last_name, phone_number } =
    req.body;

  try {
    const result = await pool.query(
      `
      UPDATE Users
      SET username = COALESCE($1, username),
          role = COALESCE($2, role),
          email = COALESCE($3, email),
          first_name = COALESCE($4, first_name),
          last_name = COALESCE($5, last_name),
          phone_number = COALESCE($6, phone_number)
      WHERE id = $7
      RETURNING id
      `,
      [username, role, email, first_name, last_name, phone_number, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * Deletes a user from the database by ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route DELETE /users/:id
 *
 * @example
 * // Response: { "message": "User deleted successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if user not found
 * @returns {string} 500 - Error message if deletion fails
 */
userController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM Users
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export default userController;
