import { Card } from "react-bootstrap";
import type { Essay } from "../interfaces/Essay";
import { useState } from "react";

const EssayComponent = (props: Essay) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded((prev) => !prev);
  const maxChars = 1400;

  const renderContent = () => {
    if (!props.content) return null;

    if (isExpanded || props.content.length <= maxChars) {
      return (
        <>
          {props.content}
          {props.content.length > maxChars && (
            <a onClick={toggleReadMore} className="fw-bold ms-2" style={{ cursor: "pointer" }}>
              Read less
            </a>
          )}
        </>
      );
    } else {
      return (
        <>
          {props.content.slice(0, maxChars) + "..."}
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
              <div className="ps-5">
                <h1 className="m-0 text-white fw-bold">{props.title}</h1>
                {props.createdOn && (
                  <p className="custom-fs text-uppercase mb-0">
                    Posted on{" "}
                    {new Date(props.createdOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Card.Body className="p-5">
            <Card.Text>{renderContent()}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default EssayComponent;
