# Shardeum Hackathon dApp

A comprehensive Web3 application built on Shardeum blockchain featuring payments, NFT ticketing, and governance voting.

## 🚀 Features

- **Lightning Payments**: Send SHM tokens with ultra-low gas fees
- **NFT Ticketing**: Create and manage event tickets as NFTs
- **Governance Voting**: Participate in decentralized decision making
- **Modern UI**: Beautiful, responsive interface with dark theme
- **Real-time Updates**: Live transaction status and blockchain data

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **Blockchain**: Ethers.js v6, Shardeum Unstablenet
- **State Management**: SWR for data fetching
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- MetaMask or compatible Web3 wallet
- SHM tokens for Shardeum Unstablenet

## 🔧 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd shardeum-hackathon-dapp
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Copy the environment template:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` with your configuration:

\`\`\`env
NEXT_PUBLIC_SHARDEUM_RPC_URL=https://unstablenet.shardeum.org/
NEXT_PUBLIC_SHARDEUM_CHAIN_ID=8080
NEXT_PUBLIC_SHARDEUM_EXPLORER_URL=https://explorer-unstablenet.shardeum.org/

# Update these after deploying contracts
NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0x...
\`\`\`

### 4. Deploy Smart Contracts

First, add your deployer private key to environment:

\`\`\`bash
export DEPLOYER_PRIVATE_KEY="your_private_key_here"
\`\`\`

Deploy contracts to Shardeum:

\`\`\`bash
npm run deploy:contracts
\`\`\`

Update your `.env.local` with the deployed contract addresses.

### 5. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🌐 Shardeum Network Setup

### Add Shardeum Unstablenet to MetaMask

1. Open MetaMask
2. Click "Add Network" or "Custom RPC"
3. Enter the following details:

- **Network Name**: Shardeum Unstablenet
- **RPC URL**: https://unstablenet.shardeum.org/
- **Chain ID**: 8080
- **Currency Symbol**: SHM
- **Block Explorer**: https://explorer-unstablenet.shardeum.org/

### Get Test SHM Tokens

1. Visit the [Shardeum Faucet](https://faucet-unstablenet.shardeum.org/)
2. Enter your wallet address
3. Request test SHM tokens
4. Wait for confirmation

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy with Docker

\`\`\`bash
# Build the image
docker build -t shardeum-dapp .

# Run the container
docker run -p 3000:3000 shardeum-dapp
\`\`\`

### Deploy with Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

## 📝 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript checks
- \`npm run deploy:contracts\` - Deploy smart contracts
- \`npm run verify:contracts\` - Verify contracts on explorer

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## 📊 Performance Monitoring

The app includes Vercel Analytics for performance monitoring. View metrics in your Vercel dashboard.

## 🔒 Security Considerations

- Never commit private keys to version control
- Use environment variables for sensitive data
- Validate all user inputs
- Implement proper error handling
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the [Issues](https://github.com/your-repo/issues) page
- Join the [Shardeum Discord](https://discord.gg/shardeum)
- Read the [Shardeum Documentation](https://docs.shardeum.org/)

## 🎯 Hackathon Submission

This dApp demonstrates:

- ✅ Integration with Shardeum Unstablenet
- ✅ Smart contract deployment and interaction
- ✅ Modern Web3 UX/UI design
- ✅ Real-world use cases (payments, NFTs, governance)
- ✅ Production-ready code quality
- ✅ Comprehensive documentation

Built with ❤️ for the Shardeum ecosystem!
