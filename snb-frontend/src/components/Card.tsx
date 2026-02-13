import React from "react";

export default function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#161a1e] border border-[#22262a] rounded-2xl p-6">
      {title && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}
