import React, { useState, useEffect } from "react";
import UserMenu from "../components/DropdownProfile";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from './../app/features/authSlice';
import Breadcrumb from "./Breadcrumb";

function Header({
  sidebarOpen,
  setSidebarOpen,
  variant = "default",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
  };



  return (
    <header className={`sticky top-0 bg-white shadow-md z-10 `}>
      {" "}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16`}>
          <div className="flex items-center gap-5">
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
            {/* <h1 className="font-bold">Dashboard</h1> */}
            <Breadcrumb />
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">


            <UserMenu align="right" user={user} handleLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
