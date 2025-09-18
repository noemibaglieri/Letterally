import { Col, Container, Row } from "react-bootstrap";
import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 custom-bg">
      <Container className="rounded-4 shadow overflow-hidden">
        <Row>
          <Col md={6} className="secondary-bg p-3 rounded-start-4 text-white">
            <img src="../src/assets/letterally.png" alt="letterally logo" width={200} />
            <div className="d-flex flex-column justify-content-center align-items-center text-center">
              <img src="../src/assets/typing.gif" alt="man typing" width={500} />
              <h2>Write. Read. Belong.</h2>
              <p className="pb-2">
                One prompt. One week. A place where words become reflections. <br /> Share your thoughts. Discover how others feel. Writing that connects us
                all.
              </p>
            </div>
          </Col>
          <Col md={6} className="bg-white p-5 rounded-end-4 d-flex flex-column justify-content-center align-items-center">
            <div className="text-center mb-5">
              <img src="../src/assets/pen_icon.png" alt="pen icon" width={80} />
              <h1 className="mt-4">Create an account</h1>
              <p className="secondary-very-light">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <RegisterForm />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default RegisterPage;
