import express from "express";
import reviewController from "../controllers/carReviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", reviewController.createReview);
reviewRouter.get("/", reviewController.getAllReviewsForCar);
reviewRouter.get("/:id", reviewController.getReview);
reviewRouter.put("/:id", reviewController.updateReview);
reviewRouter.delete("/:id", reviewController.deleteReview);

export default reviewRouter;
