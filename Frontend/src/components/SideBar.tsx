import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faHouse, faRightFromBracket, faTableCellsLarge, faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/letterally_nav.png";

const SideBar = () => {
  return (
    <div className="text-white d-flex flex-column justify-content-between main-bg-dark letterally-sidebar rounded-3 p-3 m-3">
      <div>
        <div className="d-flex flex-column align-items-center gap-2 justify-content-center">
          <img src={logo} width={160} alt="Letterally Logo" />
          <p className="custom-fs mb-0">Write. Read. Belong.</p>
        </div>
        <div className="text-uppercase mt-3">
          <hr className="secondary" />
          <h6 className="custom-fs secondary">Navigation</h6>
        </div>
        <Nav className="flex-column gap-2">
          <Nav.Item>
            <Link to="/" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faHouse} /> Home
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/prompts" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faTableCellsLarge} /> Topics
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/submit" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} /> Essays
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/profile" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
          </Nav.Item>
        </Nav>
      </div>

      <div>
        <Link to="/logout" className="sidebar-link d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
