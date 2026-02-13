const hre = require("hardhat");

async function main() {

  const FD = "0x1De20143F41d9e04da584BC456Ea3DB3B317CD25";
  const REWARD = "0x61cebDb9590371fdB41Fe20ccF52Af40d26262E4";
  const MINING = "0x7805b595401F8F369BdD22bDF7840155418cB179";
  const ZAP = "0x37fd54d7423Ad1F4D7C9Cb171F5763306E079F2B";

  console.log("🚀 Initializing SNB system...");

  const fee = await hre.ethers.getContractAt("SNBFeeDistributor", FD);
  const mining = await hre.ethers.getContractAt("SNBLPMining", MINING);
  const reward = await hre.ethers.getContractAt("RewardDistributor", REWARD);

  /* ================= FD Destinations ================= */

  console.log("⚙️ Setting FeeDistributor destinations...");

  await (await fee.setDestinations(
    MINING,   // lpMining
    REWARD,   // rewardPool
    REWARD,   // buybackVault (临时统一)
    REWARD,   // liquidityVault (临时统一)
    REWARD    // referralRegistry (临时统一)
  )).wait();

  /* ================= RewardDistributor 授权 ================= */

  console.log("⚙️ Authorizing distributors...");

  await (await reward.setDistributors(
    FD,
    MINING
  )).wait();

  /* ================= Mining → RewardDistributor ================= */

  console.log("⚙️ Linking Mining → RewardDistributor...");

  await (await mining.setRewardDistributor(REWARD)).wait();

  /* ================= Zap 白名单 ================= */

  console.log("⚙️ Approving ZapStake...");

  await (await mining.setZap(ZAP, true)).wait();

  console.log("✅ SYSTEM INITIALIZED SUCCESSFULLY");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
