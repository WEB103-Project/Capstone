import express from "express";
import carController from "../controllers/carController.js";

const carLogoRouter = express.Router();

carLogoRouter.get("/", carController.getAllLogos);
carRouter.post("/", carController.createLogo);

export default carLogoRouter;
