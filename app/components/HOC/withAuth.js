"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/shared/Context/AuthContext";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function AuthenticatedComponent(props) {
    const authCtx = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      // Wait for auth context to load
      if (authCtx.isLoading) return;

      // If not logged in, redirect to auth page
      if (!authCtx.isLoggedIn) {
        router.push(
          "/auth?redirect=" + encodeURIComponent(window.location.pathname)
        );
        return;
      }

      // If specific roles are required, check user role
      if (allowedRoles.length > 0 && !allowedRoles.includes(authCtx.role)) {
        router.push("/unauthorized");
        return;
      }
    }, [authCtx.isLoading, authCtx.isLoggedIn, authCtx.role, router]);

    // Show loading while checking authentication
    if (authCtx.isLoading) {
      return (
        <div className="auth-loading">
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      );
    }

    // Don't render the component if not authenticated or authorized
    if (
      !authCtx.isLoggedIn ||
      (allowedRoles.length > 0 && !allowedRoles.includes(authCtx.role))
    ) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
