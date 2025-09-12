import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import TopNavBar from "./TopNavBar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FooterComponent from "./FooterComponent";
import type { Essay } from "../interfaces/Essay";
import type { User } from "../interfaces/User";
import { EssayService } from "../services/essay.service";
import type { Category } from "../interfaces/Category";
import { CategoryService } from "../services/category.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const [essay, setEssay] = useState<Essay | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const essayService = new EssayService();
  const categoryService = new CategoryService();
  const navigate = useNavigate();

  const getExampleEssay = async () => {
    const response = await essayService.getLatestByCategoryId(1);

    if (response) {
      setEssay(response);
      setUser(response.user!);
    } else {
      setEssay(null);
    }
  };

  const getAllCategories = async () => {
    const response = await categoryService.getAll();
    console.log(response);
    const filtered = response.filter((c): c is Category => c !== null);
    if (response) {
      setCategories(filtered);
    }
  };

  const handleCategoryClick = async (categoryId: number) => {
    if (selectedCategory?.id === categoryId) {
      return;
    }
    setSelectedCategory(categories.find((c) => c.id === categoryId) || null);
    const response = await essayService.getLatestByCategoryId(categoryId);
    if (response) {
      setEssay(response);
      setUser(response.user!);
    } else {
      setEssay(null);
    }
  };

  useEffect(() => {
    //const user = StorageService.getUser();
    /* if (user) {
      navigate("/homepage");
    } else {
      navigate("/login");
    }*/
    getAllCategories();
    getExampleEssay();
  }, []);

  return (
    <>
      <TopNavBar />
      <Container fluid>
        <Container className="bg-white p-5 pe-0 rounded-3 mt-3 position-relative shadow-sm">
          <Row>
            <Col md={7} className="d-flex flex-column gap-3">
              <div>
                <h4 className="text-muted custom-fs text-uppercase">A space for writers and readers</h4>
                <h1>Reflect, write, connect.</h1>
                <h4>One prompt per week</h4>
              </div>

              <Button variant="info" className="align-self-start fs-3 ps-4 pe-4 fw-bold" onClick={() => navigate("/register")}>
                Start Writing <FontAwesomeIcon className="ms-2" icon={faArrowRight} />
              </Button>
              <hr />
              <p className="mb-0 fst-italic">
                Each week we propose a theme designed to spark thought and invite you to slow down, write with intention, and discover new perspectives - both
                your own and those of others.
              </p>
            </Col>
          </Row>
          <div className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ width: "38vw", maxWidth: 420, aspectRatio: "1 / 1" }}>
            <DotLottieReact
              src="https://lottie.host/0285a3a5-8553-4352-85bf-d1e296728a2b/j6VMPGKMmF.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Container>
        <Container className="p-0 rounded-3 mt-3">
          <Row className="gx-3">
            <h4 className="text-muted text-uppercase custom-fs">How does it work?</h4>
            <Col>
              <Card className="border-0 shadow-sm rounded-3 d-flex  align-content-center min-height-card">
                <div className="d-flex secondary-light-bg justify-content-center gap-3 p-3 rounded-top-3 text-white">
                  <img src="../src/assets/card1.png" alt="book icon" width={40} />
                  <h6 className="mb-0 align-self-center">Discover this week's topic</h6>
                </div>
                <Card.Body className="d-flex flex-column align-content-center justify-content-center text-center p-0">
                  <div className="p-3">
                    <Card.Text>
                      Each week we introduce a prompt designed to make you pause and reflect - a question, an idea, a theme that helps you look at life from a
                      new angle.
                    </Card.Text>
                    <div className="d-flex gap-3 fw-semibold justify-content-center">
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Weekly topic</div>
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Fresh idea</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="border-0 shadow-sm rounded-3 d-flex align-content-center min-height-card">
                <div className="d-flex secondary-bg justify-content-center gap-3 p-3 rounded-top-3 text-white">
                  <img src="../src/assets/card2.png" alt="book icon" width={40} />
                  <h6 className="mb-0 align-self-center">Write your essay</h6>
                </div>
                <Card.Body className="d-flex flex-column align-content-center justify-content-center text-center p-0">
                  <div className="p-3">
                    <Card.Text>
                      Take your time to put thoughts into words. Writing here isn’t about speed - it’s about slowing down, gaining clarity, and sharing your
                      perspective with intention.
                    </Card.Text>
                    <div className="d-flex gap-3 fw-semibold justify-content-center">
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Your voice</div>
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Creative space</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="border-0 shadow-sm rounded-3 d-flex  align-content-center min-height-card">
                <div className="d-flex tertiary-bg justify-content-center gap-3 p-3 rounded-top-3 text-white">
                  <img src="../src/assets/card3.png" alt="book icon" width={40} />
                  <h6 className="mb-0 align-self-center">Read and connect</h6>
                </div>
                <Card.Body className="d-flex flex-column align-content-center justify-content-center text-center p-0">
                  <div className="p-3">
                    <Card.Text>
                      Reading is not the end, but the beginning of connection. Discover essays, connect with ideas, and cast your vote to support writers who
                      move you, challenge you, or open new perspectives
                    </Card.Text>
                    <div className="d-flex gap-3 fw-semibold justify-content-center">
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Discover</div>
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Connect</div>
                      <div className="border border-1 rounded-2 custom-fs text-uppercase secondary ps-2 pe-2 ">Vote</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container className="p-0 rounded-3 mt-3">
          <h4 className="text-muted text-uppercase custom-fs">From the community</h4>

          <Tab.Container id="community-tabs" defaultActiveKey="0">
            <Row className="mx-0 g-3">
              <Col sm={4} className="ps-0">
                <div className=" shadow-sm custom-tabs rounded-3 bg-white p-3 card-max-example-essay">
                  <div className="mb-3 badge rounded-pill main-bg-dark">Categories</div>
                  <Nav variant="pills" className="flex-column">
                    {categories &&
                      categories.slice(0, 4).map((category, index) => {
                        return (
                          <Nav.Item>
                            <Nav.Link eventKey={index} onClick={() => handleCategoryClick(category.id)}>
                              {category?.name}
                            </Nav.Link>
                          </Nav.Item>
                        );
                      })}
                    <Nav.Item>
                      <Nav.Link eventKey="4" disabled className="text-uppercase custom-fs text-muted">
                        ...and more!
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>

              <Col sm={8} className="pe-0">
                <div className="p-3 bg-white d-flex flex-column rounded-3 shadow-sm card-max-example-essay justify-content-between">
                  <div className="mb-3 badge rounded-pill main-bg-dark align-self-start">Essay</div>
                  <Tab.Content className="flex-grow-1">
                    <Tab.Pane eventKey="0">
                      <div className="d-flex flex-column">
                        <h6 className="text-uppercase">{essay?.title}</h6>
                        <p className="custom-fs">
                          <span className="text-muted">Posted by </span> <span className="secondary fw-bold text-capitalize">{user?.username}</span>
                          <span className="text-muted"> on </span>{" "}
                          <span className="fw-semibold">
                            {essay?.createdOn &&
                              new Date(essay.createdOn).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                          </span>
                        </p>
                        <p>
                          {essay?.content.slice(0, 200)} <span className="text-muted custom-fs">(...)</span>
                        </p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="1">
                      <div className="d-flex gap-3">
                        <div>
                          <h6 className="text-uppercase">{essay?.title}</h6>
                          <p className="custom-fs">
                            <span className="text-muted">Posted by </span> <span className="secondary fw-bold text-capitalize">{user?.username}</span>
                            <span className="text-muted"> on </span>{" "}
                            <span className="fw-semibold">
                              {essay?.createdOn &&
                                new Date(essay.createdOn).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                            </span>
                          </p>
                          <p>
                            {essay?.content.slice(0, 200)} <span className="text-muted custom-fs">(...)</span>
                          </p>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="2">
                      <div className="d-flex gap-3">
                        <div>
                          <h6 className="text-uppercase">{essay?.title}</h6>
                          <p className="custom-fs">
                            <span className="text-muted">Posted by </span> <span className="secondary fw-bold text-capitalize">{user?.username}</span>
                            <span className="text-muted"> on </span>{" "}
                            <span className="fw-semibold">
                              {essay?.createdOn &&
                                new Date(essay.createdOn).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                            </span>
                          </p>
                          <p>
                            {essay?.content.slice(0, 200)} <span className="text-muted custom-fs">(...)</span>
                          </p>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="3">
                      {" "}
                      <div className="d-flex gap-3">
                        <div>
                          <h6 className="text-uppercase">{essay?.title}</h6>
                          <p className="custom-fs">
                            <span className="text-muted">Posted by </span> <span className="secondary fw-bold text-capitalize">{user?.username}</span>
                            <span className="text-muted"> on </span>{" "}
                            <span className="fw-semibold">
                              {essay?.createdOn &&
                                new Date(essay.createdOn).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                            </span>
                          </p>
                          <p>
                            {essay?.content.slice(0, 200)} <span className="text-muted custom-fs">(...)</span>
                          </p>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                  <div className="d-flex gap-2 align-self-end">
                    <Button variant="info" size="sm" className="text-capitalize">
                      Register
                    </Button>
                    <span> to read more!</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
        <Container className="p-0 rounded-3 mt-3">
          <h4 className="text-muted text-uppercase custom-fs">Stats</h4>
          <Row className="main-bg-dark mx-0 rounded-3 text-white p-5 text-center">
            <Col>
              <div className="p-5 border-end">
                <h1>200+</h1>
                <h2>
                  essays <br />
                  published
                </h2>
              </div>
            </Col>
            <Col>
              <div className="p-5 border-end">
                <h1>10+</h1>
                <h2>weekly topics explored</h2>
              </div>
            </Col>
            <Col>
              <div className="p-5">
                <h1>450+</h1>
                <h2>
                  writers & <br />
                  readers
                </h2>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="text-center pt-5">
          <h3 className="text-wavy">Ready to start writing?</h3>
        </Container>
      </Container>
      <FooterComponent />
    </>
  );
};

export default LandingPage;
