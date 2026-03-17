import * as React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  asChild?: boolean;
  to?: string;
}

const base =
  "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
const sizes = {
  default: "px-6 py-3 text-base",
  lg: "px-8 py-6 text-lg",
};
const variants = {
  default: "",
  outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", size = "default", variant = "default", to, children, ...props }, ref) => {
    const cn = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
    if (to) {
      return (
        <Link to={to} className={cn}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={cn} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
