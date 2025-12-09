import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";

const RootRedirect = () => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/auth" replace />;

    if (!user) return <Navigate to="/404" replace />;

    return user.isAdmin
        ? <Navigate to="/admin/home" replace />
        : <Navigate to="/home" replace />;
};
export default RootRedirect;