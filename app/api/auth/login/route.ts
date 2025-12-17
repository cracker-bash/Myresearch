import { type NextRequest, NextResponse } from "next/server"

const ADMIN_USERNAME = "mypay-titoresearch@udsm2025-02-00501"
const ADMIN_PASSWORD = "TITO@COICT2025"
const ADMIN_KEY = process.env.ADMIN_KEY || "TITO@COICT2025"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        key: ADMIN_KEY,
      })
    }

    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
