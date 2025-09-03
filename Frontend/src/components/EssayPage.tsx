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
import { useParams } from "react-router";
import type { Feedback } from "../interfaces/Feedback";
import FeedbackCard from "./FeedbackCard";
import FeedbackForm from "./FeedbackForm";
import { FeedbackService } from "../services/feedback.service";

const EssayPage = () => {
  const [essay, setEssay] = useState<Essay | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [essaysByTopicId, setEssaysByTopicId] = useState<Essay[]>([]);
  const [essaysByUserId, setEssaysByUserId] = useState<Essay[]>([]);
  const [avgVotes, setAvgVotes] = useState<number | null>(null);
  const [essayCount, setEssayCount] = useState<number | null>(null);

  // const [comment, setComment] = useState("");
  //const [vote, setVote] = useState<number | "">("");
  const params = useParams();

  const essayService = new EssayService();
  const feedbackService = new FeedbackService();

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted comment:", comment);
    console.log("Submitted vote:", vote);
    setComment("");
    setVote("");
  };
*/
  const getById = async () => {
    const response = await essayService.getById(parseInt(params.id!));

    if (response) {
      setEssay(response);
      setUser(response.user!);
      setTopic(response.topic!);
      setFeedback(response.votes!);
      console.log(response.votes);
    } else {
      setEssay(null);
    }
  };

  const getAllEssaysByTopicId = async () => {
    const response = await essayService.getAllByTopicId(essay!.topic!.id!);
    if (response) {
      const filtered = response.filter((e): e is Essay => e !== null);
      setEssaysByTopicId(filtered);
    } else {
      setEssaysByTopicId([]);
    }
  };

  const getAllEssaysByUserId = async () => {
    const response = await essayService.getAllByUserId(essay!.user!.id!);
    if (response) {
      const filtered = response.filter((e): e is Essay => e !== null);
      setEssaysByUserId(filtered);
    } else {
      setEssaysByUserId([]);
    }
  };

  const getOverallAvgVotes = async () => {
    const response = await feedbackService.getAvgByAuthor(essay!.user!.id!);

    if (response) {
      setAvgVotes(response!);
    }
  };

  const countAllEssaysByUser = async () => {
    const response = await essayService.countAllEssaysByUser(essay!.user!.id!);

    if (response) {
      setEssayCount(response!);
    }
  };

  // const getEssayAvgVotes;

  useEffect(() => {
    getById();
  }, []);

  useEffect(() => {
    if (essay === null) return;
    getAllEssaysByTopicId();
    getAllEssaysByUserId();
    getOverallAvgVotes();
    countAllEssaysByUser();
  }, [essay]);

  return (
    <>
      <div className="d-flex">
        <SideBar />
        <div className="mt-3 mb-3 w-100">
          <Row className="mx-0 gy-4">
            <Col md={3} className="p-0">
              <Row className="mx-3 gy-4">
                <Col md={12} className="p-0">
                  <h6 className="text-uppercase custom-fs">The author</h6>
                  <div className="rounded-3 bg-white">
                    {user ? <UserCard {...{ user: user, feedbackCount: avgVotes, essayCount: essayCount }} /> : <p>Loading user...</p>}
                  </div>
                </Col>
                <Col md={12} className="p-0">
                  <h6 className="text-uppercase custom-fs">More essays by this author</h6>
                  {essaysByUserId.length > 0 ? (
                    essaysByUserId.map((essay) => (
                      <div key={essay.id} className="p-3 rounded-3 last-child secondary-bg text-white">
                        <EssayCard {...essay} />
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-3 last-child secondary-bg text-white">
                      <p className="fst-italic">This author hasn't written any more essays, yet</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
            <Col md={6} className="p-0">
              <Row className="mx-0 gy-4">
                <Col md={12} className="p-0">
                  <h6 className="text-uppercase custom-fs">The essay</h6>
                  <div className="rounded-3 bg-white essay-text">{essay ? <EssayComponent {...essay} /> : <p>Loading essay...</p>}</div>
                </Col>
                <Col md={12} className="p-0">
                  <div>
                    <h6 className="text-uppercase custom-fs">Thoughts from readers</h6>
                    {feedback.length > 0 ? (
                      feedback.map((feedback) => (
                        <div key={feedback.id} className="rounded-3 last-child bg-white p-3">
                          <FeedbackCard {...feedback} />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3 last-child bg-white p-3">
                        <p className="text-muted fst-italic">No comments yet. Be the first to leave one!</p>
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="p-0">
                  <div>
                    <h6 className="text-uppercase custom-fs">Leave a comment</h6>
                    <FeedbackForm />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={3} className="p-0">
              <Row className="mx-3 gy-4">
                <Col md={12} className="p-0">
                  <h6 className="text-uppercase custom-fs">The topic</h6>
                  <div className="rounded-3 main-bg-dark text-white p-3">{topic ? <TopicComponent {...topic} /> : <p>Loading topic...</p>}</div>
                </Col>
                <Col md={12} className="p-0">
                  <h6 className="text-uppercase custom-fs">More essays on this topic</h6>
                  {essaysByTopicId.length > 0 ? (
                    essaysByTopicId.map((essay) => (
                      <div key={essay.id} className="p-3 rounded-3 bg-white last-child">
                        <EssayCard {...essay} />
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3 last-child bg-white p-3">
                      <p className="text-muted fst-italic">There aren't any more essays on this topic, yet.</p>
                    </div>
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
