import { Col, Row } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { useEffect, useState } from "react";
import { TopicService } from "../services/topic.service";
import type { Topic } from "../interfaces/Topic";
import { UserService } from "../services/user.service";
import type { User } from "../interfaces/User";

const HomePage = () => {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const getLoggedUser = async () => {
    const userService = new UserService();
    const response = await userService.getProfile();
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
        <div className="mt-3 mb-3 w-100 overflow-custom overflow-hidden rounded-3">
          <Row className="mx-auto gy-4">
            <Col md={8} className="p-0">
              <Row className="mx-auto gy-4">
                <Col md={12} className="px-3">
                  <h6 className="text-uppercase custom-fs">Welcome back</h6>
                  <div className="rounded-3 bg-white p-3">{activeTopic ? <TopicComponent {...activeTopic} /> : <p>Loading user...</p>}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HomePage;
