import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ adminOnly = false }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;

    if (!token) return <Navigate to="/auth" replace />;

    if (adminOnly && !user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
