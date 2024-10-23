import express from "express";
import interiorController from "../controllers/interiorController";

const interiorRouter = express.Router();

interiorRouter.get("/interiors", interiorController.getAllInteriors);
interiorRouter.post("/interiors", interiorController.createInterior);
interiorRouter.get("/interiors/:id", interiorController.getInterior);


export default interiorRouter;
