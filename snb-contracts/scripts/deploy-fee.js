const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying FeeDistributor with:", deployer.address);

  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // Pancake V2

  const FeeDistributor = await hre.ethers.getContractFactory("SNBFeeDistributor");

  const fee = await FeeDistributor.deploy(
    TOKEN,
    ROUTER,
    deployer.address
  );

  await fee.waitForDeployment();

  console.log("✅ FeeDistributor deployed to:", await fee.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
