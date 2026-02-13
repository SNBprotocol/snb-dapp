import React from "react";

export default function Button({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-3 rounded-xl font-semibold transition
        ${disabled
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-[#f0b90b] text-black hover:opacity-90"}
      `}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
