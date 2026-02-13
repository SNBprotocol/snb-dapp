const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("ReferralRegistry");

  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log("✅ ReferralRegistry:", await registry.getAddress());
}

main().catch(console.error);
