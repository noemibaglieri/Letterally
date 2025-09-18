import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { FeedbackService } from "../services/feedback.service";
import type { Feedback } from "../interfaces/Feedback";

type Props = {
  essayId: number | undefined;
  onPost: (feedback: Feedback) => void;
};

const FeedbackForm = ({ essayId, onPost }: Props) => {
  const [value, setValue] = useState<number | "">("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const sendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const validationErrors: { [k: string]: string } = {};

    if (essayId == null) {
      validationErrors.form = "Missing essay id.";
    }

    const num = typeof value === "string" ? Number(value) : value;
    if (value === "" || isNaN(num)) {
      validationErrors.value = "Vote is required";
    } else if (num < 1 || num > 10) {
      validationErrors.value = "Vote must be between 1 and 10";
    }

    if (!content.trim()) {
      validationErrors.content = "Comment is required";
    } else if (content.trim().length < 3) {
      validationErrors.content = "Comment is too short";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const service = new FeedbackService();
      const res = await service.postFeedback(essayId!, num, content.trim());
      if (res != null) {
        setSuccess(true);
        setContent("");
        setValue("");
        onPost(res);
      }
    } catch {
      setErrors({ form: "Failed to send feedback. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-3">
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Thanks! Your feedback was sent.
        </Alert>
      )}
      {errors.form && (
        <Alert variant="danger" dismissible onClose={() => setErrors((e) => ({ ...e, form: "" }))}>
          {errors.form}
        </Alert>
      )}

      <Form onSubmit={sendFeedback} noValidate>
        <Form.Group className="mb-3" controlId="vote">
          <Form.Label>Your vote (1 to 10)</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={10}
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              // allow empty to clear field; otherwise store a number
              setValue(v === "" ? "" : Number(v));
            }}
            isInvalid={!!errors.value}
            disabled={loading || essayId == null}
            required
          />
          <Form.Control.Feedback type="invalid">{errors.value}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="comment">
          <Form.Label>Your comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            isInvalid={!!errors.content}
            disabled={loading || essayId == null}
            required
          />
          <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading || essayId == null}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" /> Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default FeedbackForm;
