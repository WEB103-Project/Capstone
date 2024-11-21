import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setError(""); // Reset error message
    try {
      const response = await fetch("https://the-car-encyclopedia-api.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      // Handle successful login (e.g., save token, redirect)
      alert("Login successful!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Log in</h2>

      <Input
        clearable
        label="Email address"
        fullWidth
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="mb-4"
      />

      <Input
        type="password"
        clearable
        label="Password"
        fullWidth
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="mb-4"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Button color="primary" fullWidth onClick={handleSubmit} style={{ marginBottom: "1rem" }}>
        Log in
      </Button>

      <p style={{ marginTop: "1rem" }}>
        Can't log in? <a href="#">Reset Password</a>
      </p>
    </div>
  );
};

export default Login;
