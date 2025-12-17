import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const ADMIN_KEY = process.env.ADMIN_KEY || "change-this-secret-key"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    // Insert survey response into Supabase
    const { data: response, error } = await supabase
      .from("survey_responses")
      .insert({
        age_range: data.ageRange,
        mobile_money_services: data.mobileMoneyServices,
        transaction_frequency: data.transactionFrequency,
        lost_money: data.lostMoney,
        fraud_method: data.fraudMethod,
        amount_lost: data.amountLost,
        time_to_realize: data.timeToRealize,
        guided_on_phone: data.guidedOnPhone,
        caller_identity: data.callerIdentity,
        actions_instructed: data.actionsInstructed,
        emotional_state: data.emotionalState,
        help_received: data.helpReceived,
        trust_level: data.trustLevel,
        warning_adequacy: data.warningAdequacy,
        desire_ai_prevention: data.desireAIPrevention,
        comfort_with_blocking: data.comfortWithBlocking,
        preferred_provider: data.preferredProvider,
        willingness_to_use: data.willingnessToUse,
        open_feedback: data.openFeedback,
        submitted_at: data.submittedAt,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: "Failed to save response" }, { status: 500 })
    }

    console.log("[v0] Survey response saved to Supabase:", response.id)

    return NextResponse.json({ success: true, id: response.id })
  } catch (error) {
    console.error("[v0] Error saving survey response:", error)
    return NextResponse.json({ success: false, error: "Failed to save response" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const adminKey = request.nextUrl.searchParams.get("key")

  if (adminKey !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Optional date filtering
    const fromDate = request.nextUrl.searchParams.get("from")
    const toDate = request.nextUrl.searchParams.get("to")

    let query = supabase.from("survey_responses").select("*").order("submitted_at", { ascending: false })

    if (fromDate) {
      query = query.gte("submitted_at", fromDate)
    }

    if (toDate) {
      query = query.lte("submitted_at", toDate)
    }

    const { data: responses, error } = await query

    if (error) {
      console.error("[v0] Error fetching responses:", error)
      return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
    }

    return NextResponse.json({ responses: responses || [], total: responses?.length || 0 })
  } catch (error) {
    console.error("[v0] Error in GET handler:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
