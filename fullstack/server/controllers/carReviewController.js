import { pool } from "../config/db.js";

const reviewController = {};

/**
 * Creates a new review for a car by a user.
 *
 * @param {Request} req - The Express request object, containing review details in the body.
 * @param {Response} res - The Express response object, returning the newly created review's ID.
 *
 * @route POST /reviews
 *
 * @example
 * // Request body: { "user_id": 1, "car_id": 2, "review_score": 4.5, "review_title": "Great Car", "review_comment": "Loved the performance." }
 * // Response: { "message": "Review created successfully", "reviewId": 1 }
 *
 * @returns {Object} 201 - Success message with review ID
 * @returns {string} 400 - Error message if creation fails
 */
reviewController.createReview = async (req, res) => {
  const { user_id, car_id, review_score, review_title, review_comment } = req.body;

  try {
    // Check if the user exists
    const userCheck = await pool.query("SELECT id FROM Users WHERE id = $1", [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the car exists
    const carCheck = await pool.query("SELECT id FROM Cars WHERE id = $1", [car_id]);
    if (carCheck.rowCount === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO CarReviews (user_id, car_id, review_score, review_title, review_comment, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id
      `,
      [user_id, car_id, review_score, review_title, review_comment]
    );

    res.status(201).json({
      message: "Review created successfully",
      reviewId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ error: "Failed to create review" });
  }
};

/**
 * Retrieves all reviews for a specific car.
 *
 * @param {Request} req - The Express request object, expects `car_id` in the query parameters.
 * @param {Response} res - The Express response object, returning an array of review objects.
 *
 * @route GET /reviews?car_id=1
 *
 * @example
 * // Response: [{ "id": 1, "user_id": 1, "car_id": 2, "review_score": 4.5, "review_title": "Great Car", ... }, ...]
 *
 * @returns {Array} 200 - Success response with list of reviews
 * @returns {string} 400 - Error message if car_id is missing
 * @returns {string} 500 - Error message if retrieval fails
 */
reviewController.getAllReviewsForCar = async (req, res) => {
  const { car_id } = req.query;

  if (!car_id) {
    return res.status(400).json({ error: "Car ID is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, user_id, car_id, review_score, review_title, review_comment, created_at, updated_at
      FROM CarReviews
      WHERE car_id = $1
      ORDER BY created_at DESC
      `,
      [car_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};

/**
 * Retrieves a single review by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a review object.
 *
 * @route GET /reviews/:id
 *
 * @example
 * // Response: { "id": 1, "user_id": 1, "car_id": 2, "review_score": 4.5, "review_title": "Great Car", ... }
 *
 * @returns {Object} 200 - Success response with review details
 * @returns {string} 404 - Error message if review not found
 * @returns {string} 500 - Error message if retrieval fails
 */
reviewController.getReview = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, user_id, car_id, review_score, review_title, review_comment, created_at, updated_at
      FROM CarReviews
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving review:", error);
    res.status(500).json({ error: "Failed to retrieve review" });
  }
};

/**
 * Updates a review by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters and updated fields in the body.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route PUT /reviews/:id
 *
 * @example
 * // Request body: { "review_score": 4.0, "review_comment": "Updated comment" }
 * // Response: { "message": "Review updated successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if review not found
 * @returns {string} 500 - Error message if update fails
 */
reviewController.updateReview = async (req, res) => {
  const { id } = req.params;
  const { review_score, review_title, review_comment } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE CarReviews
      SET review_score = COALESCE($1, review_score),
          review_title = COALESCE($2, review_title),
          review_comment = COALESCE($3, review_comment),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id
      `,
      [review_score, review_title, review_comment, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

/**
 * Deletes a review by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route DELETE /reviews/:id
 *
 * @example
 * // Response: { "message": "Review deleted successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if review not found
 * @returns {string} 500 - Error message if deletion fails
 */
reviewController.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM CarReviews
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

export default reviewController;
