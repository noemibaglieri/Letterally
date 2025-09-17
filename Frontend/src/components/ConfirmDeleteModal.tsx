import { Modal, Button, Spinner } from "react-bootstrap";

type Props = {
  show: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirming?: boolean;
};
const ConfirmDeleteModal = ({ show, title = "Delete topic", message, onCancel, onConfirm, confirming }: Props) => {
  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-danger" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={confirming}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={confirming}>
          {confirming ? <Spinner size="sm" animation="border" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmDeleteModal;
