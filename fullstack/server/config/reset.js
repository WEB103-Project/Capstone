import { pool } from "./database.js";
import "../config/dotenv.js";

import { cars } from "../data/Cars.js";
import { carGalleries } from "../data/carGalleries.js";
import { carSpecs} from "../data/carSpecs.js";
import { carReviews} from "../data/carReviews.js";
import { carReplies} from "../data/carReplies.js";

var replies = carReplies

const createCarsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS cars;
    
    CREATE TABLE IF NOT EXISTS cars (
      id SERIAL PRIMARY KEY,
      model VARCHAR(255) NOT NULL,
      make VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      price DECIMAL NOT NULL,
      description TEXT NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Cars table created successfully");
  } catch (err) {
    console.log("Error creating cars table", err);
  }
};

const createCarGalleriesTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS car_galleries;
    
    CREATE TABLE IF NOT EXISTS car_galleries (
      id SERIAL PRIMARY KEY,
      car_id INTEGER REFERENCES cars(id),
      image_url TEXT NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Car galleries table created successfully");
  } catch (err) {
    console.log("Error creating car galleries table", err);
  }
};

const createCarSpecsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS car_specs;
    
    CREATE TABLE IF NOT EXISTS car_specs (
      id SERIAL PRIMARY KEY,
      car_id INTEGER REFERENCES cars(id),
      spec_name VARCHAR(255) NOT NULL,
      spec_value VARCHAR(255) NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Car specs table created successfully");
  } catch (err) {
    console.log("Error creating car specs table", err);
  }
};

const createCarReviewsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS car_reviews;
    
    CREATE TABLE IF NOT EXISTS car_reviews (
      id SERIAL PRIMARY KEY,
      car_id INTEGER REFERENCES cars(id),
      user_id INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      rating INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INTEGER DEFAULT 0
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Car reviews table created successfully");
  } catch (err) {
    console.log("Error creating car reviews table", err);
  }
};

const createRepliesTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS replies;
    
    CREATE TABLE IF NOT EXISTS replies (
      id SERIAL PRIMARY KEY,
      review_id INTEGER REFERENCES car_reviews(id),
      user_id INTEGER NOT NULL,
      review_comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      votes INTEGER DEFAULT 0,
      replying_to_reply INTEGER,
      replying_to_review INTEGER
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Replies table created successfully");
  } catch (err) {
    console.log("Error creating replies table", err);
  }
};

const seedCarsTableWithData = async () => {
  await createCarsTable();

  const insertQuery = `INSERT INTO cars (model, make, year, price, description) VALUES ($1, $2, $3, $4, $5)`;

  try {
    for (const car of cars) {
      const { model, make, year, price, description } = car;
      const values = [model, make, year, price, description];
      await pool.query(insertQuery, values);
      console.log(`${model} has been inserted successfully`);
    }
    console.log("---All car data has been inserted successfully---");
  } catch (err) {
    console.error("Error inserting car data", err);
  }
};

const seedCarGalleriesTableWithData = async () => {
  await createCarGalleriesTable();

  const insertQuery = `INSERT INTO car_galleries (car_id, image_url) VALUES ($1, $2)`;

  try {
    for (const gallery of carGalleries) {
      const { car_id, image_url } = gallery;
      const values = [car_id, image_url];
      await pool.query(insertQuery, values);
      console.log(`Image for car ID ${car_id} has been inserted successfully`);
    }
    console.log("---All car gallery data has been inserted successfully---");
  } catch (err) {
    console.error("Error inserting car gallery data", err);
  }
};

const seedCarSpecsTableWithData = async () => {
  await createCarSpecsTable();

  const insertQuery = `INSERT INTO car_specs (car_id, spec_name, spec_value) VALUES ($1, $2, $3)`;

  try {
    for (const spec of carSpecs) {
      const { car_id, spec_name, spec_value } = spec;
      const values = [car_id, spec_name, spec_value];
      await pool.query(insertQuery, values);
      console.log(`Spec for car ID ${car_id} has been inserted successfully`);
    }
    console.log("---All car specs data has been inserted successfully---");
  } catch (err) {
    console.error("Error inserting car specs data", err);
  }
};

const seedCarReviewsTableWithData = async () => {
  await createCarReviewsTable();

  const insertQuery = `INSERT INTO car_reviews (car_id, user_id, review_text, rating, votes) VALUES ($1, $2, $3, $4, $5)`;

  try {
    for (const review of carReviews) {
      const { car_id, user_id, review_text, rating, votes } = review;
      const values = [car_id, user_id, review_text, rating, votes];
      await pool.query(insertQuery, values);
      console.log(`Review for car ID ${car_id} has been inserted successfully`);
    }
    console.log("---All car review data has been inserted successfully---");
  } catch (err) {
    console.error("Error inserting car review data", err);
  }
};

const seedRepliesTableWithData = async () => {
  await createRepliesTable();

  const insertQuery = `INSERT INTO replies (review_id, user_id, review_comment, votes, replying_to_reply, replying_to_review) VALUES ($1, $2, $3, $4, $5, $6)`;

  try {
    for (const reply of replies) {
      const { review_id, user_id, review_comment, votes, replying_to_reply, replying_to_review } = reply;
      const values = [review_id, user_id, review_comment, votes, replying_to_reply, replying_to_review];
      await pool.query(insertQuery, values);
      console.log(`Reply for review ID ${review_id} has been inserted successfully`);
    }
    console.log("---All replies data has been inserted successfully---");
  } catch (err) {
    console.error("Error inserting replies data", err);
  }
};

seedCarsTableWithData();
seedCarGalleriesTableWithData();
seedCarSpecsTableWithData();
seedCarReviewsTableWithData();
seedRepliesTableWithData();


