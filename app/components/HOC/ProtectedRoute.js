"use client";
import { useContext } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  fallback = null,
  redirectTo = "/auth",
}) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  // Show loading state
  if (authCtx.isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  // Check authentication
  if (!authCtx.isLoggedIn) {
    router.push(
      `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`
    );
    return fallback;
  }

  // Check authorization
  if (requiredRoles.length > 0 && !requiredRoles.includes(authCtx.role)) {
    router.push("/unauthorized");
    return fallback;
  }

  return children;
};

export default ProtectedRoute;
