import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
      dateOfBirth,
    };

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center w-100">
        <Form onSubmit={registerUser}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="What should we call you?" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control className="custom-input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group as={Col} controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control className="custom-input" type="password" placeholder="°°°°°°°°°°" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="dateOfBirth">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control className="custom-input" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check className="custom-control-label" type="checkbox" label="I agree to the Terms & Conditions" required />
          </Form.Group>

          <Button className="btn-primary w-100 mt-4" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};
export default RegisterForm;
