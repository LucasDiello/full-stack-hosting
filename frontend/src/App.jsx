import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/ListPage";
import { RequireAuth, Layout } from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import LoginPage from "./routes/login/LoginPage";
import RegisterPage from "./routes/register/RegisterPage";
import ProfileUpdatePage from "./routes/profileUpdatePage/ProfileUpdatePage";
import NewPostPage from "./routes/newPostPage/NewPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import NotFoundPage from "./routes/notFoundPage/NotFoundPage";
import ErrorPage from "./routes/errorPage/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        { 
          path: "/list", 
          element: <ListPage />, 
          loader: listPageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
