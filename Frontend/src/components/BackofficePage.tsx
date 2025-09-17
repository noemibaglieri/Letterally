import { Col, Row, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicForm from "./TopicForm";
import CategoryForm from "./CategoryForm";
import { toast } from "react-toastify";
import { TopicService } from "../services/topic.service";
import { useEffect, useState } from "react";
import type { Topic } from "../interfaces/Topic";
import SortedTopic from "./SortedTopic";
import { useNavigate } from "react-router-dom";

const BackofficePage = () => {
  const [upcoming, setUpcoming] = useState<Topic[]>([]);
  const [past, setPast] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const topicService = new TopicService();
  const navigate = useNavigate();

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

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <div className="d-flex rounded-3">
      <SideBar />
      <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height">
        <Row className="mx-2 gx-3 gy-3 rounded-3">
          <Col md={6}>
            <h6 className="text-uppercase custom-fs">Create new topic</h6>
            <Row className="mx-auto gap-3">
              <TopicForm />
            </Row>
          </Col>
          <Col md={6}>
            <h6 className="text-uppercase custom-fs">Create new category</h6>
            <Row className="mx-auto gap-3">
              <CategoryForm />
            </Row>
          </Col>
          <Col md={12}>
            <h6 className="text-uppercase custom-fs">Upcoming topics</h6>
            <Row className="gx-3 gy-3">
              {loading ? (
                <Spinner animation="border" />
              ) : upcoming.length === 0 ? (
                <div className="text-muted small">No upcoming topics</div>
              ) : (
                upcoming.map((t) => (
                  <Col md={6} key={t.id}>
                    <SortedTopic topic={t} />
                  </Col>
                ))
              )}
            </Row>
          </Col>

          <Col md={12}>
            <h6 className="text-uppercase custom-fs">Past topics</h6>
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
                      onEdit={(id) => navigate(`/backoffice/topics/${id}/edit`)}
                      onDelete={async (id) => {
                        await topicService.delete(id);
                        await loadTopics();
                      }}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BackofficePage;
