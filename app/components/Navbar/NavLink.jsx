"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./navlink.module.css";

export default function NavLink({ href, children, className, ...props }) {
  const path = usePathname();

  // Check if current path matches the href
  const isActive = path === href || (href !== "/" && path.startsWith(href));

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
