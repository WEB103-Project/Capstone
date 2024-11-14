import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import path from "path";
// const express = require('express');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');
// const path = require('path');

// const carRouter = require('../routes/carRoutes.js')
// Import routers
import carRouter from "../routes/carRoutes.js";

const app = express();
const port = 3002;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: ["./routes/*.js", "./webpack/swagger-config.yaml"], // Path to the API docs
};

// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/apidoc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/cars", carRouter);

// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
