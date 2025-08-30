import { Button, Col, Form } from "react-bootstrap";

const LoginForm = () => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center w-100">
        <Form>
          <Form.Group as={Col} className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control className="custom-input" type="email" placeholder="Enter your email" />
          </Form.Group>

          <Form.Group as={Col} className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control className="custom-input" type="password" placeholder="°°°°°°°°°°" />
          </Form.Group>

          <Button className="btn-primary w-100 mt-4" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
