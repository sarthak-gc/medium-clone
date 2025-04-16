import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/isLoggedIn";
import { JSX } from "react";

type ProtectedRouteP = {
  children: JSX.Element;
};
const ProtectedRoute = ({ children }: ProtectedRouteP) => {
  if (!isLoggedIn()) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
