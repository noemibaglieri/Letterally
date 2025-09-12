import { useLocation } from "react-router-dom";
import type { Topic } from "../interfaces/Topic";
import Countdown from "./Countdown";

const TopicComponent = (props: Topic) => {
  const location = useLocation();

  return (
    <>
      <div className="d-flex flex-column">
        <h4 className="d-inline-block mb-1">{props.title}</h4>
        <div className="badge mt-2 d-flex gap-1 align-self-start" style={{ backgroundColor: props.category?.color || "#6c757d" }}>
          <i className={"fa-solid fa-" + props.category?.icon}></i>
          {props.category?.name}
        </div>
      </div>

      <p className="mb-0 mt-4">{props.description}</p>
      {location.pathname === "/homepage" && props.endDate && (
        <div className="mt-2 fw-bold">
          <Countdown targetDate={props.endDate} />
        </div>
      )}
    </>
  );
};
export default TopicComponent;
