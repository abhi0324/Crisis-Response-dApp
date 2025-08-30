const hre = require("hardhat");

async function main() {
  console.log("Deploying CrisisReporting contract...");

  const CrisisReporting = await hre.ethers.getContractFactory("CrisisReporting");
  const crisisReporting = await CrisisReporting.deploy();

  await crisisReporting.waitForDeployment();

  const address = await crisisReporting.getAddress();
  console.log("CrisisReporting deployed to:", address);

  // Verify the first reporter (deployer) as a verified reporter
  const [deployer] = await hre.ethers.getSigners();
  await crisisReporting.verifyReporter(deployer.address);
  console.log("Deployer verified as reporter:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 