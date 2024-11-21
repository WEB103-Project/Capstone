import React, { useState } from 'react';
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
            <p size={12} color="error" style={{ marginBottom: "1rem" }}>
              Password must be at least 8 characters long, include a number, a special character, and a letter.
            </p>
          )}
          <Button bordered onClick={handleBack} style={{ marginRight: "1rem" }}>
            Back
          </Button>
          <Button
            color="primary"
            disabled={!isValidPassword(formData.password)}
            onClick={() => alert("Account Created!")}
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default Signup;
