"use client";

import { ReactNode } from "react";

export default function PageContainer({
  children,
  maxWidth = 560,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      {children}
    </div>
  );
}
