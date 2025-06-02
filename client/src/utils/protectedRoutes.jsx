import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const ProtectedRoutes = () => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      toast.error("Please Login");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet/>; 
};

export default ProtectedRoutes;
