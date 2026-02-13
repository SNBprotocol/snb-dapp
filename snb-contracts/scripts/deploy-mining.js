const hre = require("hardhat");

async function main() {
  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const LP = "0x6dC848c5A7c7Bc010496C3086a201Ab95850E2EF";

  const rewardPerBlock = hre.ethers.parseUnits("0.38", 18); // ⭐ 推荐值
  const startBlock = await hre.ethers.provider.getBlockNumber();

  console.log("🚀 StartBlock:", startBlock);
  console.log("🎯 RewardPerBlock:", rewardPerBlock.toString());

  const Mining = await hre.ethers.getContractFactory("SNBLPMining");

  const mining = await Mining.deploy(
    TOKEN,
    LP,
    rewardPerBlock,
    startBlock
  );

  await mining.waitForDeployment();

  console.log("✅ SNBLPMining:", await mining.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
