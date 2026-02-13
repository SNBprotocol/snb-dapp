const hre = require("hardhat");

async function main() {
  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  const MINING = "0x7805b595401F8F369BdD22bDF7840155418cB179";

  console.log("🚀 Deploying ZapStake...");

  const Zap = await hre.ethers.getContractFactory("SNBLiquidityZapStake");

  const zap = await Zap.deploy(TOKEN, ROUTER, MINING);
  await zap.waitForDeployment();

  console.log("✅ ZapStake:", await zap.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
