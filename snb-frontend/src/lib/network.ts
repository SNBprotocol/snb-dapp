export const BSC_CHAIN_ID = 56;
export const BSC_CHAIN_ID_HEX = "0x38";

export async function ensureBSC() {
  if (!window.ethereum) {
    throw new Error("NO_WALLET");
  }

  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (parseInt(chainId, 16) !== BSC_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC_CHAIN_ID_HEX }],
      });
    } catch (e: any) {
      throw new Error("WRONG_NETWORK");
    }
  }
}
