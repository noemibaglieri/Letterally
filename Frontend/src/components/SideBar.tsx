import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faHouse, faRightFromBracket, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/letterally_nav.png";
import { StorageService } from "../services/storage.service";
import { useState } from "react";

const SideBar = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggingOut(true);
    StorageService.removeToken();
    StorageService.removeUser();

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="text-white d-flex flex-column justify-content-between main-bg-dark letterally-sidebar rounded-3 p-3 m-3 me-0">
      <div>
        <div className="d-flex flex-column align-items-center gap-2 justify-content-center">
          <img src={logo} width={160} alt="Letterally Logo" />
          <p className="custom-fs mb-0">Reflect. Write. Connect.</p>
        </div>
        <div className="text-uppercase mt-3">
          <hr className="secondary" />
          <h6 className="custom-fs secondary">Navigation</h6>
        </div>
        <Nav className="flex-column gap-2">
          <Nav.Item>
            <Link to="/homepage" className={`sidebar-link d-flex align-items-center gap-2 ${location.pathname === "/homepage" ? "active" : ""}`}>
              <FontAwesomeIcon icon={faHouse} /> Home
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/topics" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faTableCellsLarge} /> Topics
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/essays" className="sidebar-link d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} /> Essays
            </Link>
          </Nav.Item>
        </Nav>
      </div>

      <div>
        {loggingOut && <p className="text-white small mt-2">Logging out...</p>}
        <Link to="#" onClick={() => handleLogout()} className="sidebar-link d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
