const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Payment contract to Monad Testnet...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with wallet:", deployer.address);

  const Payment = await ethers.getContractFactory("Payment");
  const payment = await Payment.deploy();
  await payment.waitForDeployment();

  const address = await payment.getAddress();
  console.log("✅ Contract deployed at:", address);
  console.log("PAYMENT_ADDRESS=" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
