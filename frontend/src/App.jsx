import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ListPage from "./routes/listPage/ListPage";
import { RequireAuth, Layout } from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import LoginPage from "./routes/login/LoginPage";
import RegisterPage from "./routes/register/RegisterPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        { path: "/list", element: <ListPage /> },
        {
          path: "/:id", element: <SinglePage />,
        },
        {
          path:"/login",
          element:<LoginPage/>
        },
        {
          path:"/register",
          element:<RegisterPage/>
        }
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path:"/profile",
          element:<ProfilePage/>
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
