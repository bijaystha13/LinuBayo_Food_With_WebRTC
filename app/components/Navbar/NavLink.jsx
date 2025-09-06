"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import classes from "./navlink.module.css";

export default function NavLink({
  href,
  children,
  className,
  isHomeLink = false,
  ...props
}) {
  const path = usePathname();
  const authCtx = useContext(AuthContext);

  const getIsActive = () => {
    if (isHomeLink) {
      if (!authCtx.isLoggedIn) {
        return path === "/" && href === "/";
      } else {
        if (authCtx.role === "admin") {
          return (
            (path === "/admin" || path === "/") &&
            (href === "/admin" || href === "/")
          );
        } else {
          return (
            (path === "/users" || path === "/") &&
            (href === "/users" || href === "/")
          );
        }
      }
    }

    if (href === "/") {
      return path === "/";
    }

    return path === href || path.startsWith(href + "/");
  };

  const isActive = getIsActive();

  return (
    <Link
      href={href}
      className={`${classes.link} ${isActive ? classes.active : ""} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </Link>
  );
}
