import express from "express";
import wheelController from "../controllers/wheelController";

const wheelRouter = express.Router();

wheelRouter.get("/wheels", wheelController.getAllWheels);
wheelRouter.post("/wheels", wheelController.createWheel);
wheelRouter.get("/wheels/:id", wheelController.getWheel);

export default wheelRouter;
