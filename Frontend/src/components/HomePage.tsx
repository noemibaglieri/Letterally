import { Col, Row } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { useEffect, useState } from "react";
import { TopicService } from "../services/topic.service";
import type { Topic } from "../interfaces/Topic";
import { UserService } from "../services/user.service";

const HomePage = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  const getLoggedUser = async () => {
    const userService = new UserService();
    const response = await userService.getProfile();

    console.log(response);
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  const getActiveTopic = async () => {
    const topicService = new TopicService();
    const response = await topicService.getActiveTopic();
    console.log(response);

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
      <div className="d-flex">
        <SideBar />
        <div className="mt-3 w-100 me-3">
          <Row className="mx-0">
            <Col md={12} className="p-3">
              Welcome back!
            </Col>
            <Col className="p-3 bg-white rounded-3">
              <h3>Today's topic</h3>
              <hr />
              {activeTopic ? <TopicComponent {...activeTopic} /> : <p>Loading topic...</p>}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HomePage;
