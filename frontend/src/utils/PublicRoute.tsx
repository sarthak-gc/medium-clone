import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./isLoggedIn";
import { JSX } from "react";

type PublicRouteP = {
  children: JSX.Element;
};

const PublicRoute = ({ children }: PublicRouteP) => {
  if (isLoggedIn()) {
    return <Navigate to={"/welcome"} replace />;
  }

  return children;
};

export default PublicRoute;
