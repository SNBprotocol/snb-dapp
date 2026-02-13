import { Contract, parseEther } from "ethers";
import { getSigner } from "@/lib/providers";
import { ZAP_STAKE_ABI } from "@/abi/SNBLiquidityZapStake";
import { getContractAddress } from "@/config/contracts";
import { CHAIN_ID } from "@/config/networks";

/**
 * 一键流动性：BNB -> LP -> 自动质押
 */
export async function zapAndStake(bnb: string) {
  if (!bnb || Number(bnb) <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const signer = await getSigner();
  if (!signer) {
    throw new Error("NO_WALLET");
  }

  const provider = signer.provider!;
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  if (
    chainId !== CHAIN_ID.BSC_TESTNET &&
    chainId !== CHAIN_ID.BSC_MAINNET
  ) {
    throw new Error("WRONG_NETWORK");
  }

  const zapStakeAddress = getContractAddress(
    chainId,
    "LIQUIDITY_ZAP_STAKE"
  );

  if (!zapStakeAddress) {
    throw new Error("ZAP_NOT_DEPLOYED");
  }

  const zap = new Contract(
    zapStakeAddress,
    ZAP_STAKE_ABI,
    signer
  );

  return zap.zapAndStake(0, {
    value: parseEther(bnb),
  });
}
