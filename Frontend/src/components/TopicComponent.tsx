import { Badge } from "react-bootstrap";
import type { Topic } from "../interfaces/Topic";

const TopicComponent = (props: Topic) => {
  return (
    <>
      <div className="d-flex flex-column">
        <h4 className="d-inline-block mb-1">{props.title}</h4>
        <Badge bg="info" className="mt-2 d-flex gap-1 align-self-start">
          <i className={"fa " + props.category?.icon}></i>
          {props.category?.name}
        </Badge>
      </div>

      <p className="mb-0 mt-4">{props.description}</p>
    </>
  );
};
export default TopicComponent;
