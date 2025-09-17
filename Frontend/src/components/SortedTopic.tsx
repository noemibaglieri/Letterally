import { Card, Button, Badge } from "react-bootstrap";
import type { Topic } from "../interfaces/Topic";

type Props = {
  topic: Topic;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

function getStatus(topic: Topic) {
  const now = new Date();
  const s = topic.startDate ? new Date(topic.startDate) : null;
  const e = topic.endDate ? new Date(topic.endDate) : null;

  if (s && s > now) return { label: "Upcoming", variant: "info" as const };
  if (e && e < now) return { label: "Past", variant: "secondary" as const };
}

const SortedTopic = ({ topic, onEdit, onDelete }: Props) => {
  const status = getStatus(topic);
  const id = topic.id ?? 0;

  return (
    <Card className="border-0 rounded-3 shadow-sm w-100 overflow-hidden">
      <div className="d-flex align-items-center gap-3 p-3 bg-light">
        {topic.image ? (
          <div
            className="flex-shrink-0 rounded-3"
            style={{
              width: 64,
              height: 64,
              backgroundImage: `url(${topic.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3 bg-dark text-white" style={{ width: 64, height: 64 }}>
            <i className="fa-solid fa-image" />
          </div>
        )}

        <div className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-1">{topic.title}</h6>
            <Badge bg={status?.variant} className="rounded-pill">
              {status?.label}
            </Badge>
          </div>

          {/* Categoria pill */}
          {topic.category && (
            <span
              className="badge mt-1 d-inline-flex align-items-center gap-1"
              style={{ backgroundColor: topic.category.color || "#6c757d" }}
              title={topic.category.name}
            >
              <i className={`fa-solid fa-${topic.category.icon}`} />
              {topic.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Corpo: descrizione + date */}
      <Card.Body className="pt-3">
        <p className="mb-2 text-muted" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {topic.description}
        </p>
        <div className="small text-muted d-flex gap-3">
          {topic.startDate && <span>Start: {new Date(topic.startDate).toLocaleDateString()}</span>}
          {topic.endDate && <span>End: {new Date(topic.endDate).toLocaleDateString()}</span>}
        </div>
      </Card.Body>

      {/* Footer: azioni */}
      <Card.Footer className="bg-white d-flex justify-content-end gap-2">
        <Button size="sm" variant="warning" onClick={() => id && onEdit?.(id)}>
          <i className="fa-solid fa-pen-to-square me-1" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => {
            if (!id) return;
            const ok = window.confirm(`Delete topic "${topic.title}"?`);
            if (ok) onDelete?.(id);
          }}
        >
          <i className="fa-solid fa-trash me-1" />
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default SortedTopic;
