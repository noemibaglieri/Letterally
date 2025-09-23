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
  categoriesRefreshKey?: number;
};

const topicService = new TopicService();

const TopicForm = ({ editingTopic, onSaved, onCancelEdit, categoriesRefreshKey = 0 }: Props) => {
  const isEditing = !!editingTopic?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch(`${Constants.API_URL}${Constants.API_CATEGORY}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageService.getToken(),
        },
      });
      const data = await res.json();
      setCategories(data.content || data || []);
    } catch {
      toast.error("Could not load categories");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCategories();
  }, [categoriesRefreshKey]);

  useEffect(() => {
    if (editingTopic) {
      setTitle(editingTopic.title || "");
      setDescription(editingTopic.description || "");
      setStartDate(editingTopic.startDate || "");
      setCategoryId(editingTopic.category?.id ?? "");
      setImageFile(null);
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
    if (!title.trim() || !description.trim() || !categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editingTopic?.id) {
        const effectiveStartDate = startDate || editingTopic.startDate || "";

        const payload: {
          title: string;
          description: string;
          startDate: string;
          categoryId: number;
          image?: File;
        } = {
          title: title.trim(),
          description: description.trim(),
          startDate: effectiveStartDate,
          categoryId: Number(categoryId),
        };

        if (imageFile) payload.image = imageFile;

        const res = await topicService.update(payload, editingTopic.id);
        if (res) toast.success("Topic updated!");
      } else {
        if (!imageFile) {
          toast.error("Image required for new topic");
          setLoading(false);
          return;
        }
        const payload = {
          title: title.trim(),
          description: description.trim(),
          startDate,
          categoryId: Number(categoryId),
          image: imageFile,
        };
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
          <Form.Select
            value={categoryId === "" ? "" : String(categoryId)}
            onChange={(e) => {
              const val = e.target.value;
              setCategoryId(val === "" ? "" : Number(val));
            }}
            disabled={loadingCategories}
          >
            <option value="">{loadingCategories ? "Loading…" : "Select a category…"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>

          {isEditing && editingTopic?.image && !imageFile && (
            <div className="mb-2">
              <img src={editingTopic.image} alt="Current topic cover" style={{ maxWidth: 240, height: "auto", borderRadius: 8 }} />
              <div className="text-muted small mt-1">Current image</div>
            </div>
          )}

          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const f = e.target.files?.[0] ?? null;
              setImageFile(f);
            }}
          />

          {imageFile && (
            <div className="mt-2">
              <img src={URL.createObjectURL(imageFile)} alt="New topic cover preview" style={{ maxWidth: 240, height: "auto", borderRadius: 8 }} />
              <div className="text-muted small mt-1">New image (will replace current)</div>
            </div>
          )}

          {!isEditing ? (
            <Form.Text className="text-muted">Required when creating a new topic.</Form.Text>
          ) : (
            <Form.Text className="text-muted">Optional: choose a file to replace the current image.</Form.Text>
          )}
        </Form.Group>

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
