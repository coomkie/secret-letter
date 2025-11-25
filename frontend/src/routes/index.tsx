import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import PrivateRoute from "./PrivateRouter";
import HomePage from "../pages/home/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <Navigate to="/home" replace />
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <DefaultLayout />,
                children: [
                    { path: "/home", element: <HomePage /> },
                    // { path: "/sent", element: <Sent /> },
                    // { path: "/received", element: <Received /> },
                ],
            },
        ],
    },
]);
