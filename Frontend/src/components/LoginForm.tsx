import { useState } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { UserService } from "../services/user.service";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    const validationErrors: { [key: string]: string } = {};

    if (!isEmailValid(email)) {
      validationErrors.email = "Invalid email format";
    }

    if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const userService = new UserService();
    const response = await userService.signIn(email, password);
    if (response != null) {
      const profile = await userService.getProfile();
      if (profile != null) {
        setTimeout(() => {
          setSuccess(true);
          setLoading(false);

          setTimeout(() => {
            navigate("/homepage");
          }, 1000);
        }, 2000);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center w-100">
        {success && <Alert variant="success">✅ Login successful!</Alert>}
        <Form onSubmit={login} noValidate>
          <Form.Group as={Col} className="mb-3" controlId="email">
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

          <Form.Group as={Col} className="mb-3" controlId="password">
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

          <Button className="btn-primary w-100 mt-4" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
