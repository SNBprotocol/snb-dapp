import EthereumProvider from "@walletconnect/ethereum-provider";
import { BrowserProvider } from "ethers";
import { CHAIN_ID } from "@/config/networks";
console.log(
  "[ENV] WC_PROJECT_ID =",
  process.env.NEXT_PUBLIC_WC_PROJECT_ID
);


let wcProvider: EthereumProvider | null = null;

export async function getWCProvider() {
  if (wcProvider) return wcProvider;

  if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
    throw new Error("WC_PROJECT_ID_MISSING");
  }

  console.log("[WC] init start");

  try {
    wcProvider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      chains: [CHAIN_ID.BSC_TESTNET],
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
        [CHAIN_ID.BSC_TESTNET]:
          "https://data-seed-prebsc-1-s1.binance.org:8545",
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

export async function getWCSigner() {
  try {
    const provider = await getWCProvider();

    console.log("[WC] enable start");
    await provider.enable(); // 👈 99% 就是这里失败
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

export async function disconnectWC() {
  if (!wcProvider) return;
  await wcProvider.disconnect();
  wcProvider = null;
}
