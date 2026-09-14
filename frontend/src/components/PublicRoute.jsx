import { Outlet, Navigate } from "react-router-dom";

function PublicRoute(){
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/home" replace /> : <Outlet/>
}

export default PublicRoute;
