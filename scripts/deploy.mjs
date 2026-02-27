import { ethers } from "ethers";
import { readFileSync } from "fs";
import { readdirSync } from "fs";

const PRIVATE_KEY = "d031e2456c2fff5208dc6aae450329315af075309535408861bcbc16a87a659c";
const RPC_URL = "https://testnet-rpc.monad.xyz";

const files = readdirSync("./compiled/");
const abiFile = files.find(f => f.includes("Payment") && f.endsWith(".abi"));
const binFile = files.find(f => f.includes("Payment") && f.endsWith(".bin"));

const abi = readFileSync(`./compiled/${abiFile}`, "utf8");
const bytecode = "0x" + readFileSync(`./compiled/${binFile}`, "utf8");

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("Deploying with wallet:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MON");

  if (parseFloat(ethers.formatEther(balance)) === 0) {
    console.log("❌ No MON balance! Get testnet MON from https://faucet.monad.xyz");
    return;
  }

  const factory = new ethers.ContractFactory(JSON.parse(abi), bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed at:", address);
  console.log("Add to .env.local → PAYMENT_ADDRESS=" + address);
}

main().catch(console.error);
