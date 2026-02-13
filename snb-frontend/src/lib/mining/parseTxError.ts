import { MiningTxError } from "./errors";

export function parseMiningTxError(err: any): MiningTxError {
  // 用户拒绝
  if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
    return {
      name: "UserRejected",
      message: "User rejected transaction",
      code: "USER_REJECTED",
      raw: err,
    };
  }

  // 我们自己 throw 的错误
  if (err?.message === "WRONG_NETWORK") {
    return {
      name: "WrongNetwork",
      message: "Wrong network",
      code: "WRONG_NETWORK",
      raw: err,
    };
  }

  if (err?.message === "INSUFFICIENT_LP") {
    return {
      name: "Insufficient",
      message: "Insufficient LP balance",
      code: "INSUFFICIENT",
      raw: err,
    };
  }

  const reason =
    err?.reason ||
    err?.shortMessage ||
    err?.message ||
    "";

  const lower = reason.toLowerCase();

  // too early / locked
  if (
    lower.includes("too early") ||
    lower.includes("not yet") ||
    lower.includes("locked")
  ) {
    return {
      name: "TooEarly",
      message: reason,
      code: "TOO_EARLY",
      raw: err,
    };
  }

  // 余额 / allowance
  if (
    lower.includes("insufficient") ||
    lower.includes("exceeds balance") ||
    lower.includes("allowance")
  ) {
    return {
      name: "Insufficient",
      message: reason,
      code: "INSUFFICIENT",
      raw: err,
    };
  }

  // RPC / 网络
  if (
    err?.code === "NETWORK_ERROR" ||
    err?.code === "TIMEOUT" ||
    lower.includes("rpc") ||
    lower.includes("network")
  ) {
    return {
      name: "RpcError",
      message: "Network or RPC error",
      code: "RPC_ERROR",
      raw: err,
    };
  }

  // 合约 revert
  if (reason) {
    return {
      name: "ContractRevert",
      message: reason,
      code: "CONTRACT_REVERT",
      raw: err,
    };
  }

  return {
    name: "Unknown",
    message: "Unknown transaction error",
    code: "UNKNOWN",
    raw: err,
  };
}
