import { Button, Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/letterally_landing.png";
import { useNavigate } from "react-router-dom";

const TopNavBar = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="light" data-bs-theme="light" className="shadow-sm">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand>
            <img src={logo} width={160} alt="Letterally Logo" />
          </Navbar.Brand>
          <Nav className=" d-flex align-items-center gap-3">
            <Nav.Link href="#home" onClick={() => navigate("/login")}>
              Login
            </Nav.Link>
            <Button size="sm" variant="info" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default TopNavBar;
