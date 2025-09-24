import { Card, Col, Row } from "react-bootstrap";
import type { User } from "../interfaces/User";

const UserCard = (props: { user: User; feedbackCount: number | null; essayCount: number | null }) => {
  return (
    <Card className="rounded-3 border-0 profile-card position-relative overflow-hidden">
      <div className="profile-header position-relative">
        <div className="text-white fw-semibold px-3 py-2">Profile</div>

        <img
          src={props.user.avatar}
          alt="user avatar"
          className="profile-avatar rounded-circle border border-4 border-white position-absolute start-50 translate-middle-x"
        />
      </div>
      <Card.Body className="pt-5 text-center profile-body">
        <Row className="text-muted small mb-2">
          <Col className="text-start">
            <div>Essays</div>
            <div className="fs-5 text-dark fw-semibold">{props.essayCount}</div>
          </Col>
          <Col className="text-end">
            <div>Avg votes</div>
            <div className="fs-5 text-dark fw-semibold">{props.feedbackCount ? props.feedbackCount?.toFixed(1) : "N/A"}</div>
          </Col>
        </Row>

        <div className="fs-4 fw-semibold">{props.user.username}</div>
        <div className="text-muted custom-fs text-uppercase">
          {"member since " + (props.user.registeredOn ? new Date(props.user.registeredOn).getFullYear() : "N/A")}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
