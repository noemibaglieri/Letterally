import { useEffect, useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { TopicService } from "../services/topic.service";
import { toast } from "react-toastify";
import { Constants } from "../constants";
import { StorageService } from "../services/storage.service";

const topicService = new TopicService();

const TopicForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState("");
  const [categories, setCategories] = useState<[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${Constants.API_URL}${Constants.API_CATEGORY}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + StorageService.getToken(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.content || data);
      } catch (error) {
        toast.error("Could not load categories");
        return error;
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !categoryId || !imageFile) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        image: imageFile,
        categoryId,
        startDate,
      };

      const result = await topicService.create(payload);
      if (result) {
        toast.success("Topic created successfully!");
        setTitle("");
        setDescription("");
        setCategoryId(null);
        setImageFile(null);
      }
    } catch (err) {
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
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter topic title" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter topic description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start date</Form.Label>
          <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select value={categoryId ?? ""} onChange={(e) => setCategoryId(Number(e.target.value))} required>
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const f = e.target.files?.[0] ?? null;
              setImageFile(f);
            }}
            required
          />
        </Form.Group>
      </Form>
      <Button className="align-self-end" type="submit" variant="info" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Create Topic"}
      </Button>
    </Card>
  );
};

export default TopicForm;
