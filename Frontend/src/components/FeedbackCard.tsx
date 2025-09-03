import { Card } from "react-bootstrap";
import type { Feedback } from "../interfaces/Feedback";

const FeedbackCard = (props: Feedback) => {
  return (
    <Card className="border-0">
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column gap-3">
          <div className="d-flex gap-3">
            <img className="rounded-3" src={props.user.avatar} alt="user avatar" />
            <div className="fs-4 ">
              <p className="mb-0 fw-semibold">{props.user.username}</p>
              <p className="text-muted text-uppercase custom-fs mb-0 ">
                {"Posted on " +
                  new Date(props.createdOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                at{" "}
                {new Date(props.createdOn).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </p>
            </div>
          </div>
          <Card.Body className="pt-0 mt-3">
            <blockquote className="blockquote mb-0 d-flex flex-column">
              <footer className="blockquote-footer">
                <cite title="Source Title">{props.content}</cite>
              </footer>
            </blockquote>
          </Card.Body>
        </div>
        <div className="d-flex flex-column vote-round p-2 justify-content-center">
          <p>
            <span className="secondary vote-value">{props.value}</span>
            <span className="custom-fs" style={{ color: "#888" }}>
              &nbsp;/ 10
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;
