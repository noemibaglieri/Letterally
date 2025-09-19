import { Col, Row } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { TopicService } from "../services/topic.service";
import { useEffect, useState } from "react";
import type { Topic } from "../interfaces/Topic";

const TopicsPage = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

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
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">My essays</h6>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default TopicsPage;
