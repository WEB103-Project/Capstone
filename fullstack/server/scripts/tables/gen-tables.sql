CREATE TABLE IF NOT EXISTS CarLogos (
  id SERIAL PRIMARY KEY,
  logo TEXT,
  country VARCHAR(64),
  make VARCHAR(32) UNIQUE
);

DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transmission_type') THEN
       CREATE TYPE transmission_type AS ENUM ('MANUAL', 'AUTOMATIC', 'SEMI-AUTOMATIC');
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'drivetrain_type') THEN
       CREATE TYPE drivetrain_type AS ENUM ('FWD', 'RWD', '4WD', 'AWD', '2WD');
   END IF;

   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
       CREATE TYPE user_type AS ENUM ('USER', 'MECHANIC', 'ADMIN');
   END IF;
END $$;


CREATE TABLE IF NOT EXISTS Mileage (
    id SERIAL PRIMARY KEY,
    city INT,
    highway INT
);

CREATE TABLE IF NOT EXISTS Performance (
    id SERIAL PRIMARY KEY,
    horsepower VARCHAR(64),
    torque VARCHAR(64),
    engine VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS SpaceVolume (
    id SERIAL PRIMARY KEY,
    cargo_capacity FLOAT,
    front_head_room FLOAT,
    front_leg_room FLOAT,
    front_shoulder_room FLOAT,
    curb_weight FLOAT,
    overall_width FLOAT,
    overall_length FLOAT
); 

CREATE TABLE IF NOT EXISTS CarSpecs (
    id SERIAL PRIMARY KEY,
    performance INT REFERENCES Performance(id),
    mileage INT REFERENCES Mileage(id),
    volume INT REFERENCES SpaceVolume(id),
    seats INT,
    wheel_base FLOAT,
    towing_capacity FLOAT,
    drivetrain drivetrain_type,
    transmission transmission_type
);

CREATE TABLE IF NOT EXISTS Cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(32) REFERENCES CarLogos(make),
    specs INT REFERENCES CarSpecs(id),
    model VARCHAR(32),
    year INT
);

CREATE TABLE IF NOT EXISTS CarBodyTypes (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES Cars(id),
    body_type VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username user_type,
    email VARCHAR(64),
    first_name VARCHAR(32),
    last_name VARCHAR(32),
    phone_number VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CarReview (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    car_id INT NOT NULL REFERENCES Cars(id),
    review_score FLOAT DEFAULT 0.0,
    review_title TEXT,
    review_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CarReplies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(id),
    review_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 1,
    replying_to_reply INT DEFAULT NULL REFERENCES CarReplies(id),
    replying_to_review INT DEFAULT NULL REFERENCES CarReview(id)
);

CREATE TABLE IF NOT EXISTS RepairGuides (
    id SERIAL PRIMARY KEY,
    car_id INT REFERENCES Cars(id) DEFAULT NULL,
    user_id INT NOT NULL REFERENCES Users(id),
    title TEXT,
    guide_description TEXT,
    markdown_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS RepairGuideGalleries (
    id SERIAL PRIMARY KEY,
    guide_id INT NOT NULL REFERENCES RepairGuides(id),
    description TEXT
);

CREATE TABLE IF NOT EXISTS CarGalleries (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES Cars(id)
);

CREATE TABLE IF NOT EXISTS Pictures (
    id SERIAL PRIMARY KEY,
    url TEXT,
    gallery_id INT DEFAULT NULL REFERENCES CarGalleries(id),
    repair_guide_id INT DEFAULT NULL REFERENCES RepairGuideGalleries(id)
);

CREATE TABLE IF NOT EXISTS CarAnalytics (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES Cars(id),
    last_serviced TIMESTAMP,
    technical_issues TEXT,
    mechanic_notes TEXT
);

CREATE TABLE IF NOT EXISTS CarCommonIssues (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES Cars(id),
    issue_title TEXT,
    issue_description TEXT,
    reported_by INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CarPriceHistories (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES Cars(id),
    price FLOAT,
    date_recorded TIMESTAMP
);