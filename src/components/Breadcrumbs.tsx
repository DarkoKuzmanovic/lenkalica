"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadcrumbItem = ({ href, label, isLast }: { href: string; label: string; isLast: boolean }) => {
  const trimmedLabel = (label: string) => {
    if (label.length <= 30) return label;

    const lastSpaceIndex = label.lastIndexOf(" ", 30);
    return label.substring(0, lastSpaceIndex) + "...";
  };

  if (isLast) {
    return (
      <li>
        <span className="text-base-content font-medium break-all" aria-current="page">
          {trimmedLabel(label)}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-4 h-4 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          ></path>
        </svg>
        <span className="break-all">{label}</span>
      </Link>
    </li>
  );
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    // Replace hyphens and underscores with spaces and decode URI components
    const label = decodeURIComponent(segment)
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const isLast = index === pathSegments.length - 1;

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <div className="w-full flex justify-center">
      <div className="text-sm breadcrumbs max-w-screen-xl w-full px-4">
        <ul className="flex-wrap">
          <li>
            <Link
              href="/"
              className="text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span>Home</span>
            </Link>
          </li>
          {breadcrumbItems.map((item) => (
            <BreadcrumbItem key={item.href} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
