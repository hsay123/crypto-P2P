require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    monad: {
      type: "http",
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: ["d031e2456c2fff5208dc6aae450329315af075309535408861bcbc16a87a659c"],
    },
  },
};
