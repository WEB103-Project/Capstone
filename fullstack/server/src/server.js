import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";

// import path from "path";
// const express = require('express');
// const swaggerUi = require('swagger-ui-express');
// const swaggerJsDoc = require('swagger-jsdoc');
// const path = require('path');

// Import routers
import carRouter from "../routes/carRoutes.js";
import userRouter from "../routes/userRoutes.js";
// import replyRouter from "../routes/carRepliesRoutes.js";
// import reviewRouter from "../routes/carReviewRoutes.js";
// import carLogoRouter from "../routes/logoRoutes.js";

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
app.use(cors());
app.use("/apidoc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/cars", carRouter);
app.use("/api/users", userRouter);
// app.use("/api/replies", replyRouter);
// app.use("/api/review", reviewRouter);
// app.use("/api/logo", carLogoRouter);


// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
