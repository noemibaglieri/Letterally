import { Button, Card } from "react-bootstrap";
import type { User } from "../interfaces/User";

const UserCard = (props: User) => {
  return (
    <>
      <div className="d-flex flex-column border-0 gap-3">
        <Card.Body className="d-flex gap-3">
          <div style={{ width: "110px" }}>
            <Card.Img className="rounded-3 w-100" variant="top" src={props.avatar} />
          </div>
          <div className="d-flex flex-column">
            <Card.Title>{props.username}</Card.Title>
            <Card.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</Card.Text>
          </div>
        </Card.Body>
        <hr className="mt-0" />
        <Card.Body>
          <Card.Text>Essays written:</Card.Text>
        </Card.Body>

        <Button variant="primary">View profile</Button>
      </div>
    </>
  );
};

export default UserCard;
