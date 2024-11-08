CREATE TABLE "Cars" (
  "id" integer PRIMARY KEY,
  "model" varchar,
  "make" varchar,
  "year" integer,
  "mpg" integer,
  "hp" binary_float,
  "body_type" varchar,
  "price_estimate" float,
  "gallery_id" integer
);

CREATE TABLE "CarGalleries" (
  "id" integer PRIMARY KEY,
  "car_id" integer
);

CREATE TABLE "Pictures" (
  "id" integer PRIMARY KEY,
  "url" varchar,
  "gallery_id" integer
);

CREATE TABLE "CarSpecs" (
  "id" integer PRIMARY KEY,
  "car_id" integer,
  "horsepower" integer,
  "mpg" integer,
  "seating_capacity" integer,
  "cargo_volume" float,
  "engine_type" varchar,
  "seats" integer,
  "drivetrain" varchar
);

CREATE TABLE "CarPriceHistories" (
  "id" integer PRIMARY KEY,
  "car_id" integer,
  "price" float,
  "date_recorded" timestamp
);

CREATE TABLE "CarLogos" (
  "id" integer PRIMARY KEY,
  "logo" text,
  "make" varchar
);

CREATE TABLE "Users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "role" varchar,
  "email" varchar,
  "first_name" varchar,
  "last_name" varchar,
  "phone_number" varchar,
  "created_at" timestamp
);

CREATE TABLE "CarReview" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "car_id" integer,
  "review_score" float,
  "review_title" varchar,
  "review_comment" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "CarReplies" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "review_comment" text,
  "created_at" timestamp,
  "votes" integer,
  "updated_at" timestamp,
  "replying_to_reply" integer,
  "replying_to_review" integer
);

CREATE TABLE "CarCommonIssues" (
  "id" integer PRIMARY KEY,
  "car_id" integer,
  "issue_title" varchar,
  "issue_description" text,
  "reported_by" integer,
  "created_at" timestamp
);

CREATE TABLE "RepairGuides" (
  "id" integer PRIMARY KEY,
  "car_id" integer,
  "mechanic_id" integer,
  "title" varchar,
  "guide_description" text,
  "markdown_content" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "RepairGuideMedias" (
  "id" integer PRIMARY KEY,
  "guide_id" integer,
  "media_url" varchar,
  "media_type" varchar,
  "description" varchar
);

CREATE TABLE "CarAnalytics" (
  "id" integer PRIMARY KEY,
  "car_id" integer,
  "last_serviced" timestamp,
  "mileage" integer,
  "technical_issues" text,
  "mechanic_notes" text
);

ALTER TABLE "Cars" ADD FOREIGN KEY ("make") REFERENCES "CarLogos" ("make");

ALTER TABLE "Cars" ADD FOREIGN KEY ("gallery_id") REFERENCES "CarGalleries" ("id");

ALTER TABLE "CarGalleries" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "Pictures" ADD FOREIGN KEY ("gallery_id") REFERENCES "CarGalleries" ("id");

ALTER TABLE "CarSpecs" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "CarPriceHistories" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "CarReview" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "CarReview" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "CarReplies" ADD FOREIGN KEY ("user_id") REFERENCES "Users" ("id");

ALTER TABLE "CarReplies" ADD FOREIGN KEY ("replying_to_reply") REFERENCES "CarReplies" ("id");

ALTER TABLE "CarReplies" ADD FOREIGN KEY ("replying_to_review") REFERENCES "CarReview" ("id");

ALTER TABLE "CarCommonIssues" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "CarCommonIssues" ADD FOREIGN KEY ("reported_by") REFERENCES "Users" ("id");

ALTER TABLE "RepairGuides" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");

ALTER TABLE "RepairGuides" ADD FOREIGN KEY ("mechanic_id") REFERENCES "Users" ("id");

ALTER TABLE "RepairGuideMedias" ADD FOREIGN KEY ("guide_id") REFERENCES "RepairGuides" ("id");

ALTER TABLE "CarAnalytics" ADD FOREIGN KEY ("car_id") REFERENCES "Cars" ("id");
