import type { Essay } from "../interfaces/Essay";

const EssayComponent = (props: Essay) => {
  return (
    <>
      <div className="d-flex flex-column">
        <h4 className="mb-1">{props.title}</h4>
        <p>{props.content}</p>
      </div>
    </>
  );
};

export default EssayComponent;
