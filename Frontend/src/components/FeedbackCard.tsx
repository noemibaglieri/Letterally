import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Feedback } from "../interfaces/Feedback";
import { StorageService } from "../services/storage.service";
import { FeedbackService } from "../services/feedback.service";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Props = Feedback & {
  onDeleted?: (id: number) => void;
};

const FeedbackCard = (props: Props) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const currentUser = StorageService.getUser();
  const feedbackService = new FeedbackService();

  useEffect(() => {
    setIsOwner(props.user.id === currentUser?.id);
    setIsAdmin(currentUser?.roleName === "ADMIN");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const askDelete = () => setShowConfirm(true);

  const confirmDelete = async () => {
    if (!props.id) return;
    setConfirming(true);
    const ok = await feedbackService.delete(props.id);
    setConfirming(false);
    setShowConfirm(false);
    if (ok) props.onDeleted?.(props.id);
  };

  return (
    <>
      <Card className="border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex gap-3">
              <img className="image-max-avatar" src={props.user.avatar} alt="user avatar" />
              <div className="fs-4">
                <p className="mb-0 fw-semibold">{props.user.username}</p>
                <p className="text-muted text-uppercase custom-fs mb-0">
                  {"Posted on " +
                    new Date(props.createdOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                  at{" "}
                  {new Date(props.createdOn).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <Card.Body className="pt-0 mt-3">
              <blockquote className="blockquote mb-0 d-flex flex-column">
                <footer className="blockquote-footer">
                  <cite title="Feedback">{props.content}</cite>
                </footer>
              </blockquote>
            </Card.Body>
          </div>

          <div className="d-flex flex-column vote-round p-2 justify-content-center align-items-end">
            {(isOwner || isAdmin) && (
              <Button
                className="align-self-end text-uppercase fw-semibold rounded-3 mb-1"
                variant="danger"
                onClick={askDelete}
                disabled={confirming}
                aria-label="Delete feedback"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
            <p className="mb-0 text-end">
              <span className="secondary vote-value">{props.value}</span>
              <span className="custom-fs" style={{ color: "#888" }}>
                &nbsp;/ 10
              </span>
            </p>
          </div>
        </div>
      </Card>

      <ConfirmDeleteModal
        show={showConfirm}
        title="Delete feedback"
        message={`Are you sure you want to delete this feedback?\nThis action cannot be undone.`}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        confirming={confirming}
      />
    </>
  );
};

export default FeedbackCard;
