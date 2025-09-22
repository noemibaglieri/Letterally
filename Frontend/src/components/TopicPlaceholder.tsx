import { Col, Card, Placeholder } from "react-bootstrap";
import CountdownPlaceholder from "./CountdownPlaceholder";

const TopicPlaceholder = () => {
  return (
    <>
      <Col className="d-flex flex-column bg-white rounded-3 p-0">
        <Card className="bg-dark text-white rounded-3 overflow-hidden">
          {/* immagine */}
          <Placeholder as={Card.Img} animation="wave" style={{ height: "15.3rem" }} />

          <Card.ImgOverlay className="d-flex flex-column justify-content-start" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            {/* titolo */}
            <Placeholder as="h5" animation="wave" className="fw-bold mb-2">
              <Placeholder xs={6} />
            </Placeholder>

            {/* badge */}
            <Placeholder.Button variant="secondary" xs={3} className="rounded-pill mb-3" />

            {/* descrizione */}
            <Placeholder as="p" animation="wave" className="flex-grow-1">
              <Placeholder xs={10} /> <Placeholder xs={8} /> <Placeholder xs={6} />
            </Placeholder>

            {/* bottone */}
            <Placeholder.Button variant="warning" xs={5} className="align-self-end text-uppercase fw-semibold" />
          </Card.ImgOverlay>
        </Card>
      </Col>

      {/* countdown placeholder */}
      <Col className="position-relative secondary-bg p-3 d-flex flex-column gap-3 text-center justify-content-center align-items-center rounded-3 text-white">
        <CountdownPlaceholder />
      </Col>
    </>
  );
};

export default TopicPlaceholder;
