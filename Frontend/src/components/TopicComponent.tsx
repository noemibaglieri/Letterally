import { useLocation, useNavigate } from "react-router-dom";
import type { Topic } from "../interfaces/Topic";
import Countdown from "./Countdown";
import { Button, Card, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { EssayService } from "../services/essay.service";

const TopicComponent = (props: Topic) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasWritten, setHasWritten] = useState<boolean | null>(null);
  const essayService = new EssayService();
  const [myEssayId, setMyEssayId] = useState<number | null | undefined>(undefined);
  const onHomepage = location.pathname.endsWith("/homepage");
  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setHasWritten(null);
      setMyEssayId(null);

      if (onHomepage && props.id) {
        const exists = await essayService.hasWrittenForTopic(Number(props.id));
        if (!isMounted) return;

        setHasWritten(exists);

        if (exists) {
          const id = await essayService.getMyEssayIdForTopic(Number(props.id));
          if (!isMounted) return;
          setMyEssayId(id);
        }
      } else {
        setHasWritten(null);
        setMyEssayId(null);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHomepage, props.id]);

  return (
    <>
      <Col className="d-flex flex-column bg-white rounded-3 p-0">
        <Card className="bg-dark text-white rounded-3 overflow-hidden">
          <Card.Img src={props.image} alt="topic image" style={{ height: "15.3rem", objectFit: "cover" }} />
          <Card.ImgOverlay className="d-flex flex-column justify-content-start" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Card.Title className="fw-bold">{props.title}</Card.Title>
            <div className="badge mt-2 d-flex gap-1 align-self-start" style={{ backgroundColor: props.category?.color || "#6c757d" }}>
              <i className={"fa-solid fa-" + props.category?.icon}></i>
              {props.category?.name}
            </div>
            <Card.Text className="mt-3 clamp-2 flex-grow-1">{props.description}</Card.Text>
            {onHomepage && hasWritten === false ? (
              <Button className="align-self-end fw-semibold text-white text-uppercase" variant="warning" onClick={() => navigate(`/create/${props.id}/essay`)}>
                Write your essay
              </Button>
            ) : hasWritten ? (
              <Button className="align-self-end fw-semibold text-white text-uppercase" variant="warning" onClick={() => navigate(`/essays/${myEssayId}`)}>
                View your essay
              </Button>
            ) : null}
          </Card.ImgOverlay>
        </Card>
      </Col>
      {location.pathname === "/homepage" && props.endDate && (
        <Col className=" position-relative secondary-bg p-3 d-flex flex-column gap-3 text-center justify-content-center aligh-items-center rounded-3 text-white">
          <div className="bg-pattern"></div>
          <div className="mt-2 fw-bold d-flex justify-content-center align-items-center">
            <Countdown targetDate={props.endDate} />
          </div>
          <h5 className="mb-0 fw-semibold">Until next topic!</h5>
        </Col>
      )}
    </>
  );
};
export default TopicComponent;
