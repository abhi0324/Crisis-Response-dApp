const hre = require("hardhat");

async function main() {
  console.log("Testing Crisis Response dApp Setup...\n");

  // Check environment variables
  console.log("Environment Check:");
  console.log("- WEB3_STORAGE_TOKEN:", process.env.WEB3_STORAGE_TOKEN ? "✓ Configured" : "✗ Missing");
  console.log("- NFT_STORAGE_TOKEN:", process.env.NFT_STORAGE_TOKEN ? "✓ Configured" : "✗ Missing");
  console.log("- NEXT_PUBLIC_CONTRACT_ADDRESS:", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "Not set");
  
  if (!process.env.WEB3_STORAGE_TOKEN && !process.env.NFT_STORAGE_TOKEN) {
    console.log("\n⚠️  WARNING: No IPFS storage tokens configured!");
    console.log("   The submit report functionality will not work without IPFS tokens.");
    console.log("   Please add WEB3_STORAGE_TOKEN or NFT_STORAGE_TOKEN to your .env.local file");
  }

  // Check if contract is deployed
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("\nNetwork Check:");
    console.log("- Network:", hre.network.name);
    console.log("- Deployer:", deployer.address);
    console.log("- Balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

    // Try to get the contract
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("\nContract Check:");
    console.log("- Expected Address:", contractAddress);
    
    const code = await deployer.provider.getCode(contractAddress);
    if (code !== "0x") {
      console.log("- Contract Status: ✓ Deployed and accessible");
      
      // Try to interact with the contract
      try {
        const CrisisReporting = await hre.ethers.getContractFactory("CrisisReporting");
        const contract = CrisisReporting.attach(contractAddress);
        const reportsCount = await contract.getReportsCount();
        console.log("- Current Reports Count:", reportsCount.toString());
        console.log("- Contract Interaction: ✓ Working");
      } catch (error) {
        console.log("- Contract Interaction: ✗ Failed -", error.message);
      }
    } else {
      console.log("- Contract Status: ✗ Not deployed or wrong address");
      console.log("  Please run 'npm run deploy' to deploy the contract");
    }

  } catch (error) {
    console.log("\n❌ Network connection failed:", error.message);
    console.log("   Please ensure Hardhat node is running with 'npm run node'");
  }

  console.log("\nSetup Summary:");
  if (process.env.WEB3_STORAGE_TOKEN || process.env.NFT_STORAGE_TOKEN) {
    console.log("✓ IPFS storage configured");
  } else {
    console.log("✗ IPFS storage not configured");
  }
  
  // Check contract deployment
  try {
    const [deployer] = await hre.ethers.getSigners();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const code = await deployer.provider.getCode(contractAddress);
    if (code !== "0x") {
      console.log("✓ Smart contract deployed");
    } else {
      console.log("✗ Smart contract not deployed");
    }
  } catch (error) {
    console.log("✗ Cannot verify contract deployment");
  }

  console.log("\nNext Steps:");
  if (!process.env.WEB3_STORAGE_TOKEN && !process.env.NFT_STORAGE_TOKEN) {
    console.log("1. Get IPFS storage token from https://web3.storage/ or https://nft.storage/");
    console.log("2. Add token to .env.local file");
  }
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const code = await deployer.provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("3. Deploy smart contract: npm run deploy");
    }
  } catch (error) {
    console.log("3. Start Hardhat node: npm run node");
    console.log("4. Deploy smart contract: npm run deploy");
  }
  
  console.log("5. Start development server: npm run dev");
  console.log("6. Connect wallet and test submit report functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 