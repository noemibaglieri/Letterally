import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const VoteAndCommentForm = () => {
  const [comment, setComment] = useState("");
  const [vote, setVote] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement your POST logic here
    console.log("Submitted comment:", comment);
    console.log("Submitted vote:", vote);
    setComment("");
    setVote("");
  };

  return (
    <div className="bg-white p-4 rounded-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Your vote (1 to 10)</Form.Label>
          <Form.Control type="number" min={1} max={10} value={vote} onChange={(e) => setVote(Number(e.target.value))} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Your comment</Form.Label>
          <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} required />
        </Form.Group>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default VoteAndCommentForm;
