-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS Pictures;
DROP TABLE IF EXISTS CarGalleries;
DROP TABLE IF EXISTS RepairGuideGalleries;
DROP TABLE IF EXISTS RepairGuides;
DROP TABLE IF EXISTS CarReplies;
DROP TABLE IF EXISTS CarReview;
DROP TABLE IF EXISTS CarCommonIssues;
DROP TABLE IF EXISTS CarAnalytics;
DROP TABLE IF EXISTS CarPriceHistories;
DROP TABLE IF EXISTS CarSpecs;
DROP TABLE IF EXISTS SpaceVolume;
DROP TABLE IF EXISTS Performance;
DROP TABLE IF EXISTS Mileage;
DROP TABLE IF EXISTS CarBodyTypes;
DROP TABLE IF EXISTS Cars;
DROP TABLE IF EXISTS CarLogos;
DROP TABLE IF EXISTS Users;

-- Drop ENUM types if they already exist
DO $$ BEGIN
    DROP TYPE IF EXISTS transmission_type;
    DROP TYPE IF EXISTS drivetrain_type;
    DROP TYPE IF EXISTS user_type;
END $$;
