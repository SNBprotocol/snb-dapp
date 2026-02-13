"use client";

export default function LoadingButton({
  loading,
  children,
  ...props
}: {
  loading?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        width: "100%",
        padding: "14px 0",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 700,
        background: loading ? "#555" : "#f0b90b",
        color: "#000",
        cursor: loading ? "not-allowed" : "pointer",
        border: "none",
      }}
    >
      {children}
    </button>
  );
}
