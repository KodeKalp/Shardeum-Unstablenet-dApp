const { ethers } = require("ethers")
const fs = require("fs")
const path = require("path")

async function deployContracts() {
  console.log("🚀 Starting contract deployment to Shardeum Unstablenet...")

  // Connect to Shardeum
  const provider = new ethers.JsonRpcProvider("https://unstablenet.shardeum.org/")

  // You'll need to add your private key here (use environment variable in production)
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY
  if (!privateKey) {
    console.error("❌ Please set DEPLOYER_PRIVATE_KEY environment variable")
    process.exit(1)
  }

  const wallet = new ethers.Wallet(privateKey, provider)
  console.log("📝 Deploying from address:", wallet.address)

  // Check balance
  const balance = await provider.getBalance(wallet.address)
  console.log("💰 Balance:", ethers.formatEther(balance), "SHM")

  if (balance < ethers.parseEther("0.1")) {
    console.error("❌ Insufficient balance. Need at least 0.1 SHM for deployment")
    process.exit(1)
  }

  const deployments = {}

  try {
    // Deploy Payment Contract
    console.log("\n📄 Deploying Payment Contract...")
    const PaymentContract = await ethers.getContractFactory("PaymentContract", wallet)
    const paymentContract = await PaymentContract.deploy()
    await paymentContract.waitForDeployment()
    deployments.PaymentContract = await paymentContract.getAddress()
    console.log("✅ Payment Contract deployed to:", deployments.PaymentContract)

    // Deploy NFT Contract
    console.log("\n🎫 Deploying NFT Ticketing Contract...")
    const NFTContract = await ethers.getContractFactory("EventTicketNFT", wallet)
    const nftContract = await NFTContract.deploy()
    await nftContract.waitForDeployment()
    deployments.NFTContract = await nftContract.getAddress()
    console.log("✅ NFT Contract deployed to:", deployments.NFTContract)

    // Deploy Voting Contract
    console.log("\n🗳️ Deploying Voting Contract...")
    const VotingContract = await ethers.getContractFactory("VotingContract", wallet)
    const votingContract = await VotingContract.deploy()
    await votingContract.waitForDeployment()
    deployments.VotingContract = await votingContract.getAddress()
    console.log("✅ Voting Contract deployed to:", deployments.VotingContract)

    // Save deployment addresses
    const deploymentsPath = path.join(__dirname, "../contracts/deployments.json")
    fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2))

    console.log("\n🎉 All contracts deployed successfully!")
    console.log("📋 Deployment summary:")
    console.log(JSON.stringify(deployments, null, 2))

    console.log("\n📝 Next steps:")
    console.log("1. Update your .env.local file with these contract addresses")
    console.log("2. Run npm run verify:contracts to verify on explorer")
    console.log("3. Test the application with npm run dev")
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

deployContracts().catch(console.error)
