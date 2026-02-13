interface TxStatusProps {
  status: "idle" | "pending" | "success" | "error";
  error?: string | null;
}

export default function TxStatus({ status, error }: TxStatusProps) {
  if (status === "idle") return null;

  return (
    <div style={{ marginTop: 12, minHeight: 24 }}>
      {status === "pending" && (
        <div style={{ color: "#facc15" }}>
          ⏳ Transaction Pending...
        </div>
      )}

      {status === "success" && (
        <div style={{ color: "#22c55e" }}>
          ✅ Transaction Confirmed
        </div>
      )}

      {status === "error" && (
        <div style={{ color: "#ef4444" }}>
          ❌ Transaction Failed
          {error && (
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
