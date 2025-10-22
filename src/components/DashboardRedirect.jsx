import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardRedirect = () => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authState?.isAuthenticated) {
            navigate("/login");
            return;
        }

        const role = authState.role;

        if (role === "admin" || role === "super_admin") navigate("/admin");
        else if (role === "manager") navigate("/manager");
        else navigate("/customer");
    }, [authState, navigate]);

    return <div className="text-center mt-10 text-gray-700">Redirecting to your dashboard...</div>;
};

export default DashboardRedirect;
