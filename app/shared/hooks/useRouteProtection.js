"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/app/shared/Context/AuthContext";

export const useRouteProtection = (
  requiredRoles = [],
  redirectPath = "/auth"
) => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authCtx.isLoading) return;

    // Check if user is logged in
    if (!authCtx.isLoggedIn) {
      router.push(`${redirectPath}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !requiredRoles.includes(authCtx.role)) {
      router.push("/unauthorized");
      return;
    }
  }, [authCtx.isLoading, authCtx.isLoggedIn, authCtx.role, pathname, router]);

  return {
    isAuthenticated: authCtx.isLoggedIn,
    isAuthorized:
      requiredRoles.length === 0 || requiredRoles.includes(authCtx.role),
    isLoading: authCtx.isLoading,
    user: {
      id: authCtx.userId,
      role: authCtx.role,
    },
  };
};
