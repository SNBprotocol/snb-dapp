import EthereumProvider from "@walletconnect/ethereum-provider";
import { BrowserProvider } from "ethers";
import { CHAIN_ID } from "@/config/networks";

console.log(
  "[ENV] WC_PROJECT_ID =",
  process.env.NEXT_PUBLIC_WC_PROJECT_ID
);

let wcProvider: EthereumProvider | null = null;

/**
 * ================================
 * 当前使用链（自动根据主网常量）
 * ================================
 */
const TARGET_CHAIN_ID = CHAIN_ID.BSC_MAINNET;

/**
 * ================================
 * RPC 映射
 * ================================
 */
const RPC_MAP: Record<number, string> = {
  [CHAIN_ID.BSC_MAINNET]: "https://bsc-dataseed.binance.org/",
  [CHAIN_ID.BSC_TESTNET]:
    "https://data-seed-prebsc-1-s1.binance.org:8545",
};

/**
 * ================================
 * 初始化 WalletConnect Provider
 * ================================
 */
export async function getWCProvider() {
  if (wcProvider) return wcProvider;

  if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
    throw new Error("WC_PROJECT_ID_MISSING");
  }

  console.log("[WC] init start");

  try {
    wcProvider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      chains: [TARGET_CHAIN_ID],
      optionalChains: [],
      showQrModal: true,

      methods: [
        "eth_sendTransaction",
        "eth_signTransaction",
        "eth_sign",
        "personal_sign",
        "eth_signTypedData",
      ],

      events: ["accountsChanged", "chainChanged", "disconnect"],

      rpcMap: {
        [TARGET_CHAIN_ID]: RPC_MAP[TARGET_CHAIN_ID],
      },
    });

    console.log("[WC] init success");
    return wcProvider;
  } catch (err) {
    console.error("[WC] init failed", err);
    wcProvider = null;
    throw err;
  }
}

/**
 * ================================
 * 获取 Signer
 * ================================
 */
export async function getWCSigner() {
  try {
    const provider = await getWCProvider();

    console.log("[WC] enable start");

    /**
     * ⚠️ 关键：增加超时保护
     * 防止 iOS 某些钱包无限转圈
     */
    await Promise.race([
      provider.enable(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("WC_TIMEOUT")), 15000)
      ),
    ]);

    console.log("[WC] enable success");

    const ethersProvider = new BrowserProvider(provider as any);
    const signer = await ethersProvider.getSigner();

    return {
      provider: ethersProvider,
      signer,
    };
  } catch (err) {
    console.error("[WC] get signer failed", err);
    throw err;
  }
}

/**
 * ================================
 * 断开 WalletConnect
 * ================================
 */
export async function disconnectWC() {
  if (!wcProvider) return;

  try {
    await wcProvider.disconnect();
  } catch {
    // 忽略错误
  }

  wcProvider = null;
}
