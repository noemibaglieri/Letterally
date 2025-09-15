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
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [items, setItems] = useState<EssayResponse[]>([]);
  const [essaysToVote, setEssaysToVote] = useState<EssayResponse[]>([]);
  const [page, setPage] = useState(0);
  const [top3, setTop3] = useState<EssayResponse[]>([]);
  const [size] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
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
        const filteredItems = items.filter((item) => item.id !== essayToDelete);
        setItems(filteredItems);
      }
      setShowDeleteModal(false);
      setEssayToDelete(null);
    }
  };

  const loadEssaysToVote = async (p = 0) => {
    setLoading(true);
    const data = await essayService.getAllYetToFeedback(p, size);

    if (data) {
      setEssaysToVote([...essaysToVote, ...(data.content as EssayResponse[])]);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } else {
      setEssaysToVote([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const load = async (p = 0) => {
    setLoading(true);
    const data = await essayService.getAllOwnEssays(p, size);

    if (data) {
      setItems([...items, ...(data.content as EssayResponse[])]);
      setTotalPages(data.totalPages || 0);
      setPage(data.number || 0);
    } else {
      setItems([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const loadWeeklyTop3 = async () => {
    setLoading(true);
    const data = await essayService.getTop3Weekly();

    if (data) {
      setTop3(data);
    } else {
      setTop3([]);
    }
    setLoading(false);
  };

  const loadMore = () => {
    if (loading) return;
    if (page < totalPages - 1) {
      load(page + 1);
    }
  };

  useEffect(() => {
    load(0);
    loadEssaysToVote(0);
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
      {console.log(top3)}
      <div className="d-flex">
        <SideBar />
        <div className="mt-3 mb-3 w-100 overflow-custom overflow-hidden rounded-3">
          <Row className="mx-auto gy-4">
            <Col md={12}>
              <h6 className="text-uppercase custom-fs">Welcome back</h6>
              <Row className="mx-auto gap-3">{activeTopic ? <TopicComponent {...activeTopic} /> : <p>Loading user...</p>}</Row>
            </Col>
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">My essays</h6>

              {items.length === 0 && !loading ? (
                <p className="text-muted fst-italic mb-0">You haven’t written any essays yet.</p>
              ) : (
                <>
                  {/* SCROLLER ORIZZONTALE */}
                  <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2">
                    {items.map((e) => (
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
                          <div className="d-flex justify-content-between">
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

                    {page < totalPages - 1 && (
                      <div className="d-flex align-items-center">
                        <a onClick={loadMore} style={{ minWidth: 160 }}>
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
            <Col md={12} className="px-3">
              <h6 className="text-uppercase custom-fs">Read & Vote</h6>

              {items.length === 0 && !loading ? (
                <p className="text-muted fst-italic mb-0">You voted all the available essays! Yay! Let's wait for more...</p>
              ) : (
                <>
                  {/* SCROLLER ORIZZONTALE */}
                  <div className="d-flex flex-row flex-nowrap overflow-auto gap-3 pb-2">
                    {essaysToVote.map((e) => (
                      <div key={e.id} className="card shadow-sm border-0" style={{ minWidth: 520, maxWidth: 520 }}>
                        {e.image && <img src={e.image} className="card-img-top" alt={e.title} />}
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
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/essays/${e.id}`)}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {page < totalPages - 1 && (
                      <div className="d-flex align-items-center">
                        <a onClick={loadMore} style={{ minWidth: 160 }}>
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
          </Row>
        </div>
      </div>
    </>
  );
};

export default HomePage;
