import express from "express";
import carController from "../controllers/carController.js";

const carRouter = express.Router();

carRouter.get("/", carController.getAllCars);
carRouter.post("/", carController.createCar);
carRouter.get("/:id", carController.getCar);
carRouter.put("/:id", carController.updateCar);
carRouter.post("/gallery", carController.createCarGallery);
galleryRouter.get("/gallery", carController.getAllGalleries);
galleryRouter.get("/gallery/:gallery_id", carController.getGallery);

export default carRouter;
