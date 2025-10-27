import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import AddBlog from "../components/AddBlog";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AboutPage from "../pages/HelpCenter";
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
import AdminRoute from "../pages/AdminRoute";
import UserOverview from "../components/DhasBord/UsersOverView";
import Bookmarks from "../components/bookmarks ";
import HelpCenter from "../support-center/HelpCenter";
import LiveChat from "../support-center/LiveChat";
import FQA from "../support-center/FAQ";
import Support from "../support-center/Support";
import PrivacyPolicy from "../support-center/PrivacyPolicy";
import TramsOfService from "../support-center/TramsOfService"
import Tutorials from "../support-center/Tutorials"
import AdminSupportTickets from "../components/DhasBord/AdminSupportTickets";
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
      { path: "/about", element: <AboutPage /> },
      { path: "/contactpagepage", element: <ContactPage /> },
      { path: "/blogs/:id", element: <PrivateRoute><ViewDetails /></PrivateRoute> },
      { path: "/reviewcard", element: <ReviewMarquee /> },
      { path: "/googleprofile", element: <GoogleProfile /> },
      {path:"/settings", element:<PrivateRoute> <Settings/> </PrivateRoute>},
      {path:"/helpcenter", element: <HelpCenter/>},
      {path:"/live-chat", element: <LiveChat/>},
      {path:"/help/faq", element:<FQA/> },
      {path:"/help/support", element:<Support/>},
      {path:"/privacy", element: <PrivacyPolicy/>},
      {path:"/terms", element:<TramsOfService/>},
      {path: "/tutorials", element:<Tutorials/>}
     
    ],
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "overview", element: <AdminRoute><Overview /></AdminRoute> },
      { path: "myblogs", element: <MyBlogs /> },
      {path: "addblog", element: <AddBlog/>},
      { path: "useroverview", element: <UserOverview/> },
      { path: "editblog/:id", element: <EditBlog /> },
      { path: "manage-blogs", element: <AdminRoute><ManageBlogs /></AdminRoute> },
      { path: "manage-users", element: <AdminRoute><ManageUsers /></AdminRoute> },
     
      { path: "stats", element: <AdminRoute><Stats /></AdminRoute> },
      { path: "userprofile", element: <AdminRoute><UserProfile /></AdminRoute> },
      { path: "profile", element: <AdminRoute><Profile /></AdminRoute> },
      { path: "contents", element: <AdminRoute><AdminContent /></AdminRoute> },
      { path: "Bookmarks", element: <Bookmarks/> },
      {path:"subscribe", element:<SubscribersAdmin/>},
      {path:"adminsupport", element:<AdminSupportTickets/>}
    ],
  },
]);

export default Router;
