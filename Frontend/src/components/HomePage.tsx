import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { useEffect, useState } from "react";
import { TopicService } from "../services/topic.service";
import type { Topic } from "../interfaces/Topic";
import { EssayService } from "../services/essay.service";
import type { EssayResponse } from "../interfaces/Essay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // Topic state
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  // essays states:
  // own essays -
  const [items, setItems] = useState<EssayResponse[]>([]);

  // essays not voted yet -
  const [essaysToVote, setEssaysToVote] = useState<EssayResponse[]>([]);

  // best essays of the week -
  const [top3, setTop3] = useState<EssayResponse[]>([]);

  // pagination states
  const [pageMyEssays, setPageMyEssays] = useState(0);
  const [sizeMyEssays] = useState(3);
  const [totalPagesMyEssays, setTotalPagesMyEssays] = useState(0);
  const [pageEssaysToVote, setPageEssaysToVote] = useState(0);
  const [sizeEssaysToVote] = useState(3);
  const [totalPagesEssaysToVote, setTotalPagesEssaysToVote] = useState(0);

  // load, delete, modal states
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [essayToDelete, setEssayToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  const essayService = new EssayService();

  const handleDeleteClick = (id: number) => {
    setEssayToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (essayToDelete !== null) {
      const success = await essayService.delete(essayToDelete);
      if (success) {
        setItems((prev) => prev.filter((item) => item.id !== essayToDelete));
      }
      setShowDeleteModal(false);
      setEssayToDelete(null);
    }
  };

  const loadEssaysToVote = async (p = 0) => {
    setLoading(true);
    const data = await essayService.getAllYetToFeedback(p, sizeEssaysToVote);

    if (data) {
      setEssaysToVote((prev) => [...prev, ...(data.content as EssayResponse[])]);
      setTotalPagesEssaysToVote(data.totalPages || 0);
      setPageEssaysToVote(data.number || 0);
    } else {
      setEssaysToVote([]);
      setTotalPagesEssaysToVote(0);
      setPageEssaysToVote(0);
    }
    setLoading(false);
  };

  const load = async (p = 0) => {
    setLoading(true);
    const data = await essayService.getAllOwnEssays(p, sizeMyEssays);

    if (data) {
      setItems((prev) => [...prev, ...(data.content as EssayResponse[])]);
      setTotalPagesMyEssays(data.totalPages || 0);
      setPageMyEssays(data.number || 0);
    } else {
      setItems([]);
      setTotalPagesMyEssays(0);
      setPageMyEssays(0);
    }
    setLoading(false);
  };

  const loadWeeklyTop3 = async () => {
    setLoading(true);
    const data = await essayService.getTop3Weekly();

    if (data) {
      setTop3(data.filter((e): e is EssayResponse => e !== null));
    } else {
      setTop3([]);
    }
    setLoading(false);
  };

  const loadMoreMyEssays = () => {
    if (loading) return;
    if (pageMyEssays < totalPagesMyEssays - 1) {
      load(pageMyEssays + 1);
    }
  };

  const loadMoreNotVotedEssays = () => {
    if (loading) return;
    if (pageEssaysToVote < totalPagesEssaysToVote - 1) {
      // FIX: call the correct loader
      loadEssaysToVote(pageEssaysToVote + 1);
    }
  };

  useEffect(() => {
    load();
    loadEssaysToVote();
    loadWeeklyTop3();
  }, []);

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
      <div className="d-lg-flex rounded-3">
        <SideBar />
        <div className="mt-3 mb-3 w-100 overflow-custom overflow-scroll rounded-3 let-max-height">
          <Row className="mx-auto gy-4 rounded-3">
            <Col md={12}>
              <h6 className="text-uppercase custom-fs">Welcome back</h6>
              <Row className="mx-auto gap-3">{activeTopic ? <TopicComponent {...activeTopic} /> : <p>Loading user...</p>}</Row>
            </Col>

            {/* MY ESSAYS */}
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">My essays</h6>

              {items.length === 0 && !loading ? (
                <p className="text-muted fst-italic mb-0">You haven’t written any essays yet.</p>
              ) : (
                <>
                  <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2">
                    {items.map((e) => (
                      <div key={e.id} className="card shadow-sm rounded-3 border-0" style={{ minWidth: 520, maxWidth: 520 }}>
                        {e.image && (
                          <img
                            src={e.image}
                            className="card-img-top rounded-top-3"
                            alt={e.title}
                            style={{ minHeight: 220, maxHeight: 220, objectFit: "cover" }}
                          />
                        )}
                        <div className="card-body d-flex flex-column gap-2">
                          <div className="badge d-flex gap-1 align-self-start" style={{ backgroundColor: e.topic?.category?.color || "#6c757d" }}>
                            <i className={"fa-solid fa-" + e.topic?.category?.icon}></i>
                            {e.topic?.category?.name}
                          </div>
                          <h6 className="card-title mb-1">{e.title}</h6>
                          <small className="text-muted d-block mb-2">{new Date(e.createdOn!).toLocaleDateString()}</small>
                          <p className="card-text mb-3">
                            {e.content.slice(0, 120)}
                            {e.content.length > 120 ? "…" : ""}
                          </p>
                          <div className="d-flex justify-content-between flex-grow-1 align-items-end">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/essays/${e.id}`)}>
                              View
                            </button>
                            <div className="d-flex gap-2">
                              <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/edit/${e.topic?.id}/essay/${e.id}`)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </Button>
                              <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleDeleteClick(e.id!)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                              <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                                <Modal.Header closeButton>
                                  <Modal.Title>Confirm Delete</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure you want to delete this essay? This action cannot be undone.</Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {pageMyEssays < totalPagesMyEssays - 1 && (
                      <div className="d-flex align-items-center">
                        <a onClick={loadMoreMyEssays} className="btn btn-link" style={{ minWidth: 160 }}>
                          {loading ? "Loading…" : "Load more"} <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                      </div>
                    )}
                  </div>

                  {loading && items.length === 0 && (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  )}
                </>
              )}
            </Col>

            {/* READ & VOTE */}
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">Read & Vote</h6>

              {essaysToVote.length === 0 && !loading ? (
                <p className="text-muted fst-italic mb-0">You voted all the available essays! Yay! Let's wait for more...</p>
              ) : (
                <>
                  <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2">
                    {essaysToVote.map((e) => (
                      <div key={e.id} className="card shadow-sm border-0" style={{ minWidth: 520, maxWidth: 520 }}>
                        {e.image && <img src={e.image} className="card-img-top" alt={e.title} style={{ minHeight: 220, maxHeight: 220, objectFit: "cover" }} />}
                        <div className="card-body d-flex flex-column gap-2">
                          <div className="badge d-flex gap-1 align-self-start" style={{ backgroundColor: e.topic?.category?.color || "#6c757d" }}>
                            <i className={"fa-solid fa-" + e.topic?.category?.icon}></i>
                            {e.topic?.category?.name}
                          </div>
                          <h6 className="card-title mb-1">{e.title}</h6>
                          <small className="text-muted d-block mb-2">{new Date(e.createdOn!).toLocaleDateString()}</small>
                          <p className="card-text mb-3">
                            {e.content.slice(0, 120)}
                            {e.content.length > 120 ? "…" : ""}
                          </p>
                          <div className="d-flex justify-content-between flex-grow-1 align-items-end">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/essays/${e.id}`)}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {pageEssaysToVote < totalPagesEssaysToVote - 1 && (
                      <div className="d-flex align-items-center">
                        <a onClick={loadMoreNotVotedEssays} className="btn btn-link" style={{ minWidth: 160 }}>
                          {loading ? "Loading…" : "Load more"} <FontAwesomeIcon icon={faArrowRight} />
                        </a>
                      </div>
                    )}
                  </div>

                  {loading && essaysToVote.length === 0 && (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  )}
                </>
              )}
            </Col>

            {top3.length === 0 && !loading && <p className="text-muted fst-italic mb-0">No essays this week...</p>}

            {/* WEEKLY TOP 3 */}
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">Weekly top 3</h6>
              <Row className="d-flex flex-row">
                {top3.map((e, index) => {
                  const medals = ["../src/assets/first-place.png", "../src/assets/second-place.png", "../src/assets/third-place.png"];
                  const labels = ["1st place", "2nd place", "3rd place"];
                  const rankingColors = ["#F4C008", "#B0AFAF", "#EF9685"];

                  return (
                    <Col md={4} key={e.id}>
                      <div className="card shadow-sm border-0 position-relative">
                        {e.image && (
                          <div className="position-relative rounded-top-3">
                            <img
                              src={e.image}
                              className="card-img-top rounded-top-3"
                              alt={e.title}
                              style={{ minHeight: 220, maxHeight: 220, objectFit: "cover" }}
                            />
                            <div className="position-absolute top-0 start-0 w-100 h-100 rounded-3" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                              <img
                                src={medals[index]}
                                alt="medal"
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{ width: 90, height: 90 }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="card-body d-flex flex-column gap-2">
                          <div className="badge d-flex gap-1 align-self-start text-uppercase" style={{ backgroundColor: `${rankingColors[index]}` }}>
                            {labels[index]}
                          </div>
                          <h6 className="card-title mb-1">{e.title}</h6>
                          <small className="text-muted d-block mb-2">{new Date(e.createdOn!).toLocaleDateString()}</small>
                          <p className="card-text mb-3">
                            {e.content.slice(0, 120)}
                            {e.content.length > 120 ? "…" : ""}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/essays/${e.id}`)}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      {loading && items.length === 0 && (
                        <div className="text-center py-4">
                          <Spinner animation="border" />
                        </div>
                      )}
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HomePage;
