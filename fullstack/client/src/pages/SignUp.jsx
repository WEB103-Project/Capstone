import React, { useState } from "react";
import { Input, Button, Progress } from "@nextui-org/react";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    setError(""); // Reset error message
    try {
      const response = await fetch("https://the-car-encyclopedia-api.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Handle successful account creation (e.g., redirect to login)
      alert("Account created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Create an Account</h2>
      <Progress value={(step / 3) * 100} style={{ marginBottom: "1rem" }} />

      {step === 1 && (
        <>
          <Input
            clearable
            label="Username"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mb-4"
          />
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
          <Button color="primary" fullWidth onClick={handleNext}>
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Input
            clearable
            label="First Name"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            clearable
            label="Last Name"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mb-4"
          />
          <Input
            clearable
            label="Phone Number"
            fullWidth
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mb-4"
          />
          <Button bordered onClick={handleBack} style={{ marginRight: "1rem" }}>
            Back
          </Button>
          <Button color="primary" onClick={handleNext}>
            Next
          </Button>
        </>
      )}

      {step === 3 && (
        <>
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
          {!isValidPassword(formData.password) && (
            <p className="text-red-500 mb-4">
              Password must be at least 8 characters, include a number, a special character, and a letter.
            </p>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button bordered onClick={handleBack} style={{ marginRight: "1rem" }}>
            Back
          </Button>
          <Button
            color="primary"
            disabled={!isValidPassword(formData.password)}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default Signup;
