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
            <Welcome />
          </>
        </ProtectedRoute>
      ),
    },
    // {
    //   path: "/blog",
    //   element: (
    //     <ProtectedRoute>
    //       <>
    //         <Navbar />
    //         <Writeblog />
    //       </>
    //     </ProtectedRoute>
    //   ),
    // },

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
          path: "read/:blogId",
          element: (
            <>
              <ReadBlog />
            </>
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
      path: "/",

      children: [
        {
          path: "global",
          element: (
            <ProtectedRoute>
              <>
                <GlobalFeed />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "following",
          element: (
            <ProtectedRoute>
              <>
                <FollowingFeed />
              </>
            </ProtectedRoute>
          ),
        },
        {
          path: "random",
          element: (
            <ProtectedRoute>
              <>
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
            <NotFound />,
          </>
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
