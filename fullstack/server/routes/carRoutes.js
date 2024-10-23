import express from "express";
import carController from "../controllers/carController.js";

const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.post("/", carController.createCar);
carRouter.get("/:id", carController.getCar);

// carRouter.put("/cars/:id", carController.updateCar);
// carRouter.delete("/cars/:id", carController.deleteCar);

export default carRouter;
