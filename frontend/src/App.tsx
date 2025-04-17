import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import ProtectedRoute from "./utils/ProtectedRoute";
import Navbar from "./Components/layout/Navbar";
import Writeblog from "./pages/blog/Writeblog";
import ReadBlog from "./pages/blog/ReadBlog";
import EditBlog from "./pages/blog/EditBlog";
import PublicRoute from "./utils/PublicRoute";
import NotFound from "./pages/extra/NotFound";
import GlobalFeed from "./pages/feeds/GlobalFeed";
import Random from "./pages/blog/Random";
import FollowingFeed from "./pages/feeds/FollowingFeed";
import SearchedBlogResults from "./pages/search/SearchedBlogResults";
import SearchedUserResults from "./pages/search/SearchedUserResults";
import Unauthorized from "./pages/extra/Unauthorized";
import Reactions from "./pages/blog/Interactions/Reactions";
import UserProfile from "./pages/user/UserProfile";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: (
        <PublicRoute>
          <Home />
        </PublicRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },

    // protected routes
    {
      path: "/welcome",
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <Welcome />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      children: [
        {
          path: "blogs",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <SearchedBlogResults />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <SearchedUserResults />
              </>
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "/blog",
      children: [
        {
          path: "write",
          element: (
            <ProtectedRoute>
              <>
                <Writeblog />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: ":blogId/read",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <ReadBlog />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: ":blogId/reactions",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <Reactions />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "edit",
          element: (
            <ProtectedRoute>
              <>
                <EditBlog />
              </>
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/user/:userId",
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <UserProfile />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      children: [
        {
          path: "",
          element: (
            <>
              <Navbar />
              <GlobalFeed />
            </>
          ),
        },
        {
          path: "following",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />

                <FollowingFeed />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "random/:feedName",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <Random />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "random/",
          element: (
            <ProtectedRoute>
              <>
                <Navbar />
                <Random />
              </>
            </ProtectedRoute>
          ),
        },
      ],
    },

    {
      path: "*",
      element: (
        <ProtectedRoute>
          <>
            <Navbar />
            <NotFound />
          </>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
