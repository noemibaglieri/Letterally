// ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { StorageService } from "../services/storage.service";
import Forbidden from "../components/Forbidden";

const ProtectedRoute = (props: { allowedRoles: string[]; requiredAuth: boolean }) => {
  const location = useLocation();

  const token = StorageService.getToken();
  const user = StorageService.getUser();
  const isAuthenticated = !!token;
  const roleName = user?.roleName;

  if (props.requiredAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (props.allowedRoles && props.allowedRoles.length > 0) {
    if (!roleName || !props.allowedRoles.includes("USER")) {
      return <Forbidden />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
