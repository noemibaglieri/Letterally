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

  const deleteEssay = async (id: number) => {
    const ok = confirm("Delete this essay?");
    if (!ok) return;
    const done = await essayService.delete(id);
    if (done) loadEssays();
  };

  const deleteComment = async (id: number) => {
    const ok = confirm("Delete this comment?");
    if (!ok) return;
    const done = await feedbackService.delete(id);
    if (done) loadComments();
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
                    <Card className="shadow-sm border-0 rounded-3 p-3 h-100">
                      <h6 className="fw-bold">{e.title}</h6>
                      <small className="text-muted">
                        {e.user?.username} •{" "}
                        {e.createdOn &&
                          new Date(e.createdOn).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                      </small>
                      <p className="mt-2 clamp-3">{e.content}</p>
                      <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/essays/${e.id}`)}>
                          View
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => askDeleteEssay(e.id!, e.title)}>
                          Delete
                        </Button>
                      </div>
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
                    <Card className="shadow-sm border-0 rounded-3 p-3 h-100">
                      <h6 className="mb-1">{c.user?.username ?? "Anonymous"}</h6>
                      <small className="text-muted">
                        {c.createdOn &&
                          new Date(c.createdOn).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        {c.essay?.title ? ` • on “${c.essay.title}”` : ""}
                      </small>
                      <p className="mt-2">{c.comment ?? c.content}</p>
                      <div className="d-flex justify-content-end">
                        <Button size="sm" variant="danger" onClick={() => askDeleteComment(c.id!)}>
                          Delete
                        </Button>
                      </div>
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
