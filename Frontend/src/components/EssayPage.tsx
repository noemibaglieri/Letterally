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
import { StorageService } from "../services/storage.service";

const EssayPage = () => {
  const [essay, setEssay] = useState<Essay | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [essaysByTopicId, setEssaysByTopicId] = useState<Essay[]>([]);
  const [essaysByUserId, setEssaysByUserId] = useState<Essay[]>([]);
  const [avgVotes, setAvgVotes] = useState<number | null>(null);
  const [essayAvgVotes, setEssayAvgVotes] = useState<number | null>(null);
  const [essayCount, setEssayCount] = useState<number | null>(null);

  const params = useParams();

  const currentUser = StorageService.getUser();
  let isOwner: boolean | null = false;

  const essayService = new EssayService();
  const feedbackService = new FeedbackService();

  const getById = async () => {
    const response = await essayService.getById(parseInt(params.id!));
    if (response) {
      setEssay(response);
      setUser(response.user!);
      setTopic(response.topic!);
      setFeedback(response.votes!);
      isOwner = currentUser && currentUser.id === response?.user?.id;
    } else {
      setEssay(null);
    }
  };

  const getAllEssaysByTopicId = async () => {
    const response = await essayService.getAllByTopicId(essay!.topic!.id!);
    if (response) {
      const filtered = response.filter((e): e is Essay => e !== null && e.user?.id !== essay?.user?.id);
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
    if (response) setAvgVotes(response!);
  };

  const getOverallAvgEssayVotes = async () => {
    const response = await feedbackService.getAvgByEssay(essay!.id!);
    if (response || response === 0) setEssayAvgVotes(response!);
  };

  const countAllEssaysByUser = async () => {
    const response = await essayService.countAllEssaysByUser(essay!.user!.id!);
    if (response) setEssayCount(response!);
  };

  const addFeedback = (newFeedback: Feedback) => setFeedback([...feedback, newFeedback]);

  useEffect(() => {
    getById();
  }, [params]);

  useEffect(() => {
    if (essay === null) return;
    getAllEssaysByTopicId();
    getAllEssaysByUserId();
    getOverallAvgVotes();
    getOverallAvgEssayVotes();
    countAllEssaysByUser();
  }, [essay, feedback]);

  return (
    <>
      <div className="d-flex flex-column flex-lg-row">
        <SideBar />

        <div className="mt-3 mb-3 w-100 overflow-custom let-max-height overflow-scroll verflow-hidden rounded-3">
          <Row className="mx-auto gy-4 px-2 px-md-0">
            <Col xs={12} md={3} className="p-0 order-2 order-md-1">
              <Row className="mx-auto gy-4">
                <Col xs={12} className="px-3 ">
                  <h6 className="text-uppercase custom-fs ">The author</h6>
                  <div className="rounded-3 bg-white">
                    {user ? <UserCard {...{ user: user, feedbackCount: avgVotes, essayCount: essayCount }} /> : <p>Loading user...</p>}
                  </div>
                </Col>

                <Col xs={12} className="px-3">
                  <h6 className="text-uppercase custom-fs">More essays by this author</h6>
                  {essaysByUserId.length > 0 ? (
                    essaysByUserId.map((essay) => (
                      <div key={essay.id} className={`rounded-3 last-child secondary-bg text-white ${essay.id === Number(params.id) ? "active-essay" : ""}`}>
                        {essay ? <EssayCard {...essay} /> : <p className="fst-italic">This author hasn't written any more essays, yet</p>}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 rounded-3 last-child secondary-bg text-white">
                      <p className="fst-italic">This author hasn't written any more essays, yet</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={6} className="p-0 order-1 order-md-2">
              <Row className="mx-auto gy-4 overflow-custom-child">
                <Col xs={12} className="px-0">
                  <h6 className="text-uppercase custom-fs">The essay</h6>
                  <div className="rounded-3 bg-white essay-text">
                    {essay ? <EssayComponent {...{ essay: essay, feedbackCount: essayAvgVotes, isOwner: isOwner }} /> : <p>Loading essay...</p>}
                  </div>
                </Col>

                <Col xs={12} className="px-0">
                  <div>
                    <h6 className="text-uppercase custom-fs">Thoughts from readers</h6>
                    {feedback.length > 0 ? (
                      feedback.map((f) => (
                        <div key={f.id} className="rounded-3 last-child bg-white p-3">
                          <FeedbackCard {...f} onDeleted={(id) => setFeedback((prev) => prev.filter((x) => x.id !== id))} />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3 last-child bg-white p-3">
                        <p className="text-muted fst-italic">No comments yet. Be the first to leave one!</p>
                      </div>
                    )}
                  </div>
                </Col>

                <Col xs={12} className="p-0">
                  <div>
                    <h6 className="text-uppercase custom-fs">Leave a comment</h6>
                    <FeedbackForm
                      {...{
                        essayId: essay?.id,
                        onPost(feedback) {
                          addFeedback(feedback);
                        },
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Col>

            <Col xs={12} md={3} className="p-0 overflow-custom order-3">
              <Row className="mx-auto gy-4 overflow-custom-child">
                <Col xs={12} className="px-3">
                  <h6 className="text-uppercase custom-fs">The topic</h6>
                  <div className="rounded-3 main-bg-dark text-white">{topic ? <TopicComponent {...topic} /> : <p>Loading topic...</p>}</div>
                </Col>

                <Col xs={12} className="px-3">
                  <h6 className="text-uppercase custom-fs">More essays on this topic</h6>
                  {essaysByTopicId.length > 0 ? (
                    essaysByTopicId.map((essay) => (
                      <div key={essay.id} className="rounded-3 bg-white last-child">
                        {essay ? <EssayCard {...essay} /> : <p className="text-muted fst-italic">There aren't any more essays on this topic, yet.</p>}
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
