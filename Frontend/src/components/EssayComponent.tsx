import { Button, Card } from "react-bootstrap";
import type { Essay } from "../interfaces/Essay";
import { useEffect, useState } from "react";
import { StorageService } from "../services/storage.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

const EssayComponent = (props: { essay: Essay; feedbackCount: number | null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleReadMore = () => setIsExpanded((prev) => !prev);
  const currentUser = StorageService.getUser();
  const maxChars = 1400;
  const navigate = useNavigate();

  useEffect(() => {
    setIsOwner(props.essay.user?.id === currentUser?.id);
    setIsAdmin(currentUser!.roleName === "ADMIN");
    console.log(currentUser);
  }, []);

  const renderContent = () => {
    if (!props.essay.content) return null;

    if (isExpanded || props.essay.content.length <= maxChars) {
      return (
        <>
          {props.essay.content}
          {props.essay.content.length > maxChars && (
            <a onClick={toggleReadMore} className="fw-bold ms-2" style={{ cursor: "pointer" }}>
              Read less
            </a>
          )}
        </>
      );
    } else {
      return (
        <>
          {props.essay.content.slice(0, maxChars) + "..."}
          <a onClick={toggleReadMore} className="fw-bold ms-2">
            Read more
          </a>
        </>
      );
    }
  };
  return (
    <>
      <div className="d-flex flex-column rounded-3">
        <Card className="border-0 rounded-3 position-relative overflow-hidden essay-card">
          <div className="image-wrapper position-relative">
            <img
              className="essay-image rounded-3"
              src="https://images.pexels.com/photos/33602780/pexels-photo-33602780.jpeg?_gl=1*1ju8mn9*_ga*MTMxMjU0NTA5My4xNzU2NzQzMTU3*_ga_8JE65Q40S6*czE3NTY4MTU2NTYkbzQkZzEkdDE3NTY4MTYxMjEkajQ4JGwwJGgw"
            />
            <div className="overlay-title position-absolute bottom-0 start-0 p-3 ps-0">
              <div className="ps-5 d-flex justify-content-between">
                <div>
                  <div className="d-flex flex-column align-self-center">
                    {props.feedbackCount != 0 && (
                      <p className="badge rounded-3 ps-3 pe-3 bg-white align-self-start">
                        <span className="fw-bold secondary fs-1">{props.feedbackCount}</span>
                        <span className="fw-normal text-muted">&nbsp;/ 10</span>
                      </p>
                    )}
                  </div>
                  <h1 className="m-0 text-white fw-bold">{props.essay.title}</h1>
                  {props.essay.createdOn && (
                    <p className="custom-fs text-uppercase mb-0">
                      Posted on{" "}
                      {new Date(props.essay.createdOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Card.Body className="p-5 d-flex flex-column">
            {(isOwner || isAdmin) && (
              <Button
                className="align-self-end text-uppercase fw-semibold rounded-3 mb-1"
                variant="outline-primary"
                onClick={() => navigate(`/edit/${props.essay?.topic?.id}/essay/${props.essay?.id}`)}
              >
                <FontAwesomeIcon icon={faPencil} /> Edit
              </Button>
            )}
            <Card.Text>{renderContent()}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default EssayComponent;
