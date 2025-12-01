import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRouter";
import HomePage from "../pages/user/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthPage from "../pages/auth/AuthPage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import ProfilePage from "../pages/user/ProfilePage";
import SendLetterPage from "../pages/user/SendLetterPage";
import LetterSentPage from "../pages/user/LetterSentPage";
import InboxPage from "../pages/user/InboxPage";
import SettingPage from "../pages/user/SettingPage";

export const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        children: [
            { path: "/auth", element: <AuthPage /> },
        ],
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
                    { path: "/auth", element: <AuthPage /> },
                    { path: "/admin/home", element: <AdminHomePage /> },
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/send", element: <SendLetterPage /> },
                    { path: "/letter-sent", element: <LetterSentPage /> },
                    { path: "/inbox", element: <InboxPage /> },
                    { path: "/setting", element: <SettingPage /> },
                ],
            },
        ],
    },
]);
