const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Crisis Response dApp...\n');

// Create .env.local file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# IPFS Configuration (Infura) - Optional for development
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret

# Network Configuration
NEXT_PUBLIC_NETWORK_ID=1337
NEXT_PUBLIC_NETWORK_NAME=Hardhat Local
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('ℹ️  .env.local file already exists');
}

// Create placeholder image
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const placeholderPath = path.join(publicDir, 'placeholder-image.jpg');
if (!fs.existsSync(placeholderPath)) {
  // Create a simple SVG placeholder
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#f3f4f6"/>
    <text x="200" y="150" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle">
      Image not available
    </text>
  </svg>`;
  
  fs.writeFileSync(placeholderPath.replace('.jpg', '.svg'), svgContent);
  console.log('✅ Created placeholder image');
} else {
  console.log('ℹ️  Placeholder image already exists');
}

console.log('\n📋 Setup complete! Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Start Hardhat node: npm run node');
console.log('3. Deploy contract: npm run deploy');
console.log('4. Start development server: npm run dev');
console.log('\n🔗 Visit http://localhost:3000 to see the application');
console.log('\n📚 Check README.md for detailed instructions'); 