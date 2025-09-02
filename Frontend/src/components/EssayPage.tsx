import { useEffect, useState } from "react";
import { EssayService } from "../services/essay.service";
import type { Essay } from "../interfaces/Essay";
import SideBar from "./SideBar";
import { Col, Row } from "react-bootstrap";
import UserCard from "./UserCard";
import type { User } from "../interfaces/User";
import EssayComponent from "./EssayComponent";
import TopicComponent from "./TopicComponent";
import type { Topic } from "../interfaces/Topic";
import EssayCard from "./EssayCard";
import VoteAndCommentForm from "./VoteAndCommentForm";

const EssayPage = () => {
  const [essay, setEssay] = useState<Essay | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [essaysByTopicId, setEssaysByTopicId] = useState<Essay[]>([]);
  const [essaysByUserId, setEssaysByUserId] = useState<Essay[]>([]);
  const essayService = new EssayService();

  const getById = async () => {
    const response = await essayService.getById(2);

    if (response) {
      setEssay(response);
      setUser(response.user!);
      setTopic(response.topic!);
    } else {
      setEssay(null);
    }
  };

  const getAllEssaysByTopicId = async () => {
    const response = await essayService.getAllByTopicId(1);
    if (response) {
      const filtered = response.filter((e): e is Essay => e !== null);
      setEssaysByTopicId(filtered);
    } else {
      setEssaysByTopicId([]);
    }
  };

  const getAllEssaysByUserId = async () => {
    const response = await essayService.getAllByUserId(1);
    if (response) {
      const filtered = response.filter((e): e is Essay => e !== null);
      setEssaysByUserId(filtered);
    } else {
      setEssaysByUserId([]);
    }
  };

  useEffect(() => {
    getById();
    getAllEssaysByTopicId();
    getAllEssaysByUserId();
  }, []);

  return (
    <>
      <div className="d-flex">
        <SideBar />
        <div className="mt-3 w-100">
          <Row className="mx-0 gy-4 ">
            <Col md={9} className="p-0">
              <h6 className="text-uppercase custom-fs">The essay</h6>
              <div className="rounded-3 bg-white essay-text">{essay ? <EssayComponent {...essay} /> : <p>Loading essay...</p>}</div>

              <div className="mt-2">
                <h6 className="text-uppercase custom-fs">Thoughts from readers</h6>
                {essaysByTopicId.length > 0 ? (
                  essaysByTopicId.map((essay) => (
                    <div key={essay.id} className="p-3 rounded-3 bg-white">
                      <EssayCard {...essay} />
                    </div>
                  ))
                ) : (
                  <p>Loading essays...</p>
                )}
              </div>

              <div className="mt-2">
                <h6 className="text-uppercase custom-fs">Leave a comment</h6>
                <VoteAndCommentForm />
              </div>
            </Col>

            <Col md={3} className="p-0">
              <Row className="mx-0 gy-4">
                {" "}
                <Col md={12} className="ps-3 pe-3">
                  <h6 className="text-uppercase custom-fs">The topic</h6>
                  <div className="rounded-3 main-bg-dark text-white p-3">{topic ? <TopicComponent {...topic} /> : <p>Loading topic...</p>}</div>
                </Col>
                <Col md={12} className="ps-3 pe-3">
                  <h6 className="text-uppercase custom-fs">The author</h6>
                  <div className="p-3 rounded-3 bg-white">{user ? <UserCard {...user} /> : <p>Loading user...</p>}</div>
                </Col>
                <Col md={12} className="ps-3 pe-3">
                  <h6 className="text-uppercase custom-fs">More essays by this author</h6>
                  {essaysByUserId.length > 0 ? (
                    essaysByUserId.map((essay) => (
                      <div className="p-3 rounded-3 secondary-bg mb-3 text-white">
                        <EssayCard key={essay.id} {...essay} />
                      </div>
                    ))
                  ) : (
                    <p>Loading essays...</p>
                  )}
                </Col>
                <Col md={12} className="ps-3 pe-3">
                  <h6 className="text-uppercase custom-fs">More essays on this topic</h6>
                  {essaysByTopicId.length > 0 ? (
                    essaysByTopicId.map((essay) => (
                      <div className="p-3 rounded-3 bg-white mb-3">
                        <EssayCard key={essay.id} {...essay} />
                      </div>
                    ))
                  ) : (
                    <p>Loading essays...</p>
                  )}
                </Col>
                <Col md={12} className="ps-3 pe-3">
                  <h6 className="text-uppercase custom-fs">More essays on this topic</h6>
                  {essaysByTopicId.length > 0 ? (
                    essaysByTopicId.map((essay) => (
                      <div className="p-3 rounded-3 bg-white mb-3">
                        <EssayCard key={essay.id} {...essay} />
                      </div>
                    ))
                  ) : (
                    <p>Loading essays...</p>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default EssayPage;
