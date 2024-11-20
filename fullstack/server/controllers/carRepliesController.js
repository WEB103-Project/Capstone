import { pool } from "../config/database.js";

const replyController = {};

/**
 * Creates a new reply to a review or another reply.
 *
 * @param {Request} req - The Express request object, containing reply details in the body.
 * @param {Response} res - The Express response object, returning the newly created reply's ID.
 *
 * @route POST /replies
 *
 * @example
 * // Request body: { "user_id": 1, "review_comment": "Thanks for the insight!", "replying_to_review": 1 }
 * // Response: { "message": "Reply created successfully", "replyId": 1 }
 *
 * @returns {Object} 201 - Success message with reply ID
 * @returns {string} 400 - Error message if creation fails or validation fails
 */
replyController.createReply = async (req, res) => {
  const { user_id, review_comment, replying_to_reply, replying_to_review } = req.body;

  try {
    // Check if the user exists
    const userCheck = await pool.query("SELECT id FROM Users WHERE id = $1", [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if replying_to_review exists if provided
    if (replying_to_review) {
      const reviewCheck = await pool.query("SELECT id FROM CarReviews WHERE id = $1", [replying_to_review]);
      if (reviewCheck.rowCount === 0) {
        return res.status(404).json({ error: "Review not found" });
      }
    }

    // Check if replying_to_reply exists if provided
    if (replying_to_reply) {
      const replyCheck = await pool.query("SELECT id FROM CarReplies WHERE id = $1", [replying_to_reply]);
      if (replyCheck.rowCount === 0) {
        return res.status(404).json({ error: "Reply not found" });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO CarReplies (user_id, review_comment, created_at, updated_at, votes, replying_to_reply, replying_to_review)
      VALUES ($1, $2, NOW(), NOW(), 0, $3, $4)
      RETURNING id
      `,
      [user_id, review_comment, replying_to_reply || null, replying_to_review || null]
    );

    res.status(201).json({
      message: "Reply created successfully",
      replyId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(400).json({ error: "Failed to create reply" });
  }
};

/**
 * Retrieves all replies for a specific review.
 *
 * @param {Request} req - The Express request object, expects `review_id` in the query parameters.
 * @param {Response} res - The Express response object, returning an array of reply objects.
 *
 * @route GET /replies?review_id=1
 *
 * @example
 * // Response: [{ "id": 1, "user_id": 1, "review_comment": "Thanks for the insight!", ... }, ...]
 *
 * @returns {Array} 200 - Success response with list of replies
 * @returns {string} 400 - Error message if review_id is missing
 * @returns {string} 500 - Error message if retrieval fails
 */
replyController.getAllRepliesForReview = async (req, res) => {
  const { review_id } = req.query;

  if (!review_id) {
    return res.status(400).json({ error: "Review ID is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, user_id, review_comment, created_at, updated_at, votes, replying_to_reply, replying_to_review
      FROM CarReplies
      WHERE replying_to_review = $1
      ORDER BY created_at DESC
      `,
      [review_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving replies:", error);
    res.status(500).json({ error: "Failed to retrieve replies" });
  }
};

/**
 * Retrieves a single reply by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a reply object.
 *
 * @route GET /replies/:id
 *
 * @example
 * // Response: { "id": 1, "user_id": 1, "review_comment": "Thanks for the insight!", ... }
 *
 * @returns {Object} 200 - Success response with reply details
 * @returns {string} 404 - Error message if reply not found
 * @returns {string} 500 - Error message if retrieval fails
 */
replyController.getReply = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, user_id, review_comment, created_at, updated_at, votes, replying_to_reply, replying_to_review
      FROM CarReplies
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving reply:", error);
    res.status(500).json({ error: "Failed to retrieve reply" });
  }
};

/**
 * Updates a reply by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters and updated fields in the body.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route PUT /replies/:id
 *
 * @example
 * // Request body: { "review_comment": "Updated comment" }
 * // Response: { "message": "Reply updated successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if reply not found
 * @returns {string} 500 - Error message if update fails
 */
replyController.updateReply = async (req, res) => {
  const { id } = req.params;
  const { review_comment, votes } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE CarReplies
      SET review_comment = COALESCE($1, review_comment),
          votes = COALESCE($2, votes),
          updated_at = NOW()
      WHERE id = $3
      RETURNING id
      `,
      [review_comment, votes, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json({ message: "Reply updated successfully" });
  } catch (error) {
    console.error("Error updating reply:", error);
    res.status(500).json({ error: "Failed to update reply" });
  }
};

/**
 * Deletes a reply by its ID.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returning a success message.
 *
 * @route DELETE /replies/:id
 *
 * @example
 * // Response: { "message": "Reply deleted successfully" }
 *
 * @returns {Object} 200 - Success message
 * @returns {string} 404 - Error message if reply not found
 * @returns {string} 500 - Error message if deletion fails
 */
replyController.deleteReply = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM CarReplies
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ error: "Failed to delete reply" });
  }
};

export default replyController;
