import express from "express";
import carController from "../controllers/carController.js";

const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.post("/", carController.createCar);
carRouter.get("/:id", carController.getCar);
carRouter.post("/gallery", carController.createCarGallery);

export default carRouter;
