import { Button, Card, Col } from "react-bootstrap";
import type { User } from "../interfaces/User";

const UserCard = (props: User) => {
  return (
    <>
      {console.log(props.registeredOn)}
      <div className="d-flex flex-column border-0 ">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <Col className="me-3">
            <img className="object-cover rounded-3 card-outline" src={props.avatar} />
          </Col>
          <div className="d-flex flex-column">
            <div>
              <Card.Title>{props.username}</Card.Title>
              <Card.Text className="text-muted text-uppercase custom-fs mb-2">
                {"Member since " + (props.registeredOn ? new Date(props.registeredOn).getFullYear() : "N/A")}
              </Card.Text>
            </div>
            <div className="d-flex gap-3">
              <div className="d-flex flex-column text-center align-content-center justify-content-center">
                <p className="fw-5 custom-fs mb-0 text-uppercase text-dark">essays</p>
                <Card.Text className="mb-0 fw-bold">32</Card.Text>
              </div>
              <div className="d-flex flex-column text-center align-content-center justify-content-center">
                <p className="custom-fs mb-0 text-uppercase">votes</p>
                <Card.Text className="fw-bold">8.5</Card.Text>
              </div>
              <Button variant="outline-primary">View profile</Button>
            </div>
          </div>
        </Card.Body>
      </div>
    </>
  );
};

export default UserCard;
