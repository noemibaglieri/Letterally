import { Navigate, Outlet, useLocation } from "react-router-dom";
import { StorageService } from "../services/storage.service";
import Forbidden from "../components/Forbidden";

type Props = {
  allowedRoles?: string[];
  requiredAuth?: boolean;
};

const ProtectedRoute = ({ allowedRoles = [], requiredAuth = false }: Props) => {
  const location = useLocation();

  const token = StorageService.getToken();
  const user = StorageService.getUser();
  const isAuthenticated = !!token;
  const roleName = user?.roleName as string | undefined;

  if (requiredAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.length) return <Outlet />;

  const isAllowed = !!roleName && (allowedRoles.includes(roleName) || (roleName === "ADMIN" && allowedRoles.includes("USER")));

  if (!isAllowed) {
    return <Forbidden />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
