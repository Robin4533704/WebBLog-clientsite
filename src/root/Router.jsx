import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import AddBlog from "../components/AddBlog";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/Contactpage";
import ViewDetails from "../components/ViewDetails";
import EditBlog from "../pages/EditBlog";
import Dashboard from "../components/DhasBord/Dashboard";
import Overview from "../components/DhasBord/OverView";
import ManageBlogs from "../components/DhasBord/ManageBlogs";
import ManageUsers from "../components/DhasBord/ManageUsers";
import Stats from "../components/DhasBord/Stats";
import MyBlogs from "../components/MyBlogs";
import Profile from "../pages/Profiles";
import AllBlogs from "../components/AllBlogs";
import RivewCard from "../pages/RivewCard";
import CategoryBlogs from "../components/DhasBord/CategoryBlogs";
import ErrorBoundary from "../pages/ErrorBoundary";
import UserProfile from "../components/DhasBord/UserProfile";

const Router = createBrowserRouter([
  // Public pages with MainLayout
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />, // ✅ Fallback UI for MainLayout & children
    children: [
      { path: "/", element: <Home /> },
      { path: "/blogs", element: <AllBlogs /> },
      { path: "/blogs/category/:categoryName", element: <CategoryBlogs /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/aboutpage", element: <AboutPage /> },
      { path: "/contactpage", element: <ContactPage /> },
      { path: "/reviewcard", element: <RivewCard /> },
      { path: "/blogs/:id", element: <ViewDetails /> },
     // Blog detail
    ],
  },

  // Dashboard with nested routes
  {
    path: "/dashboard",
    element: <ErrorBoundary><Dashboard /></ErrorBoundary>, // ✅ ErrorBoundary for Dashboard
    children: [
      { index: true, element: <Overview /> }, // default = Overview
      { path: "myblogs", element: <MyBlogs /> },
      { path: "addblog", element: <AddBlog /> },
      { path: "editblog/:id", element: <EditBlog /> },
      { path: "manage-blogs", element: <ManageBlogs /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "stats", element: <Stats /> },
      {path: "userprofile", element: <UserProfile/>},
        {path:"profile", element: <Profile/>}
    ],
  },
]);

export default Router;
