import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      shardeum: {
        rpcUrl: process.env.NEXT_PUBLIC_SHARDEUM_RPC_URL,
        chainId: process.env.NEXT_PUBLIC_SHARDEUM_CHAIN_ID,
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Health check failed" }, { status: 500 })
  }
}
