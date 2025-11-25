import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    // const token = localStorage.getItem("token");
    const token = true;

    return token ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PrivateRoute;
