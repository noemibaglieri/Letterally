import { useEffect, useState } from "react";
import { Col, Row, Card, Button, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import { EssayService } from "../services/essay.service";
import { FeedbackService } from "../services/feedback.service";
import type { EssayResponse } from "../interfaces/Essay";
import type { Feedback } from "../interfaces/Feedback";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const essayService = new EssayService();
const feedbackService = new FeedbackService();

const ModerationPage = () => {
  const [essays, setEssays] = useState<EssayResponse[]>([]);
  const [comments, setComments] = useState<Feedback[]>([]);
  const [loadingEssays, setLoadingEssays] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const navigate = useNavigate();
  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("Delete");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [confirming, setConfirming] = useState(false);

  type DeleteTarget = { type: "essay" | "comment"; id: number } | null;
  const [target, setTarget] = useState<DeleteTarget>(null);

  const askDeleteEssay = (id: number, title?: string) => {
    setTarget({ type: "essay", id });
    setModalTitle("Delete essay");
    setModalMessage(`Are you sure you want to delete this essay${title ? ` “${title}”` : ""}? This action cannot be undone.`);
    setModalOpen(true);
  };

  const askDeleteComment = (id: number) => {
    setTarget({ type: "comment", id });
    setModalTitle("Delete comment");
    setModalMessage("Are you sure you want to delete this comment? This action cannot be undone.");
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!target) return;
    setConfirming(true);
    try {
      let ok = false;
      if (target.type === "essay") ok = await essayService.delete(target.id);
      else ok = await feedbackService.delete(target.id);

      if (ok) {
        if (target.type === "essay") await loadEssays();
        else await loadComments();
        setModalOpen(false);
        setTarget(null);
      }
    } finally {
      setConfirming(false);
    }
  };

  const loadEssays = async () => {
    try {
      setLoadingEssays(true);
      const page = await essayService.getAll(0, 200);
      setEssays(page?.content ?? []);
    } catch {
      toast.error("Failed to load essays");
    } finally {
      setLoadingEssays(false);
    }
  };

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const page = await feedbackService.getAll(0, 200);
      setComments(page?.content ?? []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadEssays();
    loadComments();
  }, []);

  return (
    <div className="d-flex rounded-3">
      <SideBar />
      <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height">
        <Row className="mx-2 g-3">
          {/* Essays */}
          <Col md={12}>
            <h6 className="text-uppercase custom-fs">
              <strong>{essays.length}</strong> essays to check (newest first)
            </h6>
            {loadingEssays ? (
              <Spinner animation="border" />
            ) : essays.length === 0 ? (
              <div className="text-muted small">No essays available</div>
            ) : (
              <Row className="g-3">
                {essays.map((e) => (
                  <Col md={6} key={e.id}>
                    <Card className="border-0 rounded-3 shadow-sm h-100 overflow-hidden">
                      {/* Image preview */}
                      {e.image ? (
                        <div
                          style={{
                            height: "160px",
                            backgroundImage: `url(${e.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center bg-light text-muted" style={{ height: "160px" }}>
                          <i className="fa-solid fa-image fa-2x" />
                        </div>
                      )}

                      {/* Header */}
                      <Card.Header className="bg-white border-0">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={e.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.user?.username || "Anon")}`}
                            alt="avatar"
                            className="rounded-circle"
                            width={36}
                            height={36}
                          />
                          <div>
                            <div className="fw-semibold">{e.user?.username ?? "Anonymous"}</div>
                            <small className="text-muted">
                              {e.createdOn &&
                                new Date(e.createdOn).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                            </small>
                          </div>
                        </div>
                      </Card.Header>

                      {/* Body */}
                      <Card.Body>
                        <h6 className="fw-bold mb-2">{e.title}</h6>
                        <p
                          className="mb-0 text-body"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          dangerouslySetInnerHTML={{ __html: e.content }}
                        ></p>
                      </Card.Body>

                      {/* Footer */}
                      <Card.Footer className="bg-white border-0 d-flex justify-content-end gap-2 p-3">
                        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/essays/${e.id}`)}>
                          View
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => askDeleteEssay(e.id!, e.title)}>
                          Delete
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>

          {/* Comments */}
          <Col md={12} className="mt-3">
            <h6 className="text-uppercase custom-fs">
              <strong>{comments.length}</strong> comments to check (newest first)
            </h6>
            {loadingComments ? (
              <Spinner animation="border" />
            ) : comments.length === 0 ? (
              <div className="text-muted small">No comments available</div>
            ) : (
              <Row className="g-3">
                {comments.map((c) => (
                  <Col md={6} key={c.id}>
                    <Card className="border-0 rounded-3 shadow-sm h-100">
                      {/* Header */}
                      <Card.Header className="bg-white border-0 pb-0">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={c.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.username || "Anon")}`}
                              alt="avatar"
                              className="rounded-circle"
                              width={36}
                              height={36}
                            />
                            <div>
                              <div className="fw-semibold">{c.user?.username ?? "Anonymous"}</div>
                              <small className="text-muted">
                                {c.createdOn
                                  ? new Date(c.createdOn).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : ""}
                              </small>
                            </div>
                          </div>

                          {typeof c.value === "number" && <span className="badge rounded-pill bg-dark-subtle text-dark-emphasis">★ {c.value}</span>}
                        </div>
                      </Card.Header>

                      {/* Body */}
                      <Card.Body>
                        {/* Essay context */}
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="text-truncate me-2">
                            <small className="text-muted">on</small>{" "}
                            <span className="fw-semibold text-truncate" title={c.essay?.title || ""}>
                              {c.essay?.title ?? "—"}
                            </span>
                            {c.essay?.id && <small className="text-muted ms-2">(# {c.essay.id})</small>}
                          </div>
                        </div>

                        {/* Comment text */}
                        <p className="mb-0 text-body" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {c.content}
                        </p>
                      </Card.Body>

                      {/* Footer */}
                      <Card.Footer className="bg-white border-0 d-flex justify-content-end gap-2 pt-0 pb-3 px-3">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => c.essay?.id && navigate(`/essays/${c.essay.id}`)}
                          disabled={!c.essay?.id}
                          title={c.essay?.id ? "Open the related essay" : "Essay not available"}
                        >
                          View essay
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => askDeleteComment(c.id!)}>
                          Delete
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
      <ConfirmDeleteModal
        show={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => {
          if (confirming) return;
          setModalOpen(false);
          setTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        confirming={confirming}
      />
    </div>
  );
};

export default ModerationPage;
