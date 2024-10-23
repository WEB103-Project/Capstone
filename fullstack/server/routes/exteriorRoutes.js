import express from "express";
import exteriorController from "../controllers/exteriorController.js"; // Import the exteriorController

const exteriorRouter = express.Router();

exteriorRouter.get("/exteriors", exteriorController.getAllExteriors);
exteriorRouter.post("/exteriors", exteriorController.createExterior);
exteriorRouter.get("/exteriors/:id", exteriorController.getExterior);

export default exteriorRouter;
