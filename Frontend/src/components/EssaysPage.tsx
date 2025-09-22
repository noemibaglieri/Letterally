import { Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EssaysPageUnderConstruction = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height align-content-center">
        <Row className="m-auto gy-4 rounded-3 align-items-center align-content-center justify-content-center">
          <Col md={6} className="m-auto p-3 rounded-3 d-flex flex-column align-items-center">
            <div className="secondary-bg mb-5">
              <img src="../src/assets/letterally-not-found.png" alt="letterally logo" width={200} />
            </div>
            <h3 className="fw-semibold mt-3">Currently under heavy development by very tiny coding gnomes.</h3>
            <img src="../src/assets/work-in-progress.gif" alt="Working on it" />
            <Button
              variant="info"
              className="fw-bold"
              onClick={() => {
                navigate("/homepage");
              }}
            >
              Go back
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EssaysPageUnderConstruction;
