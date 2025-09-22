import { Card } from "react-bootstrap";
import type { Essay } from "../interfaces/Essay";
import { useNavigate } from "react-router";

const EssayCard = (essay: Essay) => {
  const navigate = useNavigate();

  return (
    <>
      <Card className="border-0" onClick={() => navigate(`/essays/${essay.id}`)}>
        <Card.Body>
          <div className="d-flex flex-column justify-content-between ">
            <p>
              <span
                className="badge rounded-pill border-0"
                style={{
                  backgroundColor: essay?.topic?.category?.color ?? "#ccc",
                  color: "#fff",
                }}
              >
                {essay?.topic?.category?.name}
              </span>
            </p>
          </div>
          <Card.Title>{essay?.title}</Card.Title>
          <Card.Text dangerouslySetInnerHTML={{ __html: essay?.content.slice(0, 120) + "..." }}></Card.Text>
          <div className="d-flex gap-3 align-items-center">
            <img className="image-max-avatar" src={essay?.user?.avatar} alt="user avatar" width={40} />
            <div className="border-start ps-3">
              <h5 className="mb-0">{essay?.user?.username}</h5>
              {essay?.createdOn && (
                <p className="custom-fs text-muted mb-0">
                  Posted on{" "}
                  {new Date(essay?.createdOn).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default EssayCard;
