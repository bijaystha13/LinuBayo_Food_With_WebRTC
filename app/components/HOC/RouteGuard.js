"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/app/shared/Context/AuthContext";

const RouteGuard = ({ children }) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(pathname);
  }, [pathname, authCtx.isLoading, authCtx.isLoggedIn, authCtx.role]);

  const authCheck = (url) => {
    // Define route protection rules
    const routeRules = {
      // Public routes - always accessible
      public: ["/", "/menu", "/about", "/contact", "/auth", "/unauthorized"],

      // Admin only routes
      adminOnly: [
        "/admin",
        "/admin/users",
        "/admin/create",
        "/admin/profile",
        "/admin/settings",
        "/admin/notifications",
        "/admin/orders",
        "/admin/menu",
        "/admin/reports",
      ],

      // User only routes
      userOnly: ["/users/orders", "/cart"],

      // Both admin and user routes
      authenticated: [
        "/users",
        "/profile",
        "/sessions",
        "/reservations",
        "/notifications",
        "/settings",
        "/favorites",
        "/order-history",
        "/meal-plans",
        "/rewards",
      ],
    };

    // Wait for auth context to load
    if (authCtx.isLoading) {
      setAuthorized(false);
      return;
    }

    // Check if current path is public
    const isPublicRoute =
      routeRules.public.includes(url) ||
      url.startsWith("/auth") ||
      url.startsWith("/api");

    if (isPublicRoute) {
      setAuthorized(true);
      return;
    }

    // Check admin only routes
    const isAdminRoute = routeRules.adminOnly.some((route) =>
      url.startsWith(route)
    );
    if (isAdminRoute) {
      if (!authCtx.isLoggedIn) {
        setAuthorized(false);
        router.push(`/auth?redirect=${encodeURIComponent(url)}`);
        return;
      }

      if (authCtx.role !== "admin") {
        setAuthorized(false);
        router.push("/unauthorized");
        return;
      }
    }

    // Check user only routes
    const isUserRoute = routeRules.userOnly.some((route) =>
      url.startsWith(route)
    );
    if (isUserRoute) {
      if (!authCtx.isLoggedIn) {
        setAuthorized(false);
        router.push(`/auth?redirect=${encodeURIComponent(url)}`);
        return;
      }

      if (authCtx.role !== "user") {
        setAuthorized(false);
        router.push("/unauthorized");
        return;
      }
    }

    // Check authenticated routes (both admin and user)
    const isAuthenticatedRoute = routeRules.authenticated.some((route) =>
      url.startsWith(route)
    );
    if (isAuthenticatedRoute) {
      if (!authCtx.isLoggedIn) {
        setAuthorized(false);
        router.push(`/auth?redirect=${encodeURIComponent(url)}`);
        return;
      }
    }

    setAuthorized(true);
  };

  // Show loading while checking authorization
  if (authCtx.isLoading || !authorized) {
    // For public routes, don't show loading
    const publicRoutes = ["/", "/menu", "/about", "/contact"];
    const isPublic =
      publicRoutes.includes(pathname) || pathname.startsWith("/auth");

    if (isPublic && !authCtx.isLoading) {
      return <>{children}</>;
    }

    return (
      <div
        className="route-guard-loading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Checking permissions...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
