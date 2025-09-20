const fs = require("fs")
const path = require("path")

async function verifyContracts() {
  console.log("🔍 Starting contract verification...")

  const deploymentsPath = path.join(__dirname, "../contracts/deployments.json")

  if (!fs.existsSync(deploymentsPath)) {
    console.error("❌ No deployments.json found. Run npm run deploy:contracts first")
    process.exit(1)
  }

  const deployments = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"))

  console.log("📋 Contract addresses to verify:")
  console.log(JSON.stringify(deployments, null, 2))

  // Note: Shardeum explorer verification would be done manually or via their API
  console.log("\n📝 Manual verification steps:")
  console.log("1. Go to https://explorer-unstablenet.shardeum.org/")
  console.log("2. Search for each contract address")
  console.log("3. Upload the corresponding Solidity source code")
  console.log("4. Verify compilation matches deployed bytecode")

  console.log("\n✅ Verification guide completed")
}

verifyContracts().catch(console.error)
