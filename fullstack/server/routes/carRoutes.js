
import express from "express";
import carController from "../controllers/carController.js";

const carRouter = express.Router();

// Get all cars
carRouter.get("/", carController.getAllCars);

// Create a new car
carRouter.post("/", carController.createCar);

export default carRouter;


/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Retrieve a list of all cars
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   model:
 *                     type: string
 *                   make:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 */

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model
 *               - year
 *               - vin
 *               - color
 *               - price
 *               - mileage
 *               - car_type
 *             properties:
 *               make:
 *                 type: string
 *                 description: The car's make
 *               model:
 *                 type: string
 *                 description: The car's model
 *               year:
 *                 type: integer
 *                 description: The year the car was manufactured
 *               vin:
 *                 type: string
 *                 description: The car's Vehicle Identification Number
 *               color:
 *                 type: string
 *                 description: The car's color
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the car
 *               mileage:
 *                 type: integer
 *                 description: The car's mileage
 *               car_type:
 *                 type: string
 *                 description: The type of the car (e.g., Sedan, SUV, Coupe)
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created car
 *                 make:
 *                   type: string
 *                 model:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 vin:
 *                   type: string
 *                 color:
 *                   type: string
 *                 price:
 *                   type: number
 *                 mileage:
 *                   type: integer
 *                 car_type:
 *                   type: string
 */
