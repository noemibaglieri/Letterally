import { Col, Row, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { TopicService } from "../services/topic.service";
import { useEffect, useState } from "react";
import type { Topic } from "../interfaces/Topic";
import { toast } from "react-toastify";
import SortedTopic from "./SortedTopic";

const TopicsPage = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [upcoming, setUpcoming] = useState<Topic[]>([]);
  const [past, setPast] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const topicService = new TopicService();

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

  const getActiveTopic = async () => {
    const topicService = new TopicService();
    const response = await topicService.getActiveTopic();

    if (response) {
      setActiveTopic(response);
    } else {
      setActiveTopic(null);
    }
  };

  useEffect(() => {
    getActiveTopic();
    loadTopics();
  }, []);

  return (
    <>
      <div className="d-flex rounded-3">
        <SideBar />
        <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height">
          <Row className="mx-auto gy-4 rounded-3">
            <Col md={12}>
              <h6 className="text-uppercase custom-fs">current topic</h6>
              <Row className="mx-auto gap-3">{activeTopic ? <TopicComponent {...activeTopic} /> : <p>Loading user...</p>}</Row>
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
                      <SortedTopic topic={t} />
                    </Col>
                  ))
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default TopicsPage;
