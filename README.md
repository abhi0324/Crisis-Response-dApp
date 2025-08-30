# Crisis Response dApp

A decentralized Web3 application for crisis reporting and humanitarian aid during national emergencies. Built with React, Next.js, Hardhat, and IPFS.

## 🌟 Features

- **Crisis Reporting**: Submit verified crisis reports with images and location data
- **IPFS Storage**: Secure, decentralized storage for images and metadata
- **Blockchain Donations**: Transparent ETH donations with full traceability
- **Verification System**: Community-driven verification of crisis reports
- **Coinbase Wallet Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Live updates of reports and donations

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js 14, Tailwind CSS
- **Blockchain**: Ethereum, Hardhat, ethers.js
- **Storage**: IPFS (Web3.Storage/NFT.Storage)
- **Smart Contracts**: Solidity, OpenZeppelin
- **Wallet**: Coinbase Wallet SDK

## 📁 Project Structure

```
Crisis/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── ipfs/         # IPFS upload endpoint
│   │   └── test-ipfs/    # IPFS test endpoint
│   ├── donate/           # Donations page
│   ├── reports/          # Reports page
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Homepage
├── components/           # React components
│   ├── Header.js         # Navigation header
│   ├── ReportForm.js     # Report submission form
│   ├── DonationForm.js   # Donation form
│   ├── ReportsList.js    # Reports display
│   └── DonationsList.js  # Donations display
├── contracts/            # Smart contracts
│   └── CrisisReporting.sol # Main contract
├── scripts/              # Deployment scripts
│   ├── deploy.js         # Contract deployment
│   ├── setup.js          # Setup script
│   └── test-setup.js     # Test setup script
├── utils/                # Utility functions
│   ├── web3.js          # Web3 integration
│   └── ipfs.js          # IPFS integration
├── test/                 # Test files
│   └── CrisisReporting.test.js
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## 📋 Smart Contract Features

### CrisisReporting.sol
- **Report Submission**: Submit crisis reports with metadata
- **Image Storage**: Store image hashes and IPFS CIDs
- **Donation Tracking**: Accept and track ETH donations
- **Verification System**: Community verification of reports
- **Reporter Management**: Verified reporter system
- **Security**: Reentrancy protection and access control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Coinbase Wallet browser extension or mobile app
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd Crisis
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# IPFS Storage Configuration (Required for file uploads)
# Choose one of these options:

# Option 1: Web3.Storage (Recommended)
WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# Option 2: NFT.Storage (Alternative)
NFT_STORAGE_TOKEN=your_nft_storage_token_here

# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Network Configuration
NEXT_PUBLIC_NETWORK_ID=31337
NEXT_PUBLIC_NETWORK_NAME=Hardhat Local
```

### 3. Get IPFS Storage Token

#### Option A: Web3.Storage (Recommended)
1. Go to [https://web3.storage/](https://web3.storage/)
2. Sign up with your GitHub account
3. Create a new API token
4. Copy the token to your `.env.local` file

#### Option B: NFT.Storage
1. Go to [https://nft.storage/](https://nft.storage/)
2. Sign up with your GitHub account
3. Create a new API token
4. Copy the token to your `.env.local` file

### 4. Deploy Smart Contract
```bash
# Start local Hardhat node
npm run node

# In a new terminal, deploy contract
npm run deploy
```

### 5. Update Contract Address
After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local` with the deployed contract address.

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage Guide

### Connecting Wallet
1. Click "Connect Coinbase Wallet" in the header
2. Approve Coinbase Wallet connection
3. Ensure you're connected to the correct network (Hardhat localhost:8545)

### Submitting Reports
1. Navigate to "Reports" page
2. Fill in report details (title, description, location)
3. Upload an image (supports JPG, PNG, GIF)
4. Click "Submit Report"
5. Approve Coinbase Wallet transaction

### Making Donations
1. Navigate to "Donate" page
2. Enter donation amount in ETH
3. Add optional message
4. Click "Donate Now"
5. Approve Coinbase Wallet transaction

### Verifying Reports
- Only verified reporters can verify other reports
- Reports need 3 verifications to be marked as verified
- Contract owner can verify new reporters

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run compile      # Compile smart contracts
npm run test         # Run tests
npm run deploy       # Deploy contracts
npm run node         # Start local Hardhat node
npm run setup        # Run setup script
npm run test-setup   # Run test setup
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
npm start
```

## 🛡️ Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks on donations
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive validation of all inputs
- **Secure Withdrawals**: Only owner can withdraw accumulated donations
- **IPFS Verification**: Hash verification for uploaded images

## 🔍 Troubleshooting

### Common Issues:

1. **"No IPFS storage providers configured"**
   - Solution: Add `WEB3_STORAGE_TOKEN` or `NFT_STORAGE_TOKEN` to `.env.local`

2. **"Wallet not connected"**
   - Solution: Connect your wallet using the connect button
   - Ensure Coinbase Wallet extension is installed

3. **"Transaction failed"**
   - Solution: Ensure you have enough ETH for gas fees
   - Check if you're on the correct network (Hardhat localhost:8545)

4. **"Upload failed"**
   - Solution: Check your internet connection
   - Verify IPFS tokens are valid
   - Check browser console for detailed error messages

5. **"Contract not found"**
   - Solution: Ensure contract is deployed and address is correct in `.env.local`
   - Run `npm run deploy` to redeploy if needed

### Debug Mode:
Open browser console (F12) to see detailed error messages and transaction logs.

### Testing the Setup:
1. Start the development server: `npm run dev`
2. Navigate to `/reports` page
3. Connect your wallet
4. Fill out the form and upload an image
5. Submit the report

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Contact the development team

## 🗺️ Roadmap

- [ ] Multi-chain support (Polygon, BSC)
- [ ] Advanced verification mechanisms
- [ ] Integration with emergency services APIs
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] DAO governance for fund allocation
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Report categories and tags

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Web3.Storage and NFT.Storage for IPFS services
- Coinbase Wallet for wallet integration
- Next.js team for the amazing framework
- Hardhat team for development tools

---

**Note**: This is a development version. For production use, ensure proper security audits and testing.
