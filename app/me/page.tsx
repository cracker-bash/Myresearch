"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, FileText, Filter, Search, LogOut } from "lucide-react"
import jsPDF from "jspdf"
import AdminCSVImport from '@/components/admin/AdminCSVImport'

interface SurveyResponse {
  id: string
  ageRange: string
  mobileMoneyServices: string[]
  transactionFrequency: string
  lostMoney: string
  fraudMethod: string
  amountLost: string
  timeToRealize: string
  guidedOnPhone: string
  callerIdentity: string
  actionsInstructed: string
  emotionalState: string
  helpReceived: string
  trustLevel: string
  warningAdequacy: string
  desireAIPrevention: string
  comfortWithBlocking: string
  preferredProvider: string
  willingnessToUse: string
  openFeedback: string
  submittedAt: string
}

const COLORS = ["#10B981", "#F59E0B", "#0F172A", "#94A3B8", "#64748B"]

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const key = searchParams.get("key")
    if (!key) {
      router.push("/")
      return
    }

    fetchResponses(key)
  }, [searchParams, router])

  const fetchResponses = async (key: string, from?: string, to?: string) => {
    try {
      let url = `/api/survey?key=${key}`
      if (from) url += `&from=${from}`
      if (to) url += `&to=${to}`

      const response = await fetch(url)

      if (response.status === 401) {
        router.push("/")
        return
      }

      const data = await response.json()
      setResponses(data.responses)
      setFilteredResponses(data.responses)
      setIsAuthorized(true)
    } catch (error) {
      console.error("[v0] Error fetching responses:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    const key = searchParams.get("key")
    if (key) {
      fetchResponses(key, fromDate, toDate)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term) {
      setFilteredResponses(responses)
      return
    }

    const filtered = responses.filter((r) => JSON.stringify(r).toLowerCase().includes(term.toLowerCase()))
    setFilteredResponses(filtered)
  }

  const exportToCSV = () => {
    if (filteredResponses.length === 0) return

    const headers = Object.keys(filteredResponses[0]).join(",")
    const rows = filteredResponses.map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `research-responses-${new Date().toISOString()}.csv`
    a.click()
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(15, 23, 42) // slate-900
    doc.text("MyResearch Survey Report", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 10
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139) // slate-500
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" })
    doc.text(`Total Responses: ${responses.length}`, pageWidth / 2, yPosition + 5, { align: "center" })

    yPosition += 20

    // Executive Summary
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Executive Summary", 14, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85) // slate-700
    const summaryData = [
      ["Total Survey Responses", responses.length.toString()],
      ["Affected by Fraud", `${filteredResponses.filter((r) => r.lostMoney === "yes").length} of ${responses.length}`],
      [
        "Would Accept M-PayShield",
        `${filteredResponses.filter((r) => r.willingnessToUse === "Definitely yes" || r.willingnessToUse === "Probably yes").length} of ${responses.length}`,
      ],
      [
        "Most Common Fraud Method",
        filteredResponses.reduce(
          (acc, r) => {
            if (r.fraudMethod) {
              acc[r.fraudMethod] = (acc[r.fraudMethod] || 0) + 1
            }
            return acc
          },
          {} as Record<string, number>,
        ).length > 0
          ? Object.entries(
              filteredResponses.reduce(
                (acc, r) => {
                  if (r.fraudMethod) {
                    acc[r.fraudMethod] = (acc[r.fraudMethod] || 0) + 1
                  }
                  return acc
                },
                {} as Record<string, number>,
              ),
            ).sort((a, b) => b[1] - a[1])[0][0]
          : "N/A",
      ],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 }, // emerald-500
      styles: { fontSize: 10 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // M-PayShield Acceptance Distribution
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("M-PayShield Acceptance Distribution", 14, yPosition)
    yPosition += 8

    const shieldAcceptanceData = filteredResponses.reduce(
      (acc, r) => {
        if (r.willingnessToUse) {
          acc[r.willingnessToUse] = (acc[r.willingnessToUse] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const shieldTableData = Object.entries(shieldAcceptanceData).map(([name, value]) => [
      name,
      value.toString(),
      `${((value / responses.length) * 100).toFixed(1)}%`,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["Response", "Count", "Percentage"]],
      body: shieldTableData,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Fraud Methods Distribution
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Fraud Methods Distribution", 14, yPosition)
    yPosition += 8

    const fraudMethodData = filteredResponses.reduce(
      (acc, r) => {
        if (r.fraudMethod) {
          acc[r.fraudMethod] = (acc[r.fraudMethod] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const fraudTableData = Object.entries(fraudMethodData).map(([name, value]) => [
      name,
      value.toString(),
      `${((value / filteredResponses.filter((r) => r.fraudMethod).length) * 100).toFixed(1)}%`,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["Fraud Method", "Count", "Percentage"]],
      body: fraudTableData,
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11] }, // amber-500
      styles: { fontSize: 10 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Trust in Current Systems
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Trust in Current Security Systems", 14, yPosition)
    yPosition += 8

    const trustLevelData = [
      { name: "Very high", value: filteredResponses.filter((r) => r.trustLevel === "Very high").length },
      { name: "High", value: filteredResponses.filter((r) => r.trustLevel === "High").length },
      { name: "Moderate", value: filteredResponses.filter((r) => r.trustLevel === "Moderate").length },
      { name: "Low", value: filteredResponses.filter((r) => r.trustLevel === "Low").length },
      { name: "Very low", value: filteredResponses.filter((r) => r.trustLevel === "Very low").length },
    ].filter((d) => d.value > 0)

    const trustTableData = trustLevelData.map((item) => [
      item.name,
      item.value.toString(),
      `${((item.value / responses.length) * 100).toFixed(1)}%`,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["Trust Level", "Count", "Percentage"]],
      body: trustTableData,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Desire for AI Prevention
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Desire for AI-Based Fraud Prevention", 14, yPosition)
    yPosition += 8

    const aiDesireData = [
      { name: "Strongly yes", value: filteredResponses.filter((r) => r.desireAIPrevention === "Strongly yes").length },
      { name: "Yes", value: filteredResponses.filter((r) => r.desireAIPrevention === "Yes").length },
      { name: "Maybe", value: filteredResponses.filter((r) => r.desireAIPrevention === "Maybe").length },
      { name: "No", value: filteredResponses.filter((r) => r.desireAIPrevention === "No").length },
      { name: "Strongly no", value: filteredResponses.filter((r) => r.desireAIPrevention === "Strongly no").length },
    ].filter((d) => d.value > 0)

    const aiDesireTableData = aiDesireData.map((item) => [
      item.name,
      item.value.toString(),
      `${((item.value / responses.length) * 100).toFixed(1)}%`,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["Response", "Count", "Percentage"]],
      body: aiDesireTableData,
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 10 },
    })

    // Detailed Responses Table
    doc.addPage()
    yPosition = 20

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Detailed Survey Responses", 14, yPosition)
    yPosition += 8

    const detailedTableData = filteredResponses.map((response) => [
      new Date(response.submittedAt).toLocaleDateString(),
      response.ageRange,
      response.lostMoney,
      response.fraudMethod || "N/A",
      response.willingnessToUse,
      response.trustLevel,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["Date", "Age", "Lost Money", "Fraud Method", "Will Use Shield", "Trust"]],
      body: detailedTableData,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42] }, // slate-900
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 22 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
      },
    })

    // Footer on last page
    const totalPages = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184) // slate-400
      doc.text(
        `University of Dar es Salaam â€“ COICT | Page ${i} of ${totalPages}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        {
          align: "center",
        },
      )
    }

    // Save the PDF
    doc.save(`MyResearch-Report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-700">Loading...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  // Calculate statistics
  const totalResponses = responses.length
  const affectedByFraud = responses.filter((r) => r.lostMoney === "yes").length
  const fraudPercentage = totalResponses > 0 ? Math.round((affectedByFraud / totalResponses) * 100) : 0

  const acceptingShield = responses.filter(
    (r) => r.willingnessToUse === "Definitely yes" || r.willingnessToUse === "Probably yes",
  ).length
  const shieldPercentage = totalResponses > 0 ? Math.round((acceptingShield / totalResponses) * 100) : 0

  // Chart data
  const fraudMethodData = Object.entries(
    responses.reduce(
      (acc, r) => {
        if (r.fraudMethod) {
          acc[r.fraudMethod] = (acc[r.fraudMethod] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }))

  const shieldAcceptanceData = Object.entries(
    responses.reduce(
      (acc, r) => {
        if (r.willingnessToUse) {
          acc[r.willingnessToUse] = (acc[r.willingnessToUse] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, value]) => ({ name, value }))

  const trustLevelData = [
    { name: "Very high", value: responses.filter((r) => r.trustLevel === "Very high").length },
    { name: "High", value: responses.filter((r) => r.trustLevel === "High").length },
    { name: "Moderate", value: responses.filter((r) => r.trustLevel === "Moderate").length },
    { name: "Low", value: responses.filter((r) => r.trustLevel === "Low").length },
    { name: "Very low", value: responses.filter((r) => r.trustLevel === "Very low").length },
  ].filter((d) => d.value > 0)

  const aiDesireData = [
    { name: "Strongly yes", value: responses.filter((r) => r.desireAIPrevention === "Strongly yes").length },
    { name: "Yes", value: responses.filter((r) => r.desireAIPrevention === "Yes").length },
    { name: "Maybe", value: responses.filter((r) => r.desireAIPrevention === "Maybe").length },
    { name: "No", value: responses.filter((r) => r.desireAIPrevention === "No").length },
    { name: "Strongly no", value: responses.filter((r) => r.desireAIPrevention === "Strongly no").length },
  ].filter((d) => d.value > 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">MyResearch Admin</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition text-sm md:text-base">
              Back to Site
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-transparent border-slate-600 text-white hover:bg-slate-800 hover:text-white gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="border-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{totalResponses}</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Affected by Fraud</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{fraudPercentage}%</p>
              <p className="text-sm text-slate-600 mt-1">
                {affectedByFraud} of {totalResponses}
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Accept M-PayShield</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{shieldPercentage}%</p>
              <p className="text-sm text-slate-600 mt-1">
                {acceptingShield} of {totalResponses}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-500">
            <CardHeader>
              <CardTitle className="text-sm text-slate-600">Most Common Fraud</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-slate-900">
                {fraudMethodData.length > 0 ? fraudMethodData.sort((a, b) => b.value - a.value)[0]?.name : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Date Filter & Export */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="from">From Date</Label>
                <Input
                  id="from"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="to">To Date</Label>
                <Input
                  id="to"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleFilter} className="bg-emerald-600 hover:bg-emerald-700">
                  Apply Filter
                </Button>
                <Button onClick={exportToCSV} variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
                <Button onClick={exportPDF} variant="outline" className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

                {/* Import Survey CSV */}
        <AdminCSVImport adminKey={String(searchParams.get('key') || '')} onImported={() => { const key = searchParams.get('key'); if (key) { return fetchResponses(key, fromDate, toDate); } }} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* M-PayShield Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle>M-PayShield Acceptance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={shieldAcceptanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {shieldAcceptanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Fraud Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fraudMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fraudMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trust in Current Systems */}
          <Card>
            <CardHeader>
              <CardTitle>Trust in Current Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trustLevelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Prevention Desire */}
          <Card>
            <CardHeader>
              <CardTitle>Desire for AI Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiDesireData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Survey Responses</span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search responses..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Age Range</TableHead>
                    <TableHead>Lost Money</TableHead>
                    <TableHead>Fraud Method</TableHead>
                    <TableHead>Will Use Shield</TableHead>
                    <TableHead>Trust Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500">
                        No responses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>{new Date(response.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{response.ageRange}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              response.lostMoney === "yes" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {response.lostMoney}
                          </span>
                        </TableCell>
                        <TableCell>{response.fraudMethod || "N/A"}</TableCell>
                        <TableCell>{response.willingnessToUse}</TableCell>
                        <TableCell>{response.trustLevel}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`View full response:\n${JSON.stringify(response, null, 2)}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <p className="mb-2">Admin Dashboard - MyResearch</p>
          <p className="text-slate-400">University of Dar es Salaam â€“ COICT</p>
        </div>
      </footer>
    </div>
  )
}




