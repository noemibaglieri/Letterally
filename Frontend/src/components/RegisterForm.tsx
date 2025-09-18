import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { UserService } from "../services/user.service";
import type { User } from "../interfaces/User";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isDateInPast = (date: string) => new Date(date) < new Date();

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    const validationErrors: { [key: string]: string } = {};

    if (username.trim().length < 3 || username.trim().length > 15) {
      validationErrors.username = "Username must be between 3 and 15 characters";
    }

    if (!isEmailValid(email)) {
      validationErrors.email = "Invalid email format";
    }

    if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (!isDateInPast(dateOfBirth)) {
      validationErrors.dateOfBirth = "Date must be in the past";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const newUser: User = {
      username,
      email,
      password,
      dateOfBirth,
    };

    const userService = new UserService();
    const response = await userService.createUser(newUser);
    if (response != null) {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }, 2000);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center w-100">
      {success && <Alert variant="success">✅ Registration successful! Redirecting to login...</Alert>}
      <Form onSubmit={registerUser} noValidate>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="What should we call you?" value={username} onChange={(e) => setUsername(e.target.value)} isInvalid={!!errors.username} />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="custom-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="custom-input"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="dateOfBirth">
          <Form.Label>Date of birth</Form.Label>
          <Form.Control
            className="custom-input"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            isInvalid={!!errors.dateOfBirth}
          />
          <Form.Control.Feedback type="invalid">{errors.dateOfBirth}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check className="custom-control-label" type="checkbox" label="I agree to the Terms & Conditions" required />
        </Form.Group>

        <Button className="btn-primary w-100 mt-4" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Submit"}
        </Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
