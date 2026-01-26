import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthPage from "../pages/auth/AuthPage";
import ProfilePage from "../pages/user/ProfilePage";
import SendLetterPage from "../pages/user/SendLetterPage";
import LetterSentPage from "../pages/user/LetterSentPage";
import InboxPage from "../pages/user/InboxPage";
import SettingPage from "../pages/user/SettingPage";
import HowItWorksPage from "../pages/user/HowItWork";
import AdminHomePage from "../pages/admin/AdminHomePage";
import RootRedirect from "./rootRedirect";
import PrivateRoute from "./PrivateRouter";
import NotfoundPage from "../pages/auth/NotfoundPage";

export const router = createBrowserRouter([

    // ---------- PUBLIC (No layout) ----------
    {
        path: "/auth",
        element: <DefaultLayout />,
        children: [
            { index: true, element: <AuthPage /> } // index route
        ]
    },
    {
        path: "/404",
        element: <NotfoundPage />
    },

    // ---------- ADMIN ONLY ----------
    {
        element: <PrivateRoute adminOnly />,
        children: [
            { path: "/admin/home", element: <AdminHomePage /> },
        ],
    },

    // ---------- USER ONLY ----------
    {
        element: <PrivateRoute userOnly />,
        children: [
            {
                element: <DefaultLayout />,
                children: [
                    { path: "/home", element: <HomePage /> },
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/send", element: <SendLetterPage /> },
                    { path: "/letter-sent", element: <LetterSentPage /> },
                    { path: "/inbox", element: <InboxPage /> },
                    { path: "/setting", element: <SettingPage /> },
                    { path: "/how-it-works", element: <HowItWorksPage /> },
                ],
            },
        ],
    },

    {
        path: "/",
        element: <RootRedirect />,
    },

    // ---------- CATCH ALL (404) - Phải để cuối cùng ----------
    {
        path: "*",
        element: <Navigate to="/404" replace />
    }
]);