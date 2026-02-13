import { formatUnits } from "ethers";

/**
 * 通用代币格式化
 * @param value bigint | string
 * @param decimals 默认 18
 * @param precision 显示小数位
 */
export function formatToken(
  value: bigint | string,
  decimals = 18,
  precision = 4
): string {
  try {
    const formatted = formatUnits(value, decimals);
    const [int, dec = ""] = formatted.split(".");
    return dec
      ? `${int}.${dec.slice(0, precision)}`
      : int;
  } catch {
    return "0";
  }
}

/**
 * 专用于 SNB 显示
 */
export function formatSNB(value: bigint | string): string {
  return formatToken(value, 18, 4);
}

/**
 * 专用于 LP Token 显示（通常 18 位）
 */
export function formatLP(value: bigint | string): string {
  return formatToken(value, 18, 6);
}

/**
 * 专用于 BNB 显示
 */
export function formatBNB(value: bigint | string): string {
  return formatToken(value, 18, 4);
}
