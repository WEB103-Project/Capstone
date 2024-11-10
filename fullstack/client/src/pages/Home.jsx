import React from "react";
import { Image } from "@nextui-org/react";
import carImage from "../assets/image.jpg";

const Home = () => {
  return (
    <div style={styles.homeContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <Image
          src={carImage}
          alt="Two cars standing side by side to each other"
          objectfit="cover"
          style={styles.heroImage}
        />
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
    overflow: "hidden", // Prevent scrolling
  },
  heroSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
    position: "relative",
  },
  heroImage: {
    maxWidth: "1300px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
};

export default Home;
