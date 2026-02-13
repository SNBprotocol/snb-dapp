const hre = require("hardhat");

async function main() {
  const TOKEN = "0x7cE905Eb10a94e9D6d0618A25DCDC0172Db14309";
  const PAIR = "0x6dC848c5A7c7Bc010496C3086a201Ab95850E2EF";

  const token = await hre.ethers.getContractAt("SNBTokenFinal", TOKEN);

  console.log("🔗 Setting DexPair...");

  const tx = await token.setDexPair(PAIR);
  await tx.wait();

  console.log("✅ DexPair set successfully:", PAIR);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
