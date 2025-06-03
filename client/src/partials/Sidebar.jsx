import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../images/Logo.png";
import {
  FaArrowLeft,
  FaTachometerAlt,
  FaRss,
  FaPaw,
  FaLeaf,
  FaUsers,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../app/features/authSlice";
import { useDispatch } from "react-redux";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [activeTab, setActiveTab] = useState(pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const iconClass = "shrink-0 h-5 w-5";

  return (
    <div className="min-w-fit">
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } ${variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : " shadow-sm"
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center pr-3 sm:px-2 mb-4">
          <NavLink end to="/dashboard" className="block lg:hidden lg:sidebar-expanded:block 2xl:block">
            <img src={Logo} alt="Logo" className="w-auto h-20" />
          </NavLink>
          <NavLink end to="/dashboard" className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
          </NavLink>

          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <div>
            <ul className="mt-3">
              {/* Dashboard */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 mt-2 px-3 py-2 rounded-md transition group ${isActive || activeTab === "/dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaTachometerAlt title="Dashboard" className={`${iconClass} ${(activeTab === "/dashboard" || location.pathname === "/dashboard") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Dashboard
                </span>
              </NavLink>

              {/* Add Feed */}
              <NavLink
                to="/feeds"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/feeds"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaRss title="Feed" className={`${iconClass} ${(activeTab === "/feeds" || location.pathname === "/feeds") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Feed
                </span>
              </NavLink>

              {/* Animals */}
              <NavLink
                to="/animals"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/animals"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaPaw title="Animals" className={`${iconClass} ${(activeTab === "/animals" || location.pathname === "/animals") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Animals
                </span>
              </NavLink>

              {/* Meditation */}
              <NavLink
                to="/meditation"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/meditation"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaLeaf title="Meditation" className={`${iconClass} ${(activeTab === "/meditation" || location.pathname === "/meditation") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Meditation
                </span>
              </NavLink>

              {/* add flock */}
              <NavLink
                to="/flock"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/flock"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaUsers title="Add Flock" className={`${iconClass} ${(activeTab === "/flock" || location.pathname === "/flock") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Add Flock
                </span>
              </NavLink>

              {/* Feed Stock */}
              <NavLink
                to="/feed-stock"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/feed-stock"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaBoxOpen title="Add Feed Stock" className={`${iconClass} ${(activeTab === "/feed-stock" || location.pathname === "/feed-stock") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Add Feed Stock
                </span>
              </NavLink>

              {/* Expenses */}
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/reports"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaFileInvoiceDollar title="Expense" className={`${iconClass} ${(activeTab === "/reports" || location.pathname === "/reports") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Expense
                </span>
              </NavLink>

              {/* Profile */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 mt-2 py-2 rounded-md transition group ${isActive || activeTab === "/profile"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FaUserCircle title="My Profile" className={`${iconClass} ${(activeTab === "/profile" || location.pathname === "/profile") ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  My Profile
                </span>
              </NavLink>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 mt-2 px-3 py-2 rounded-md transition group text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                <FaSignOutAlt title="Logout" className={`${iconClass} text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300`} />
                <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Logout
                </span>
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;