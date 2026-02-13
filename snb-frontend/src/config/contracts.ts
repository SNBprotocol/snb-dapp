import { CHAIN_ID } from "./networks";

/* =========================
   合约名称枚举
========================= */
export type ContractName =
  | "LP_MINING"
  | "LIQUIDITY_ZAP"
  | "LIQUIDITY_ZAP_STAKE"
  | "FEE_DISTRIBUTOR"
  | "REWARD_DISTRIBUTOR"
  | "REFERRAL"
  | "REWARD_POOL"
  | "REFERRAL_REGISTRY"
  | "SNB_LP";

/* =========================
   合约元信息类型
========================= */
type ContractMeta = {
  address: string;
  startBlock?: number; // 👈 统一的事件扫描起点
};

/* =========================
   合约配置（按 chainId）
========================= */
export const CONTRACTS: Record<
  number,
  Record<ContractName, ContractMeta>
> = {
    [CHAIN_ID.BSC_MAINNET]: {
    LP_MINING: {
      address: "0x2Ceba93C7e33b5F1820b395E7DbF751bE41D0289",
      startBlock: 80761212,
    },

    LIQUIDITY_ZAP: {
      address: "0x4e07e31F5f5342A4476f1D4843314667b8D7906E",
    },

    LIQUIDITY_ZAP_STAKE: {
      address: "0x4e07e31F5f5342A4476f1D4843314667b8D7906E",
    },

    FEE_DISTRIBUTOR: {
      address: "0x786c20A4ed28D863BA6aB66a6b45bf886aE80021",
    },

    REWARD_DISTRIBUTOR: {
      address: "0x538F78F7243490429651ae305F4255702064B06d",
    },

    REFERRAL: {
      address: "0xf688e60F221c3381454C4b78142d6D80AF76c1D2",
    },

    REWARD_POOL: {
      address: "0x0000000000000000000000000000000000000000",
    },

    REFERRAL_REGISTRY: {
      address: "0xf688e60F221c3381454C4b78142d6D80AF76c1D2",
      startBlock: 80752405,
    },

    SNB_LP: {
      address: "0xa364DDA569CfA4eDB9288ff065670997C77a5332",
    },
  },


  [CHAIN_ID.BSC_TESTNET]: {
    LP_MINING: {
      address: "0xab47Ed2ADe0452CCB22e7424BfC5Cbe86Bc991F1",
      startBlock: 89295000, // 👈【建议】LP Mining 部署区块
    },

    LIQUIDITY_ZAP: {
      address: "0x2Ceba93C7e33b5F1820b395E7DbF751bE41D0289",
    },

    LIQUIDITY_ZAP_STAKE: {
      address: "0xb5084Beac65181cB5baF3AFa80485ccD9006Ac21",
    },

    FEE_DISTRIBUTOR: {
      address: "0xa6Dc5674b12E96E89AcE703dAd85D124F4450C2e",
    },

    REWARD_DISTRIBUTOR: {
      address: "0x985Db37499D6DB64faa8f2c79E289c91864eeB6e",
      startBlock: 89298144,
    },

    REFERRAL: {
      address: "0xF753B265F45f8F48452aa797c31DE5aCDa39A89E",
    },

    REWARD_POOL: {
      address: "0xab47Ed2ADe0452CCB22e7424BfC5Cbe86Bc991F1",
    },

    REFERRAL_REGISTRY: {
      address: "0xF753B265F45f8F48452aa797c31DE5aCDa39A89E",
    },

    SNB_LP: {
      address: "0x9AF472FdE0ea987335B3416339fC96f8Fda9174D",
    },
  },
};

/* =========================
   合约地址获取（不变）
========================= */
export function getContractAddress(
  chainId: number,
  name: ContractName
): string {
  const meta = CONTRACTS[chainId]?.[name];

  if (!meta?.address) {
    throw new Error(
      `Contract "${name}" is not configured for chainId ${chainId}`
    );
  }

  return meta.address;
}

/* =========================
   合约 startBlock 获取
========================= */
export function getContractStartBlock(
  chainId: number,
  name: ContractName
): number | undefined {
  return CONTRACTS[chainId]?.[name]?.startBlock;
}
