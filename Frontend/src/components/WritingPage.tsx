// src/components/WritingPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import SideBar from "./SideBar";
import TopicComponent from "./TopicComponent";
import { EssayService } from "../services/essay.service";
import { TopicService } from "../services/topic.service";
import type { Topic } from "../interfaces/Topic";
import EssayCard from "./EssayCard";
import type { Essay } from "../interfaces/Essay";
import { useParams } from "react-router";
import { UserService } from "../services/user.service";
import type { User } from "../interfaces/User";
import { StorageService } from "../services/storage.service";

const WritingPage = () => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [essay, setEssay] = useState<Essay | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [essaysByTopicId, setEssaysByTopicId] = useState<Essay[]>([]);
  const [profile, setProfile] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [save, setSave] = useState(false);
  const essayService = useMemo(() => new EssayService(), []);
  const topicService = useMemo(() => new TopicService(), []);
  const params = useParams();
  const isEdit = !!params.essayId;

  const getEssayById = async () => {
    const response = await essayService.getById(parseInt(params.essayId!));
    if (response) {
      setEssay(response);
    } else {
      setEssay(null);
    }
  };

  const getTopicById = async () => {
    const response = await topicService.getTopicById(parseInt(params.topicId!));

    if (response) {
      setTopic(response);
    } else {
      setTopic(null);
    }
  };

  const getAllEssaysByTopicId = async () => {
    const response = await essayService.getAllByTopicId(parseInt(params.topicId!));

    if (response) {
      const currentUser = StorageService.getUser();
      const filtered = response.filter((e): e is Essay => e !== null && e.user?.id !== currentUser?.id).slice(0, 5);
      setEssaysByTopicId(filtered);
    } else {
      setEssaysByTopicId([]);
    }
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!params.essayId;

    const validationErrors: { [k: string]: string } = {};
    if (!title.trim()) validationErrors.title = "Title is required";
    if (!topic?.id) validationErrors.topic = "No active topic found";
    if (!isEdit && !imageFile) validationErrors.imageFile = "Cover image is required";
    if (!content.trim() || content.trim().length < 30) validationErrors.content = "Content must be at least 30 characters long";

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      let response: Essay | null = null;

      if (isEdit) {
        response = await essayService.update(
          {
            title,
            content,
            topicId: topic!.id!,
            ...(imageFile ? { imageFile } : {}),
          },
          parseInt(params.essayId!, 10)
        );
      } else {
        response = await essayService.create({
          title,
          content,
          topicId: topic!.id!,
          imageFile: imageFile!,
        });
      }

      if (response) {
        const profile = await new UserService().getProfile();
        if (profile) {
          setSuccess(true);
          setProfile(profile);
        }
      }
    } catch (err) {
      console.error("Error saving essay", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const essayId = params.essayId ? parseInt(params.essayId, 10) : null;
    if (!essayId) return;

    (async () => {
      const res = await essayService.getById(essayId);
      console.log("GET essay", res);
      if (res) {
        setEssay(res);
        setTitle(res.title ?? "");
        setContent(res.content ?? "");
      }
    })();
  }, [params.essayId, essayService]);

  useEffect(() => {
    getTopicById();
    getAllEssaysByTopicId();
  }, []);

  return (
    <div className="d-flex">
      <SideBar />
      <div className="let-max-height  mt-3 mb-3 rounded-3 w-100 overflow-hidden overflow-scroll">
        <Row className="mx-auto gy-4">
          <Col md={8} className="px-0">
            <div className="ps-3 mx-auto gy-4 h-100 ">
              <h5 className="text-uppercase custom-fs">{isEdit ? "Edit your essay" : "Create a new essay"}</h5>
              <div className="rounded-3 bg-white">
                <div className="p-3">
                  {success && <div className="alert alert-success mt-2">{isEdit ? "Essay updated successfully!" : "Essay created successfully!"}</div>}
                  <Form noValidate onSubmit={savePost}>
                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="essayTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          isInvalid={!!errors.title}
                          placeholder="Give your essay a title…"
                        />
                        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} className="mb-3" controlId="essayImage">
                        <Form.Label>Cover image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const f = e.target.files?.[0] ?? null;
                            setImageFile(f);
                          }}
                          isInvalid={!!errors.imageFile}
                        />
                        <Form.Control.Feedback type="invalid">{errors.imageFile}</Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Label as={Col}>Type your thoughts</Form.Label>

                      <Col className="text-end d-flex justify-content-end gap-2 mb-2">
                        <Button variant="outline-primary" className="pt-0 pb-0" size="sm" disabled={loading} onClick={() => setSave(false)}>
                          {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                          Save draft
                        </Button>
                        <Button
                          variant={isEdit ? "info" : "success"}
                          size="sm"
                          disabled={loading}
                          className="pt-0 pb-0"
                          type="submit"
                          onClick={() => setSave(true)}
                        >
                          {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                          {isEdit ? "Edit" : "Create"}
                        </Button>
                      </Col>
                    </Row>

                    <Form.Group className="editor-box flex-grow-1 min-h-0">
                      <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
                      <Form.Control
                        as="textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your essay here…"
                        className="border-0 h-100"
                        isInvalid={!!errors.content}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4} className="p-0 overflow-custom">
            <Row className="mx-auto gy-4 overflow-custom-child">
              <Col md={12} className="px-3">
                <h6 className="text-uppercase custom-fs">The topic</h6>
                <div className="rounded-3 main-bg-dark text-white">{topic ? <TopicComponent {...topic} /> : <p>Loading topic...</p>}</div>
              </Col>
              <Col md={12} className="px-3">
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
  );
};

export default WritingPage;
