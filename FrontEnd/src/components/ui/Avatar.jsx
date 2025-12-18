import React, { useMemo, useState } from "react";

export default function Avatar({ src, name = "", size = "md", className = "" }) {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const sizeClass = sizes[size] || sizes.md;

  const initials = useMemo(() => {
    const trimmed = (name || "").trim();
    if (!trimmed) return "?";
    return trimmed
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  }, [name]);

  const canShowImage = Boolean(src) && !imgError;

  return (
    <div
      className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${sizeClass} ${className}`}
      aria-label={name || "avatar"}
    >
      {canShowImage ? (
        <img
          src={src}
          alt={name || "avatar"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-gray-700 font-semibold select-none">{initials}</span>
      )}
    </div>
  );
}
