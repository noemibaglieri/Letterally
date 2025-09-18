import { Col, Container, Row } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <>
      <footer className="neg-margin position-relative">
        <div className="w-100 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#8880A9"
              fillOpacity="1"
              d="M0,256L40,234.7C80,213,160,171,240,165.3C320,160,400,192,480,218.7C560,245,640,267,720,277.3C800,288,880,288,960,272C1040,256,1120,224,1200,197.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="secondary-bg text-white py-4">
          <Container>
            <Row>
              <Col md={6}>
                <h5>Letterally</h5>
                <p className="mb-0">Write. Reflect. Connect.</p>
              </Col>
              <Col md={6} className="text-md-end mt-3 mt-md-0">
                <p className="mb-0">&copy; {new Date().getFullYear()} Letterally. All rights reserved.</p>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </>
  );
};

export default FooterComponent;
