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
import ErrorBoundary from "../pages/ErrorBoundary";
import UserProfile from "../components/DhasBord/UserProfile";
import ReviewMarquee from "../components/DhasBord/ReviewMarquee";
import GoogleProfile from "../pages/googleProfiles";
import AdminContent from "../components/DhasBord/AdminContents";
import PrivateRoute from "../hook/PrivetRoute";
import SubscribersAdmin from "../components/DhasBord/SuscribeAdmin";
import Settings from "../pages/Settings";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/blogs", element: <PrivateRoute><AllBlogs /></PrivateRoute> },
      { path: "/about", element: <PrivateRoute><AboutPage /></PrivateRoute> },
      { path: "/contactpage", element: <PrivateRoute><ContactPage /></PrivateRoute> },
      { path: "/blogs/:id", element: <PrivateRoute><ViewDetails /></PrivateRoute> },
      { path: "/reviewcard", element: <ReviewMarquee /> },
      { path: "/googleprofile", element: <GoogleProfile /> },
      {path:"/settings", element:<PrivateRoute> <Settings/> </PrivateRoute>}
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Overview /> },
      { path: "myblogs", element: <MyBlogs /> },
      { path: "addblog", element: <AddBlog /> },
      { path: "editblog/:id", element: <EditBlog /> },
      { path: "manage-blogs", element: <ManageBlogs /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "stats", element: <Stats /> },
      { path: "userprofile", element: <UserProfile /> },
      { path: "profile", element: <Profile /> },
      { path: "contents", element: <AdminContent /> },
      { path: "suscribe", element: <SubscribersAdmin /> },
    ],
  },
]);

export default Router;
