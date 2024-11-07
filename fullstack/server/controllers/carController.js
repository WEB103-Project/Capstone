import { pool } from "../config/db.js";
import { Cars } from "../models/model.js";

const carController = {};

carController.getAllCars = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const start = (Number(page) - 1) * Number(size);
    const end = start + Number(size) - 1;

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

      `,
      [start, end] // Pass the limit and offset values as parameters
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
      return res.status(404).json({ error: "Car already exists" });
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


carController.createCarGallery = async (req, res) => {
  try {
    let { car_id, gallery_id, pictures } = req.query;

    if (isNaN(gallery_id)) {
      const galleryQuery = `
      INSERT INTO CarGalleries (
        car_id
      ) VALUES (
        $1
      ) RETURNING id
      `
      const galleryRes = await pool.query(galleryQuery, [car_id])
      gallery_id = galleryRes.rows[0].id;
    }
    const pictureQuery = `
    INSERT INTO Pictures (
      url,
      gallery
    ) VALUES (
     $1, $2
    ) RETURNING id
    `
    
    let picturesIds = []
    pictures.map(async row => {
      const picturesRes = await pool.query(pictureQuery, [row.url, gallery_id])
      picturesIds.push({
        "id": picturesRes.rows[0].id,
        "url": row.url
      })
    })
    res.status(200).json({
      "message": "Gallery is updated sucessfully",
      "gallery_id": gallery_id,
      "car_id": car_id,
      "pictures": picturesIds
    })
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(400).json({ error: error.message });
  }
}

carController.getCar = async (req, res) => {
  const { id } = req.params;

  try {
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default carController;
