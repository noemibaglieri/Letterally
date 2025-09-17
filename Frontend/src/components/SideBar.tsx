import { Badge, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBookOpen, faHouse, faRightFromBracket, faScrewdriverWrench, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/letterally_nav.png";
import { StorageService } from "../services/storage.service";
import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";
import type { User } from "../interfaces/User";

const SideBar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const userService = new UserService();
  const navigate = useNavigate();

  const isAdmin = user?.roleName === "ADMIN";

  const getLoggedUser = async () => {
    const response = await userService.getProfile();

    if (response) {
      setUser(response);
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    StorageService.removeToken();
    StorageService.removeUser();

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

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
        {isAdmin && (
          <div>
            <div className="text-uppercase mt-3">
              <hr className="secondary" />
              <h6 className="custom-fs secondary">ADMIN</h6>
            </div>
            <Nav className="d-flex flex-column gap-2 mt-3">
              <Nav.Item>
                <Link to="/backoffice" className={`sidebar-link d-flex align-items-center gap-2 ${location.pathname === "/backoffice" ? "active" : ""}`}>
                  <FontAwesomeIcon icon={faScrewdriverWrench} /> Backoffice
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/moderation" className={`sidebar-link d-flex align-items-center gap-2 ${location.pathname === "/moderation" ? "active" : ""}`}>
                  <FontAwesomeIcon icon={faBan} /> Moderation
                </Link>
              </Nav.Item>
            </Nav>
          </div>
        )}
      </div>

      <div>
        {loggingOut && <p className="text-white small mt-2">Logging out...</p>}
        <div className="d-flex p-3 gap-2 align-items-center">
          <img src={user?.avatar} alt="logged in user avatar" width={30} style={{ borderRadius: "50%" }} />
          <p className="mb-0 text-capitalize">{user?.username}</p>
          <Badge pill className="admin-color">
            {user?.roleName}
          </Badge>
        </div>
        <Link to="#" onClick={() => handleLogout()} className="sidebar-link d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
