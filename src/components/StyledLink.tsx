import Link from "next/link";
import { motion } from "framer-motion";

interface StyledLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function StyledLink({ href, children, className = "" }: StyledLinkProps) {
  return (
    <Link href={href} className={`relative group rounded-lg px-4 py-2 hover:bg-accent ${className}`}>
      <motion.span
        className="relative text-lg font-medium text-base-content/80 transition-colors duration-200 group-hover:text-base-200"
        whileHover={{ scale: 1.05 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
