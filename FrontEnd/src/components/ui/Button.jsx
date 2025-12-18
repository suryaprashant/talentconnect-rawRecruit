import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
    accent: "bg-accent-600 hover:bg-accent-700 text-white",
    outline: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={clsx(
        "rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
