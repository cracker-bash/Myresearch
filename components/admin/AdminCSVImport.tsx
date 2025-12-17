"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AdminCSVImportProps {
  adminKey: string
  onImported: () => Promise<void> | void
}

export default function AdminCSVImport({ adminKey, onImported }: AdminCSVImportProps) {
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string>("")
  const [errorMsg, setErrorMsg] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMsg("")
    setErrorMsg("")
    const file = e.target.files?.[0]
    if (!file) {
      setFileName("")
      return
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMsg("Please select a .csv file.")
      setFileName("")
      return
    }
    setFileName(file.name)
  }

  const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccessMsg("")
    setErrorMsg("")

    const input = (e.currentTarget.elements.namedItem("csvFile") as HTMLInputElement)
    const file = input?.files?.[0]
    if (!file) {
      setErrorMsg("No file selected.")
      return
    }

    setLoading(true)

    try {
      // Parse CSV in the browser
      const rows = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          complete: (results) => {
            if (results.errors && results.errors.length > 0) {
              reject(new Error(results.errors.map((e) => e.message).join(", ")))
            } else {
              resolve(results.data as any[])
            }
          },
          error: (error) => reject(error),
        })
      })

      if (!rows || rows.length === 0) {
        setErrorMsg("CSV is empty or invalid.")
        setLoading(false)
        return
      }

      // Basic column validation: expect keys matching table columns
      const expectedColumns = [
        "id",
        "age_range",
        "mobile_money_services",
        "transaction_frequency",
        "lost_money",
        "fraud_method",
        "amount_lost",
        "time_to_realize",
        "guided_on_phone",
        "caller_identity",
        "actions_instructed",
        "emotional_state",
        "help_received",
        "trust_level",
        "warning_adequacy",
        "desire_ai_prevention",
        "comfort_with_blocking",
        "preferred_provider",
        "willingness_to_use",
        "open_feedback",
        "submitted_at",
      ] as const

      const cols = Object.keys(rows[0] ?? {})
      const missing = expectedColumns.filter((c) => !cols.includes(c))
      if (missing.length > 0) {
        setErrorMsg(`Missing columns: ${missing.join(", ")}`)
        setLoading(false)
        return
      }

      // Normalize data types where needed (arrays, timestamps)
      const normalized = rows.map((r) => ({
        id: r.id, // UUID provided in CSV; Supabase will accept if valid
        age_range: r.age_range,
        mobile_money_services: Array.isArray(r.mobile_money_services)
          ? r.mobile_money_services
          : typeof r.mobile_money_services === "string" && r.mobile_money_services.includes("[")
          ? JSON.parse(r.mobile_money_services)
          : String(r.mobile_money_services || "").split(";").filter(Boolean),
        transaction_frequency: r.transaction_frequency,
        lost_money: r.lost_money,
        fraud_method: r.fraud_method,
        amount_lost: r.amount_lost,
        time_to_realize: r.time_to_realize,
        guided_on_phone: r.guided_on_phone,
        caller_identity: r.caller_identity,
        actions_instructed: r.actions_instructed,
        emotional_state: r.emotional_state,
        help_received: r.help_received,
        trust_level: r.trust_level,
        warning_adequacy: r.warning_adequacy,
        desire_ai_prevention: r.desire_ai_prevention,
        comfort_with_blocking: r.comfort_with_blocking,
        preferred_provider: r.preferred_provider,
        willingness_to_use: r.willingness_to_use,
        open_feedback: r.open_feedback,
        submitted_at: r.submitted_at,
      }))

      // Admin-only: require adminKey to be present in the page (passed from parent)
      if (!adminKey) {
        setErrorMsg("Unauthorized: missing admin key.")
        setLoading(false)
        return
      }

      // Insert in batches to avoid payload limits
      const supabase = createClient()
      const batchSize = 500
      for (let i = 0; i < normalized.length; i += batchSize) {
        const chunk = normalized.slice(i, i + batchSize)
        const { error } = await supabase.from("survey_responses").upsert(chunk, { onConflict: "id", ignoreDuplicates: true })
        if (error) {
          throw new Error(error.message)
        }
      }

      setSuccessMsg(`Imported ${normalized.length} rows successfully.`)
      setFileName("")
      input.value = ""

      // Trigger parent refresh (stats, charts, table)
      await Promise.resolve(onImported?.())
    } catch (err: any) {
      setErrorMsg(err?.message || "Import failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Import Survey CSV</CardTitle>
      </CardHeader>
      <CardContent>
        {successMsg && (
          <Alert className="mb-4" variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}
        {errorMsg && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Upload CSV</Label>
            <Input id="csvFile" name="csvFile" type="file" accept=".csv" onChange={handleFileChange} />
            {fileName && <p className="text-sm text-slate-500">Selected: {fileName}</p>}
          </div>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? "Importing..." : (
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-4 w-4" /> Import CSV
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

