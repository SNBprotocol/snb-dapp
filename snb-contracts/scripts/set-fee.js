const hre = require("hardhat");

async function main() {
  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const FD = "0x1De20143F41d9e04da584BC456Ea3DB3B317CD25";

  const token = await hre.ethers.getContractAt("SNBTokenFinal", TOKEN);

  console.log("🔗 Linking FeeDistributor...");

  const tx = await token.setFeeDistributor(FD);
  await tx.wait();

  console.log("✅ FeeDistributor linked successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
