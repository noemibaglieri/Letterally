import { Placeholder } from "react-bootstrap";

const EssayPlaceholder = () => {
  return (
    <div className="card shadow-sm rounded-3 border-0" style={{ minWidth: 520, maxWidth: 520 }}>
      <Placeholder as="div" animation="wave">
        <Placeholder xs={12} style={{ minHeight: 220 }} className="rounded-top-3 bg-secondary" />
      </Placeholder>
      <div className="card-body d-flex flex-column gap-2">
        <Placeholder as="div" animation="wave">
          <Placeholder xs={4} className="mb-2" />
        </Placeholder>
        <Placeholder as="h6" animation="wave">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={10} /> <Placeholder xs={6} />
        </Placeholder>
        <div className="d-flex justify-content-between">
          <Placeholder.Button variant="primary" xs={3} />
          <Placeholder.Button variant="secondary" xs={2} />
        </div>
      </div>
    </div>
  );
};
export default EssayPlaceholder;
