import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const userRef = doc(db, "customers", user.uid);
                const userSnap = await getDoc(userRef);
                const role = userSnap.exists() ? userSnap.data().role : "customer";

                if (allowedRoles.includes(role)) {
                    setAuthorized(true);
                } else {
                    // redirect unauthorized users safely
                    navigate(role === "customer" ? "/dashboard" : "/", { replace: true });
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [allowedRoles, navigate]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Checking permissions...
            </div>
        );

    return authorized ? children : null;
};

export default ProtectedRoute;
