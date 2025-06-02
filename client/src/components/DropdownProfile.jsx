import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import UserAvatar from "../images/user-avatar-32.png";
import { useDispatch, useSelector } from "react-redux";


function DropdownProfile({ align, user, handleLogout }) {

  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);


  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={UserAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {user?.username ? user.username.slice(0, 5) : ""}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdown}
           className={`absolute top-full right-0 mt-5 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden transition-all duration-200 ${
          dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ position: "absolute", zIndex: 50 }}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {user?.username}
            </div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <NavLink to="/profile">Profile Setting</NavLink>
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <button onClick={handleLogout}>Logout</button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownProfile;
