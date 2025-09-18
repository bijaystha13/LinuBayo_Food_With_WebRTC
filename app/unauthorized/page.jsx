"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "@/app/shared/Context/AuthContext";

const UnauthorizedPage = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    if (authCtx.isLoggedIn) {
      const homeRoute = authCtx.role === "admin" ? "/admin" : "/users";
      router.push(homeRoute);
    } else {
      router.push("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚫</div>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px",
            color: "#dc2626",
          }}
        >
          Access Denied
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
            color: "#6b7280",
          }}
        >
          Sorry, you don't have permission to access this page.
        </p>

        {authCtx.isLoggedIn && (
          <p
            style={{
              marginBottom: "30px",
              padding: "15px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              color: "#374151",
            }}
          >
            Logged in as: <strong>{authCtx.role}</strong> (ID: {authCtx.userId})
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleGoBack}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go Home
          </button>

          {!authCtx.isLoggedIn && (
            <Link
              href="/auth"
              style={{
                padding: "12px 24px",
                backgroundColor: "#10b981",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "16px",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
