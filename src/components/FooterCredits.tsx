import Link from "next/link";

interface CreditItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const credits: CreditItem[] = [
  {
    label: "| Built with",
    href: "https://nextjs.org",
    icon: (
      <svg height="20" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="nextjs-mask"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
        >
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#nextjs-mask)">
          <circle cx="90" cy="90" r="87" fill="currentColor" stroke="currentColor" strokeWidth="6" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="white"
          />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </g>
      </svg>
    ),
  },
  {
    label: "Hosted on",
    href: "https://vercel.com",
    icon: (
      <svg height="20" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function FooterCredits() {
  return (
    <div className="flex items-center gap-4">
      <p className="text-base-content/70">
        © {new Date().getFullYear()} Lenkalica. All rights reserved.{" "}
        {credits.map((credit) => (
          <span key={credit.label}>
            {credit.label}{" "}
            <Link
              href={credit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80"
            >
              {credit.icon}
            </Link>{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
