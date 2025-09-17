import { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import type { Category } from "../interfaces/Category";
import { Constants } from "../constants";
import { StorageService } from "../services/storage.service";

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6c757d");
  const [icon, setIcon] = useState("book");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const payload: Category = { name: name.trim(), color, icon };

      const res = await fetch(`${Constants.API_URL}${Constants.API_CATEGORY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageService.getToken(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create category");
      }

      await res.json();
      toast.success("Category created!");

      // reset
      setName("");
      setColor("#6c757d");
      setIcon("book");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3 p-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter category name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Color</Form.Label>
          <Form.Control type="color" value={color} onChange={(e) => setColor(e.target.value)} title="Pick a color" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Icon (FontAwesome)</Form.Label>
          <Form.Control type="text" placeholder="e.g. book, flask, brain" value={icon} onChange={(e) => setIcon(e.target.value)} />
          <Form.Text className="text-muted">
            Use the icon name without <code>fa-</code> (e.g. <code>book</code>). You can browse all available icons on the{" "}
            <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer">
              FontAwesome website
            </a>
            .
          </Form.Text>
        </Form.Group>

        {/* Preview */}
        <div className="d-flex align-items-center gap-2 mt-2 mb-3">
          <span className="small text-muted">Preview:</span>
          <span className="badge d-inline-flex align-items-center gap-2" style={{ backgroundColor: color }}>
            <i className={`fa-solid fa-${icon}`} />
            {name || "Category name"}
          </span>
        </div>

        <Button type="submit" variant="info" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Create category"}
        </Button>
      </Form>
    </Card>
  );
};

export default CategoryForm;
