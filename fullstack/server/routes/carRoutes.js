
import express from "express";
import carController from "../controllers/carController.js";

const carRouter = express.Router();

// Get all cars
carRouter.get("/", carController.getAllCars);

// Create a new car
carRouter.post("/", carController.createCar);

// Get a single car by ID
carRouter.get("/:id", carController.getCar);

//carRouter.put("/:id", carController.updateCar);
//carRouter.post("/gallery", carController.createCarGallery);
//carRouter.get("/gallery", carController.getAllGalleries);
//carRouter.get("/gallery/:gallery_id", carController.getGallery);

export default carRouter;


/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Retrieve a list of all cars with detailed specifications
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
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the car
 *                   make:
 *                     type: string
 *                     description: The car's manufacturer
 *                   model:
 *                     type: string
 *                     description: The car's model
 *                   year:
 *                     type: integer
 *                     description: The manufacturing year of the car
 *                   price:
 *                     type: number
 *                     description: The price of the car
 *                   performance:
 *                     type: string
 *                     description: The performance description of the car
 *                   mileage:
 *                     type: string
 *                     description: The overall mileage of the car
 *                   volume:
 *                     type: string
 *                     description: The volume of the car's interior
 *                   seats:
 *                     type: integer
 *                     description: The number of seats in the car
 *                   wheelBase:
 *                     type: string
 *                     description: The car's wheelbase dimensions
 *                   towingCapacity:
 *                     type: string
 *                     description: The car's towing capacity
 *                   drivetrain:
 *                     type: string
 *                     description: The type of drivetrain (e.g., FWD, AWD)
 *                   transmission:
 *                     type: string
 *                     description: The car's transmission type
 *                   horsepower:
 *                     type: integer
 *                     description: The horsepower of the car's engine
 *                   torque:
 *                     type: string
 *                     description: The torque of the car's engine
 *                   engine:
 *                     type: string
 *                     description: The type of engine in the car
 *                   cityMileage:
 *                     type: string
 *                     description: The city mileage of the car
 *                   highwayMileage:
 *                     type: string
 *                     description: The highway mileage of the car
 *                   cargoCapacity:
 *                     type: string
 *                     description: The car's cargo capacity
 *                   frontHeadRoom:
 *                     type: string
 *                     description: The headroom space in the front
 *                   frontLegRoom:
 *                     type: string
 *                     description: The legroom space in the front
 *                   frontShoulderRoom:
 *                     type: string
 *                     description: The shoulder room space in the front
 *                   curbWeight:
 *                     type: string
 *                     description: The curb weight of the car
 *                   overallWidth:
 *                     type: string
 *                     description: The overall width of the car
 *                   overallLength:
 *                     type: string
 *                     description: The overall length of the car
 *                   galleryCarId:
 *                     type: integer
 *                     description: The ID of the car in the gallery
 *                   logoCarUrl:
 *                     type: string
 *                     description: URL for the car's logo
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

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Retrieve a single car by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the car to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The car was found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the car
 *                 make:
 *                   type: string
 *                   description: The make of the car
 *                 model:
 *                   type: string
 *                   description: The model of the car
 *                 year:
 *                   type: integer
 *                   description: The year the car was manufactured
 *                 vin:
 *                   type: string
 *                   description: The car's Vehicle Identification Number
 *                 color:
 *                   type: string
 *                   description: The color of the car
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the car
 *                 mileage:
 *                   type: integer
 *                   description: The mileage of the car
 *                 car_type:
 *                   type: string
 *                   description: The type of the car (e.g., Sedan, SUV)
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
