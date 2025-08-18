"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadcrumbItem = ({ href, label, isLast }: { href: string; label: string; isLast: boolean }) => {
  const trimmedLabel = (label: string) => {
    if (label.length <= 30) return label;

    const lastSpaceIndex = label.lastIndexOf(" ", 30);
    return label.substring(0, lastSpaceIndex) + "...";
  };

  const getIcon = (path: string) => {
    if (path.includes('/articles')) {
      return (
        <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      );
    }
    if (path.includes('/shorts')) {
      return (
        <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M10 9v6M14 9v6" />
        </svg>
      );
    }
    if (path.includes('/comics')) {
      return (
        <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16l4.5-2 4.5 2V4M7 4a2 2 0 012-2h6a2 2 0 012 2M7 4H5a2 2 0 00-2 2v14l2-1" />
        </svg>
      );
    }
    if (path.includes('/podcasts')) {
      return (
        <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0-4H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    }
    if (path.includes('/about')) {
      return (
        <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    // Default folder icon
    return (
      <svg className="w-4 h-4 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    );
  };

  if (isLast) {
    return (
      <li>
        <span className="text-base-content font-medium break-all inline-flex items-center gap-2" aria-current="page">
          {getIcon(href)}
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">
            {trimmedLabel(label)}
          </span>
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="text-base-content/70 hover:text-primary transition-all duration-200 inline-flex items-center gap-2 hover-lift-subtle px-2 py-1 rounded-md hover:bg-primary/5 focus-ring"
      >
        {getIcon(href)}
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
              className="text-base-content/70 hover:text-primary transition-all duration-200 inline-flex items-center gap-2 hover-lift-subtle px-2 py-1 rounded-md hover:bg-primary/5 focus-ring group"
              title="Go to homepage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0 stroke-current group-hover:scale-110 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span className="font-medium">Home</span>
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
