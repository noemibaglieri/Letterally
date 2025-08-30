import { Col, Container, Row } from "react-bootstrap";
import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
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
            <Col md={6} className="accent-bg p-5 rounded-end-4 d-flex flex-column justify-content-center align-items-center">
              <div className="text-center mb-5">
                <h1>Welcome back</h1>
                <p className="secondary-very-light">
                  New here? <Link to="/register">Create an account</Link>
                </p>
              </div>
              <LoginForm />
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default LoginPage;
