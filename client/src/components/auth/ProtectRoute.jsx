import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  if (!user) return <Navigate to={redirect} />; //If user not found it will navigate to the redirect route

  return children ? children : <Outlet />;
};

export default ProtectRoute;