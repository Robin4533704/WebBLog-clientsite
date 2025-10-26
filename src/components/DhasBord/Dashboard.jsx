import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaClipboardList,
  FaBlog,
  FaUserEdit,
  FaChartBar,
  FaChevronDown,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useUserRole from "./useUserRole";
import Loading from "../../pages/Loading";

const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  if (roleLoading) return <Loading />;

  const linkClass = (isActive) =>
    `px-4 py-2 rounded-md flex items-center justify-between transition-colors duration-200 ${
      isActive
        ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg"
        : "text-gray-800 dark:text-gray-200 hover:bg-amber-300 hover:text-white"
    }`;

  const subLinkClass = (isActive) =>
    `px-8 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${
      isActive
        ? "bg-amber-500 text-white shadow-md"
        : "text-gray-700 dark:text-gray-200 hover:bg-amber-400 hover:text-white"
    }`;

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />

      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Navbar (mobile) */}
        <div className="w-full navbar bg-amber-300 dark:bg-amber-500 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <div className="ml-2 text-lg font-semibold flex-1 text-gray-800 dark:text-white">
            Dashboard
          </div>
        </div>

        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-6 w-64 min-h-full bg-gradient-to-b from-sky-400 to-lime-500 text-white">
          {/* Logo */}
          <MotionLink
            to="/"
            className="flex items-center gap-3 mb-10 text-2xl font-bold text-white hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
          >
            <FaBlog className="text-yellow-400 text-3xl" />
            <span>
              Blog<span className="text-yellow-400">Hub</span>
            </span>
          </MotionLink>

          {/* Common: Update Profile */}
          <li>
            <MotionNavLink
              to="/dashboard/profile"
              className={({ isActive }) => linkClass(isActive)}
              whileHover={{ scale: 1.03 }}
            >
              <FaUserEdit /> Update Profile
            </MotionNavLink>
          </li>

          {/* USER MENU */}
          {role === "user" && (
            <>
              <p
                className="mt-6 mb-2 font-semibold text-gray-200 uppercase text-sm cursor-pointer flex items-center justify-between"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                My Blogs{" "}
                <FaChevronDown
                  className={`transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </p>
              {userMenuOpen && (
                <ul className="mb-2">
                  <li>
                    <MotionNavLink
                      to="/dashboard/myblogs"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaBlog /> My Blogs
                    </MotionNavLink>
                  </li>
                  <li>
                    <MotionNavLink
                      to="/dashboard/addblog"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      ➕ Add Blog
                    </MotionNavLink>
                  </li>
                  <li>
                    <MotionNavLink
                      to="/dashboard/userprofile"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaUserEdit /> Profile
                    </MotionNavLink>
                  </li>
                </ul>
              )}
            </>
          )}

          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              <p
                className="mt-6 mb-2 font-semibold text-gray-200 uppercase text-sm cursor-pointer flex items-center justify-between"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                Admin Panel{" "}
                <FaChevronDown
                  className={`transition-transform ${
                    adminMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </p>
              {adminMenuOpen && (
                <ul className="mb-2">
                  {/* ✅ Only admin sees Overview */}
                  <li>
                    <MotionNavLink
                      to="/dashboard"
                      className={({ isActive }) => linkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaHome /> Overview
                    </MotionNavLink>
                  </li>

                  <li>
                    <MotionNavLink
                      to="/dashboard/manage-blogs"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaClipboardList /> Manage Blogs
                    </MotionNavLink>
                  </li>

                  <li>
                    <MotionNavLink
                      to="/dashboard/manage-users"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaUsers /> Manage Users
                    </MotionNavLink>
                  </li>

                  <li>
                    <MotionNavLink
                      to="/dashboard/stats"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      <FaChartBar /> Stats
                    </MotionNavLink>
                  </li>

                  <li>
                    <MotionNavLink
                      to="/dashboard/contents"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      📂 Contents
                    </MotionNavLink>
                  </li>

                  <li>
                    <MotionNavLink
                      to="/dashboard/subscribe"
                      className={({ isActive }) => subLinkClass(isActive)}
                      whileHover={{ scale: 1.03 }}
                    >
                      💌 Subscribe
                    </MotionNavLink>
                  </li>
                </ul>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
