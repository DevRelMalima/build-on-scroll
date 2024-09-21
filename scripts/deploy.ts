import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for the Election contract
  const Election = await ethers.getContractFactory("Election");

  // Deploy the contract
  const election = await Election.deploy();

  // Wait for the deployment to complete
  await election.deployed();

  // Log the deployed contract address
  console.log(`Election contract deployed to: ${election.address}`);
  console.log(`Block explorer URL: https://blockscout.scroll.io/address/${election.address}`);
}

// Execute the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
