import { Col, Row, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicForm from "./TopicForm";
import CategoryForm from "./CategoryForm";
import { toast } from "react-toastify";
import { TopicService } from "../services/topic.service";
import { useEffect, useState } from "react";
import type { Topic } from "../interfaces/Topic";
import SortedTopic from "./SortedTopic";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const BackofficePage = () => {
  const [upcoming, setUpcoming] = useState<Topic[]>([]);
  const [past, setPast] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const topicService = new TopicService();
  const [modalTopic, setModalTopic] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTopics = async () => {
    try {
      const res = await topicService.getAll(0, 200, "startDate", "asc");
      const all = res?.content ?? [];
      const today = new Date();

      const upcomingList = all.filter((t) => new Date(t.startDate) > today);
      const pastList = all.filter((t) => new Date(t.endDate) < today);

      upcomingList.sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
      pastList.sort((a, b) => +new Date(b.endDate) - +new Date(a.endDate));

      setUpcoming(upcomingList);
      setPast(pastList);
    } catch {
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const askDelete = (id: number) => {
    const t = [...upcoming, ...past].find((x) => x.id === id) || null;
    setModalTopic(t);
  };

  const confirmDelete = async () => {
    if (!modalTopic?.id) return;
    setDeleting(true);
    const ok = await topicService.delete(modalTopic.id);
    setDeleting(false);
    if (ok) {
      setModalTopic(null);
      await loadTopics();
    }
  };
  useEffect(() => {
    loadTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex rounded-3">
      <SideBar />
      <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height">
        <Row className="mx-2 gx-3 gy-3 rounded-3 align-items-stretch">
          <Col md={6}>
            <h6 className="text-uppercase custom-fs">Create new topic</h6>
            <Row className="mx-auto gap-3">
              <TopicForm
                editingTopic={editingTopic}
                onSaved={() => {
                  setEditingTopic(null);
                  loadTopics();
                }}
                onCancelEdit={() => setEditingTopic(null)}
              />
            </Row>
          </Col>
          <Col md={6} className="d-flex flex-column">
            <h6 className="text-uppercase custom-fs">Create new category</h6>
            <Row className="mx-auto gap-3 h-100 w-100">
              <CategoryForm />
            </Row>
          </Col>
          <Col md={12}>
            <h6 className="text-uppercase custom-fs">
              <strong>{upcoming.length}</strong> Upcoming topics
            </h6>
            <Row className="gx-3 gy-3">
              {loading ? (
                <Spinner animation="border" />
              ) : upcoming.length === 0 ? (
                <div className="text-muted small">No upcoming topics</div>
              ) : (
                upcoming.map((t) => (
                  <Col md={6} key={t.id}>
                    <SortedTopic
                      topic={t}
                      onEdit={(id) => {
                        const topicToEdit = upcoming.find((x) => x.id === id) || past.find((x) => x.id === id);
                        if (topicToEdit) setEditingTopic(topicToEdit);
                      }}
                      onDelete={askDelete}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>

          <Col md={12}>
            <h6 className="text-uppercase custom-fs">
              {" "}
              <strong>{past.length}</strong> Past topics
            </h6>
            <Row className="gx-3 gy-3">
              {loading ? (
                <Spinner animation="border" />
              ) : past.length === 0 ? (
                <div className="text-muted small">No past topics</div>
              ) : (
                past.map((t) => (
                  <Col md={6} key={t.id}>
                    <SortedTopic
                      topic={t}
                      onEdit={(id) => {
                        const topicToEdit = upcoming.find((x) => x.id === id) || past.find((x) => x.id === id);
                        if (topicToEdit) setEditingTopic(topicToEdit);
                      }}
                      onDelete={askDelete}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </div>
      <ConfirmDeleteModal
        show={!!modalTopic}
        message={`Are you sure you want to delete the topic "${modalTopic?.title}"?\nThis will also delete all its essays.`}
        onCancel={() => setModalTopic(null)}
        onConfirm={confirmDelete}
        confirming={deleting}
      />
    </div>
  );
};

export default BackofficePage;
