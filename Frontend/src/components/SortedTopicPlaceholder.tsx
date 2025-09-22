import { Card, Placeholder } from "react-bootstrap";

const SortedTopicPlaceholder = () => {
  return (
    <Card className="border-0 rounded-3 shadow-sm w-100 overflow-hidden">
      {/* HEADER */}
      <div className="d-flex align-items-center gap-3 p-3 bg-light">
        {/* IMAGE SQUARE */}
        <div className="flex-shrink-0 rounded-3 bg-secondary" style={{ width: 64, height: 64 }} />

        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            {/* TITLE */}
            <Placeholder as="h6" animation="wave" className="mb-1 w-50">
              <Placeholder xs={8} />
            </Placeholder>

            {/* STATUS BADGE */}
            <Placeholder.Button variant="secondary" size="sm" className="rounded-pill" style={{ width: 60 }} />
          </div>

          {/* CATEGORY BADGE */}
          <Placeholder animation="wave" className="mt-1 w-25">
            <Placeholder xs={6} />
          </Placeholder>
        </div>
      </div>

      {/* BODY */}
      <Card.Body className="pt-3">
        {/* DESCRIPTION */}
        <Placeholder as="p" animation="wave" className="mb-2">
          <Placeholder xs={12} />
          <Placeholder xs={10} />
          <Placeholder xs={8} />
        </Placeholder>

        {/* DATES */}
        <div className="small text-muted d-flex gap-3">
          <Placeholder animation="wave" className="w-25">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder animation="wave" className="w-25">
            <Placeholder xs={8} />
          </Placeholder>
        </div>
      </Card.Body>

      {/* FOOTER BUTTONS */}
      <div className="p-3 bg-white d-flex justify-content-end gap-2">
        <Placeholder.Button variant="warning" size="sm" style={{ width: 70 }} />
        <Placeholder.Button variant="danger" size="sm" style={{ width: 70 }} />
      </div>
    </Card>
  );
};

export default SortedTopicPlaceholder;
