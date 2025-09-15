import { useLocation, useNavigate } from "react-router-dom";
import type { Topic } from "../interfaces/Topic";
import Countdown from "./Countdown";
import { Button, Card, Col } from "react-bootstrap";

const TopicComponent = (props: Topic) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Col className="d-flex flex-column bg-white rounded-3 p-0">
        <Card className="bg-dark text-white rounded-3">
          <Card.Img src={props.image} alt="topic image" style={{ height: "11.3rem", objectFit: "cover" }} />
          <Card.ImgOverlay className="d-flex flex-column justify-content-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Card.Title className="fw-bold">{props.title}</Card.Title>
            <div className="badge mt-2 d-flex gap-1 align-self-start" style={{ backgroundColor: props.category?.color || "#6c757d" }}>
              <i className={"fa-solid fa-" + props.category?.icon}></i>
              {props.category?.name}
            </div>
            <Card.Text className="mt-3">{props.description}</Card.Text>
            <Button className="align-self-end" variant="warning" onClick={() => navigate(`/create/${props.id}/essay`)}>
              Write your essay
            </Button>
          </Card.ImgOverlay>
        </Card>
      </Col>

      <Col className="secondary-bg p-3 rounded-3 text-white">
        <h4>Until next topic</h4>
        {location.pathname === "/homepage" && props.endDate && (
          <div className="mt-2 fw-bold">
            <Countdown targetDate={props.endDate} />
          </div>
        )}
      </Col>
    </>
  );
};
export default TopicComponent;
