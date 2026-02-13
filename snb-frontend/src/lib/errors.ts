export function parseError(err: any): string | null {
  if (!err) return null;

  const msg = err.message || "";

  if (msg === "NO_WALLET") {
    return "请先安装 MetaMask";
  }

  if (msg === "WRONG_NETWORK") {
    return "请切换到 BNB Chain";
  }

  // ❗️关键：未知错误，不返回网络提示
  return "操作失败，请稍后重试";
}
