import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/comics", label: "Comics" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <ul className="menu menu-lg p-4 w-full">
      {menuItems.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={`text-lg py-3 px-4 rounded-lg transition-all duration-200 hover:bg-primary hover:text-primary-content ${
                isActive ? "bg-primary text-primary-content font-medium" : "text-base-content hover:translate-x-1"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
