import { Card } from "react-bootstrap";
import type { Essay } from "../interfaces/Essay";

const EssayCard = (props: Essay) => {
  return (
    <>
      <div className="d-flex flex-column rounded-3">
        <div className="border-0 rounded-3 ">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="m-0 fw-bold">{props.title}</h5>
              {props.createdOn && (
                <p className="custom-fs text-muted mb-0">
                  Posted on{" "}
                  {new Date(props.createdOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
              <p className="mb-0 fw-bold">{props.user?.username}</p>
            </div>
          </div>
          <Card.Body className=" pt-0 pb-0">
            <Card.Text>{props.content.slice(0, 100) + "..."}</Card.Text>
          </Card.Body>
        </div>
      </div>
    </>
  );
};

export default EssayCard;
