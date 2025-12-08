import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../utils/userContext";

const PrivateRoute = ({ adminOnly = false, userOnly = false }) => {
    const token = localStorage.getItem("token");
    const { user } = useContext(UserContext);

    if (!token) return <Navigate to="/auth" replace />;

    if (!user) return <div>Loading...</div>;

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/home" replace />;
    }

    if (userOnly && user.isAdmin) {
        return <Navigate to="/admin/home" replace />;
    }

    return <Outlet />;
};
export default PrivateRoute;