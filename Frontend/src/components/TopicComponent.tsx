import { Badge } from "react-bootstrap";
import type { Topic } from "../interfaces/Topic";

const TopicComponent = (props: Topic) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <h4 className="d-inline-block mb-1">{props.title}</h4>
        <Badge bg="secondary d-flex gap-1">
          <i className={"fa " + props.category?.icon}></i>
          {props.category?.name}
        </Badge>
      </div>

      <p>{props.description}</p>
    </>
  );
};
export default TopicComponent;
