export type MiningTxErrorCode =
  | "TOO_EARLY"
  | "INSUFFICIENT"
  | "USER_REJECTED"
  | "RPC_ERROR"
  | "CONTRACT_REVERT"
  | "WRONG_NETWORK"
  | "UNKNOWN";

export interface MiningTxError extends Error {
  code: MiningTxErrorCode;
  raw?: unknown;
}
