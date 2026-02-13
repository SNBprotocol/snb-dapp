const hre = require("hardhat");

async function main() {
  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const REGISTRY = "0xa40A2e0FaD674D49c50E920EC6b5eD78F51510a5";

  const Reward = await hre.ethers.getContractFactory("RewardDistributor");

  const reward = await Reward.deploy(TOKEN, REGISTRY);
  await reward.waitForDeployment();

  console.log("✅ RewardDistributor:", await reward.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
