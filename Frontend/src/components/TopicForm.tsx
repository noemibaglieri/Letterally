import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import type { Topic } from "../interfaces/Topic";
import type { Category } from "../interfaces/Category";
import { Constants } from "../constants";
import { StorageService } from "../services/storage.service";
import { TopicService } from "../services/topic.service";

type Props = {
  editingTopic?: Topic | null;
  onSaved?: () => void;
  onCancelEdit?: () => void;
};

const topicService = new TopicService();

const TopicForm = ({ editingTopic, onSaved, onCancelEdit }: Props) => {
  const isEditing = !!editingTopic?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${Constants.API_URL}${Constants.API_CATEGORY}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + StorageService.getToken(),
          },
        });
        const data = await res.json();
        setCategories(data.content || data);
      } catch {
        toast.error("Could not load categories");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (editingTopic) {
      setTitle(editingTopic.title || "");
      setDescription(editingTopic.description || "");
      setStartDate(editingTopic.startDate || "");
      setCategoryId(editingTopic.category?.id ?? "");
    } else {
      setTitle("");
      setDescription("");
      setStartDate("");
      setCategoryId("");
      setImageFile(null);
    }
  }, [editingTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editingTopic?.id) {
        const payload = { title, description, startDate, categoryId };
        const res = await topicService.update(payload, editingTopic.id);
        if (res) toast.success("Topic updated!");
      } else {
        if (!imageFile) {
          toast.error("Image required for new topic");
          return;
        }
        const payload = { title, description, startDate, categoryId, image: imageFile };
        const res = await topicService.create(payload);
        if (res) toast.success("Topic created!");
      }
      onSaved?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3 p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter topic title" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start date</Form.Label>
          <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
            <option value="">Select a category...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {!isEditing && (
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] ?? null;
                setImageFile(f);
              }}
            />
          </Form.Group>
        )}

        <div className="d-flex justify-content-between">
          {isEditing && (
            <Button variant="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button className="fw-bold text-uppercase text-white" type="submit" variant={isEditing ? "warning" : "info"} disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : isEditing ? "Update Topic" : "Create Topic"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default TopicForm;
