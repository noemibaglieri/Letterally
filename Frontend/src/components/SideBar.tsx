import { Badge, Nav, Offcanvas, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faBookOpen, faChartSimple, faHouse, faRightFromBracket, faScrewdriverWrench, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/letterally_nav.png";
import { StorageService } from "../services/storage.service";
import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";
import type { User } from "../interfaces/User";

const SideBar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const userService = new UserService();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.roleName === "ADMIN";

  const getLoggedUser = async () => {
    const response = await userService.getProfile();
    setUser(response ?? null);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    StorageService.removeToken();
    StorageService.removeUser();
    setTimeout(() => navigate("/login"), 1500);
  };

  useEffect(() => {
    getLoggedUser();
    setShowMenu(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <div className="d-flex d-lg-none align-items-center justify-content-between main-bg-dark text-white px-3 py-2">
        <img src={logo} width={120} alt="Letterally Logo" />
        <Button variant="outline-light" size="sm" onClick={() => setShowMenu(true)} aria-label="Open menu">
          <span style={{ display: "inline-block", width: 18 }}>
            <span className="d-block mb-1" style={{ height: 2, background: "#fff" }} />
            <span className="d-block mb-1" style={{ height: 2, background: "#fff" }} />
            <span className="d-block" style={{ height: 2, background: "#fff" }} />
          </span>
        </Button>
      </div>

      <div className="d-none d-lg-flex text-white flex-column justify-content-between main-bg-dark letterally-sidebar rounded-3 p-3 m-3 me-0">
        <MenuContent locationPath={location.pathname} user={user} loggingOut={loggingOut} isAdmin={!!isAdmin} onLogout={handleLogout} showLogo />
      </div>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" className="main-bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <img src={logo} width={140} alt="Letterally Logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <MenuContent
            locationPath={location.pathname}
            user={user}
            loggingOut={loggingOut}
            isAdmin={!!isAdmin}
            onLogout={() => {
              setShowMenu(false);
              handleLogout();
            }}
            showLogo={false}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideBar;

type MenuProps = {
  locationPath: string;
  user: User | null;
  loggingOut: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  showLogo?: boolean;
};

const MenuContent = ({ locationPath, user, loggingOut, isAdmin, onLogout, showLogo = true }: MenuProps) => (
  <>
    <div>
      <div className="d-flex flex-column align-items-center gap-2 justify-content-center">
        {showLogo && <img src={logo} width={160} alt="Letterally Logo" />}
        <p className="custom-fs mb-0">Reflect. Write. Connect.</p>
      </div>

      <div className="text-uppercase mt-3">
        <hr className="secondary" />
        <h6 className="custom-fs secondary">Navigation</h6>
      </div>

      <Nav className="flex-column gap-2">
        <Nav.Item>
          <Link to="/homepage" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath === "/homepage" ? "active" : ""}`}>
            <FontAwesomeIcon icon={faHouse} /> Home
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/topics" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath === "/topics" ? "active" : ""}`}>
            <FontAwesomeIcon icon={faTableCellsLarge} /> Topics
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/essays" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath.startsWith("/essays") ? "active" : ""}`}>
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
              <Link to="/backoffice" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath === "/backoffice" ? "active" : ""}`}>
                <FontAwesomeIcon icon={faScrewdriverWrench} /> Backoffice
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/moderation" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath === "/moderation" ? "active" : ""}`}>
                <FontAwesomeIcon icon={faBan} /> Moderation
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/stats" className={`sidebar-link d-flex align-items-center gap-2 ${locationPath === "/stats" ? "active" : ""}`}>
                <FontAwesomeIcon icon={faChartSimple} /> Stats
              </Link>
            </Nav.Item>
          </Nav>
        </div>
      )}
    </div>

    <div className="d-flex flex-column gap-2">
      {loggingOut && <p className="text-white small mt-2">Logging out...</p>}
      {user ? (
        <div className="d-flex sidebar-link sidebar-link-user gap-2 align-items-center">
          <img src={user?.avatar} alt="logged in user avatar" style={{ objectFit: "cover", borderRadius: "50%", width: "40px", height: "40px" }} />
          <p className="mb-0 text-capitalize">{user?.username}</p>
          {isAdmin && (
            <Badge pill className="admin-color">
              {user?.roleName}
            </Badge>
          )}
        </div>
      ) : (
        <div className="d-flex sidebar-link sidebar-link-user gap-2 align-items-center">
          <img
            src="https://ui-avatars.com/api/?name=lu"
            alt="logged in user avatar"
            style={{ objectFit: "cover", borderRadius: "50%", width: "40px", height: "40px" }}
          />
          <p className="mb-0 text-capitalize">Logged user</p>
        </div>
      )}
      <Link to="#" onClick={onLogout} className="sidebar-link d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={faRightFromBracket} /> Logout
      </Link>
    </div>
  </>
);
