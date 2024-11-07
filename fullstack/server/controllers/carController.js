import { pool } from "../config/db.js";
import { Cars } from "../models/model.js";

const carController = {};

/**
 * Retrieves a paginated list of cars, including each car's main details
 * and a picture URL if available.
 *
 * @param {Request} req - The Express request object, expects optional `page` and `size` query parameters for pagination.
 * @param {Response} res - The Express response object, returns a JSON array of car details with pagination.
 *
 * @route GET /cars?page=1&size=10
 *
 * @example
 * // URL: /cars?page=3&size=25
 *
 * @returns {Object[]} 200 - Array of car objects
 * @returns {string} 500 - Error message if retrieval fails
 */
carController.getAllCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const start = (Number(page) - 1) * Number(size);

    const result = await pool.query(
      `
        SELECT
          c.id,
          c.model,
          c.make,
          c.year,
          c.body_type,
          p.id AS pic_id,
          p.url
        FROM Cars c
        JOIN CarGalleries cg ON c.id = cg.car_id
        JOIN Pictures p ON cg.id = p.gallery_id
        ORDER BY c.make ASC
        LIMIT $1 OFFSET $2
      `,
      [start, size]
    );

    const cars = result.rows.map((row) => {
      row.id,
        row.model,
        row.make,
        row.year,
        row.body_type,
        row.pic_id,
        "/api/cars/".concat(row.id);
    });

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a new car entry in the database, including its specifications.
 *
 * @param {Request} req - The Express request object, expects `model`, `make`, `year`, `body_type`,
 * `price_estimate`, `horsepower`, `mileage`, `seats`, `cargo_volume`, `engine_type`, `drivetrain` in the request body.
 * @param {Response} res - The Express response object, returns a JSON message with the newly created car ID.
 *
 * @route POST /cars
 *
 * @returns {Object} 201 - Success message with car ID
 * @returns {string} 409 - Error message if car creation fails
 */
carController.createCar = async (req, res) => {
  try {
    const {
      model,
      make,
      year,
      body_type,
      price_estimate,
      horsepower,
      mileage,
      seats,
      cargo_volume,
      engine_type,
      drivetrain,
    } = req.body;

    const checkIfCarExistsQuery = `SELECT * from Cars WHERE model = $1 AND make = $2 AND year = $3 AND body_type = $4 LIMIT 1`;
    const checkCarRes = await pool.query(checkIfCarExistsQuery, [
      model,
      make,
      year,
      body_type,
    ]);

    if (checkCarRes === 1) {
      return res.status(409).json({ error: "Car already exists" });
    }

    const carQuery = `
    INSERT INTO Cars (
      model,
      make,
      year,
      body_type,
      price_estimate
    ) VALUES (
      $1, $2, $3, $4, $5
      ) RETURNING id`;

    const carRes = await pool.query(carQuery, [
      model,
      make,
      year,
      body_type,
      price_estimate,
    ]);

    const carSpecsQuery = `
    INSERT INTO CarSpecs (
      horsepower,
      mileage,
      seats,
      car_id
      cargo_volume,
      engine_type,
      drivetrain
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    ) RETURNING id`;

    const CarSpecsRes = await pool.query(carSpecsQuery, [
      horsepower,
      mileage,
      seats,
      carRes.rows[0].id,
      cargo_volume,
      engine_type,
      drivetrain,
    ]);

    res.status(201).json({
      message: "Car created sucessfully",
      carId: CarSpecsRes.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(409).json({ error: "Failed to create car" });
  }
};


/**
 * Retrieves a single car's details, including specifications and associated pictures.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters.
 * @param {Response} res - The Express response object, returns a JSON object with car details and pictures.
 *
 * @route GET /cars/:id
 *
 * @returns {Object} 200 - Car details object
 * @returns {string} 404 - Error message if car not found
 */
carController.getCar = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT
          c.id,
          c.model,
          c.make,
          c.year,
          c.body_type,
          cs.horsepower,
          cs.mileage,
          cs.seats,
          cs.cargo_volume,
          cs.engine_type,
          cs.drivetrain,
          p.url AS picture_url
        FROM Cars c
        LEFT JOIN CarSpecs cs ON c.id = cs.car_id
        LEFT JOIN CarGalleries cg ON c.id = cg.car_id
        LEFT JOIN Pictures p ON cg.id = p.gallery_id
        WHERE c.id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a logo entry for a car make in the database.
 *
 * @param {Request} req - The Express request object, expects `make` and `logo` in the request body.
 * @param {Response} res - The Express response object, returns a JSON message with the logo ID.
 *
 * @route POST /car-logos
 *
 * @returns {Object} 201 - Success message with logo ID
 * @returns {string} 409 - Error message if logo creation fails
 */
carController.createLogo = async (req, res) => {
  try {
    const { make, logo } = req.query;

    const logoQuery = `
    INSERT INTO CarLogos (
      logo,
      make,
    ) VALUES (
     $1, $2
    ) RETURNING id
    `;
    const logoRes = await pool.query(logoQuery, [make, logo]);

    res.status(201).json({
      message: "Car logo created sucessfully",
      carId: logoRes.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(409).json({ error: "Failed to create car" });
  }
};

/**
 * Retrieves all car logos from the database.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, returns a JSON array of car logos.
 *
 * @route GET /car-logos
 *
 * @returns {Object[]} 200 - Array of car logo objects
 * @returns {string} 500 - Error message if retrieval fails
 */
carController.getAllLogos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const start = (Number(page) - 1) * Number(size);

    const result = await pool.query(`
      SELECT * FROM CarLogos 
      LIMIT $1 OFFSET $2
      `, [size, start]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates or updates a car gallery with pictures.
 *
 * @param {Request} req - The Express request object, expects `car_id`, `gallery_id` (optional), 
 * and `pictures` (array of URLs) in the request body.
 * @param {Response} res - The Express response object, returns a JSON message with the gallery ID and picture URLs.
 *
 * @route POST /cars/gallery
 *
 * @returns {Object} 200 - Success message with gallery and picture IDs
 * @returns {string} 400 - Error message if gallery creation fails
 */
carController.createCarGallery = async (req, res) => {
  try {
    let { car_id, gallery_id, pictures } = req.query;

    if (isNaN(gallery_id)) {
      const galleryQuery = `
      INSERT INTO CarGalleries (car_id) 
      VALUES ($1) 
      RETURNING id
      `;
      const galleryRes = await pool.query(galleryQuery, [car_id])
      gallery_id = galleryRes.rows[0].id;
    }
    const pictureQuery = `
      INSERT INTO Pictures (url, gallery_id)
      VALUES ($1, $2)
      RETURNING id
    `;
    
    let picturesIds = []
    for (let picture of pictures) {
      const pictureRes = await pool.query(pictureQuery, [picture.url, gallery_id]);
      picturesIds.push({
        id: pictureRes.rows[0].id,
        url: picture.url,
      });
    }
    res.status(200).json({
      "message": "Gallery updated sucessfully",
      "gallery_id": gallery_id,
      "car_id": car_id,
      "pictures": picturesIds
    })
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * Updates an existing car's details in the database.
 *
 * @param {Request} req - The Express request object, expects `id` in the route parameters,
 * and the following fields in the request body (optional, only provided fields will be updated):
 * `model`, `make`, `year`, `body_type`, `price_estimate`, `horsepower`, `mileage`, `seats`,
 * `cargo_volume`, `engine_type`, and `drivetrain`.
 * @param {Response} res - The Express response object, returns a JSON message indicating success or failure.
 *
 * @route PUT /cars/:id
 *
 * @example
 * // Request body: { "model": "Updated Model", "make": "Updated Make" }
 *
 * @returns {Object} 200 - Success message with the updated car ID
 * @returns {string} 404 - Error message if car not found
 * @returns {string} 500 - Error message if update fails
 */
carController.updateCar = async (req, res) => {
  const { id } = req.params;
  const {
    model,
    make,
    year,
    body_type,
    price_estimate,
    horsepower,
    mileage,
    seats,
    cargo_volume,
    engine_type,
    drivetrain,
  } = req.body;

  try {
    // Check if the car exists
    const checkCarQuery = `SELECT id FROM Cars WHERE id = $1`;
    const checkCarResult = await pool.query(checkCarQuery, [id]);

    if (checkCarResult.rowCount === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update the Cars table
    const updateCarQuery = `
      UPDATE Cars SET
        model = COALESCE($1, model),
        make = COALESCE($2, make),
        year = COALESCE($3, year),
        body_type = COALESCE($4, body_type),
        price_estimate = COALESCE($5, price_estimate)
      WHERE id = $6
    `;
    await pool.query(updateCarQuery, [
      model,
      make,
      year,
      body_type,
      price_estimate,
      id,
    ]);

    // Update the CarSpecs table
    const updateCarSpecsQuery = `
      UPDATE CarSpecs SET
        horsepower = COALESCE($1, horsepower),
        mileage = COALESCE($2, mileage),
        seats = COALESCE($3, seats),
        cargo_volume = COALESCE($4, cargo_volume),
        engine_type = COALESCE($5, engine_type),
        drivetrain = COALESCE($6, drivetrain)
      WHERE car_id = $7
    `;
    await pool.query(updateCarSpecsQuery, [
      horsepower,
      mileage,
      seats,
      cargo_volume,
      engine_type,
      drivetrain,
      id,
    ]);

    res.status(200).json({
      message: "Car updated successfully",
      carId: id,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car" });
  }
};


/**
 * Retrieves all galleries along with their associated pictures.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object, returns an array of galleries with pictures.
 *
 * @route GET /galleries
 *
 * @example
 * // Response: [{ "gallery_id": 1, "car_id": 3, "pictures": [{ "id": 1, "url": "https://example.com/image1.jpg" }, ...] }, ...]
 *
 * @returns {Array} 200 - Success response with galleries and pictures
 * @returns {string} 500 - Error message if retrieval fails
 */
carController.getAllGalleries = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cg.id AS gallery_id,
        cg.car_id,
        p.id AS picture_id,
        p.url
      FROM CarGalleries cg
      LEFT JOIN Pictures p ON cg.id = p.gallery_id
      ORDER BY cg.id ASC
    `);

    // Group results by gallery_id
    const galleries = {};
    result.rows.forEach((row) => {
      const { gallery_id, car_id, picture_id, url } = row;

      if (!galleries[gallery_id]) {
        galleries[gallery_id] = {
          gallery_id,
          car_id,
          pictures: [],
        };
      }

      if (picture_id) {
        galleries[gallery_id].pictures.push({ id: picture_id, url });
      }
    });

    res.status(200).json(Object.values(galleries));
  } catch (error) {
    console.error("Error retrieving galleries:", error);
    res.status(500).json({ error: "Failed to retrieve galleries" });
  }
};

/**
 * Retrieves a single gallery by its ID along with its associated pictures.
 *
 * @param {Request} req - The Express request object, expects `gallery_id` in the route parameters.
 * @param {Response} res - The Express response object, returns a gallery with pictures.
 *
 * @route GET /galleries/:gallery_id
 *
 * @example
 * // Response: { "gallery_id": 1, "car_id": 3, "pictures": [{ "id": 1, "url": "https://example.com/image1.jpg" }, ...] }
 *
 * @returns {Object} 200 - Success response with the gallery and its pictures
 * @returns {string} 404 - Error message if gallery not found
 * @returns {string} 500 - Error message if retrieval fails
 */
carController.getGallery = async (req, res) => {
  const { gallery_id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        cg.id AS gallery_id,
        cg.car_id,
        p.id AS picture_id,
        p.url
      FROM CarGalleries cg
      LEFT JOIN Pictures p ON cg.id = p.gallery_id
      WHERE cg.id = $1
    `, [gallery_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const gallery = {
      gallery_id: result.rows[0].gallery_id,
      car_id: result.rows[0].car_id,
      pictures: result.rows
        .filter(row => row.picture_id)
        .map(row => ({ id: row.picture_id, url: row.url })),
    };

    res.status(200).json(gallery);
  } catch (error) {
    console.error("Error retrieving gallery:", error);
    res.status(500).json({ error: "Failed to retrieve gallery" });
  }
};

export default carController;
