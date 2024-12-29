import Link from "next/link";
import { motion } from "framer-motion";

interface StyledLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const linkVariants = {
  hover: {
    scale: 1.1,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export default function StyledLink({ href, children, className = "", onClick }: StyledLinkProps) {
  return (
    <Link href={href} className={`relative group rounded-lg px-4 py-2 ${className}`} onClick={onClick}>
      <motion.span
        className="relative inline-block text-lg font-medium text-base-content/80 transition-colors duration-200 group-hover:text-primary"
        variants={linkVariants}
        whileHover="hover"
      >
        {children}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100" />
      </motion.span>
    </Link>
  );
}
