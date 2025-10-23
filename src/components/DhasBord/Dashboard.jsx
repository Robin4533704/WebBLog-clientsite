import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaClipboardList, FaBlog, FaUserEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import useUserRole from "./useUserRole";
import Loading from "../../pages/Loading";


const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
 
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (roleLoading) return <Loading />;

  const linkClass = (isActive) =>
    `px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${
      isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"
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
      <div className="drawer-content flex flex-col bg-gray-50 min-h-screen">
        {/* Mobile Navbar */}
        <div className="w-full navbar bg-amber-300 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="ml-2 text-lg font-semibold flex-1">Dashboard</div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-6 w-64 min-h-full bg-lime-600 text-white">
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

          {/* Common Links */}
          <li>
            <MotionNavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
              <FaHome /> Overview
            </MotionNavLink>
          </li>
          <li>
            <MotionNavLink to="/dashboard/profile" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
              <FaUserEdit /> Update Profile
            </MotionNavLink>
          </li>

          {/* User Links */}
          {role === "user" && (
            <>
              <p className="mt-6 mb-2 font-semibold text-gray-200 uppercase">My Blogs</p>
              <li>
                <MotionNavLink to="/dashboard/myblogs" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
                  <FaBlog /> My Blogs
                </MotionNavLink>
              </li>
              <li>
                <MotionNavLink to="/dashboard/addblog" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
                  ➕ Add Blog
                </MotionNavLink>
              </li>
               <li>
            <MotionNavLink to="/dashboard/userprofile" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
              <FaUserEdit /> Profile
            </MotionNavLink>
          </li>
            </>
          )}

          {/* Admin Links */}
          {role === "admin" && (
            <>
              <p className="mt-6 mb-2 font-semibold text-gray-200 uppercase">Admin Panel</p>
              <li>
                <MotionNavLink to="/dashboard/manage-blogs" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
                  <FaClipboardList /> Manage Blogs
                </MotionNavLink>
              </li>
              <li>
                <MotionNavLink to="/dashboard/manage-users" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
                  <FaUsers /> Manage Users
                </MotionNavLink>
              </li>
              <li>
                <MotionNavLink to="/dashboard/stats" className={({ isActive }) => linkClass(isActive)} whileHover={{ scale: 1.03 }}>
                  📊 Stats
                </MotionNavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
