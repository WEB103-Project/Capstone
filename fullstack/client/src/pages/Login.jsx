import React from "react";
import { Input, Button, Divider } from "@nextui-org/react";

const Login = () => {
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Log in</h2>
      
      <Input
        clearable
        label="Email address"
        fullWidth
        type="email"
        className="mb-4"
      />

      <Input
        type="password"
        clearable
        label="Password"
        fullWidth
        className="mb-4"
      />
      <Button color="primary" fullWidth style={{ marginBottom: "1rem" }}>
        Log in
      </Button>
 
      <p size={12} style={{ marginTop: "1rem" }}>
        Can't log in? <a href="#">Reset Password</a>
      </p>
    </div>
  );
};

export default Login;
