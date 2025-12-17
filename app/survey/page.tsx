"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { Menu, X } from "lucide-react"

export default function SurveyPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    ageRange: "",
    mobileMoneyServices: [] as string[],
    transactionFrequency: "",
    lostMoney: "",
    fraudMethod: "",
    amountLost: "",
    timeToRealize: "",
    guidedOnPhone: "",
    callerIdentity: "",
    actionsInstructed: "",
    emotionalState: "",
    helpReceived: "",
    trustLevel: "",
    warningAdequacy: "",
    desireAIPrevention: "",
    comfortWithBlocking: "",
    preferredProvider: "",
    willingnessToUse: "",
    openFeedback: "",
  })

  const handleCheckboxChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      mobileMoneyServices: checked
        ? [...prev.mobileMoneyServices, service]
        : prev.mobileMoneyServices.filter((s) => s !== service),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        router.push("/thanks")
      } else {
        alert(
          language === "sw"
            ? "Imeshindwa kutuma majibu. Tafadhali jaribu tena."
            : "Failed to submit survey. Please try again.",
        )
      }
    } catch (error) {
      console.error("[v0] Survey submission error:", error)
      alert(language === "sw" ? "Kosa limetokea. Tafadhali jaribu tena." : "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const surveyTranslations = {
    en: {
      header: "MyResearch",
      backToHome: "Back to Home",
      title: "Research Survey",
      subtitle: "Help us understand mobile money fraud in Tanzania to build better protection systems.",
      consentTitle: "Research Consent",
      consentText:
        "This research is conducted for academic and innovation purposes. All responses are anonymous and confidential.",
      consentAgree: "I understand and agree to participate in this research",
      sectionA: "Section A: Demographics",
      ageRange: "Age Range",
      mobileServices: "Mobile Money Services Used (Select all that apply)",
      frequency: "Frequency of Transactions",
      selectFrequency: "Select frequency",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      rarely: "Rarely",
      sectionB: "Section B: Fraud Experience",
      lostMoney: "Have you ever lost money through mobile money fraud?",
      yes: "Yes",
      no: "No",
      fraudMethod: "Fraud Method",
      selectMethod: "Select method",
      call: "Phone Call",
      sms: "SMS/Text Message",
      ussd: "USSD Code",
      link: "Fake Link/Website",
      other: "Other",
      amountLost: "Approximate Amount Lost (TZS)",
      timeToRealize: "Time Taken to Realize it was Fraud",
      selectTimeframe: "Select timeframe",
      immediately: "Immediately",
      minutes: "Within minutes",
      hours: "Within hours",
      days: "Within days",
      weeks: "After weeks",
      sectionC: "Section C: Social Engineering",
      guidedOnPhone: "Have you ever been guided on the phone to perform a transaction?",
      callerIdentity: "Who did the caller claim to be?",
      callerPlaceholder: "e.g., Bank representative, M-Pesa agent, etc.",
      actionsInstructed: "What actions were you instructed to do?",
      actionsPlaceholder: "Describe the steps you were told to follow...",
      emotionalState: "How did you feel during the incident?",
      selectEmotion: "Select emotional state",
      calm: "Calm and confident",
      confused: "Confused",
      pressured: "Pressured/Rushed",
      scared: "Scared/Worried",
      trusting: "Trusting",
      sectionD: "Section D: Current Protection",
      helpReceived: "Did you receive help from your mobile money provider or bank?",
      fullRecovery: "Yes, full recovery",
      partialRecovery: "Yes, partial recovery",
      noRecovery: "No recovery",
      didNotReport: "Did not report",
      na: "N/A",
      trustLevel: "Trust Level in Current Systems",
      veryHigh: "Very high",
      high: "High",
      moderate: "Moderate",
      low: "Low",
      veryLow: "Very low",
      warningAdequacy: "Are current fraud warnings adequate?",
      clearHelpful: "Yes, they are clear and helpful",
      couldBeBetter: "Somewhat, but could be better",
      confusing: "No, they are confusing or ignored",
      sectionE: "Section E: AI & M-PayShield",
      desireAI: "Would you want AI to prevent fraud BEFORE money is sent?",
      stronglyYes: "Strongly yes",
      maybe: "Maybe",
      stronglyNo: "Strongly no",
      comfortBlocking: "How comfortable are you with AI blocking suspicious transactions?",
      veryComfortable: "Very comfortable",
      comfortable: "Comfortable",
      neutral: "Neutral",
      uncomfortable: "Uncomfortable",
      veryUncomfortable: "Very uncomfortable",
      preferredProvider: "Who would you prefer to provide M-PayShield AI?",
      selectProvider: "Select provider",
      telco: "Mobile Network Operator (Vodacom, Airtel, Tigo, etc.)",
      bank: "Bank or Financial Institution",
      government: "Government Agency",
      private: "Private Tech Company",
      anyProvider: "Any trusted provider",
      willingnessToUse: "Would you use M-PayShield AI if available?",
      definitelyYes: "Definitely yes",
      probablyYes: "Probably yes",
      notSure: "Not sure",
      probablyNo: "Probably no",
      definitelyNo: "Definitely no",
      openFeedback: "Why would you want or not want M-PayShield AI? (Optional)",
      feedbackPlaceholder: "Share your thoughts, concerns, or suggestions...",
      communityTitle: "Community Support",
      communityText:
        "This research depends on community support. After submitting, please help by sharing this research link with others so we can collect more opinions and build a safer financial system together.",
      researchLink: "Research Link:",
      submitButton: "Submit Research Response",
      submitting: "Submitting...",
    },
    sw: {
      header: "Utafiti Wangu",
      backToHome: "Rudi Nyumbani",
      title: "Dodoso la Utafiti",
      subtitle: "Tusaidie kuelewa ulaghai wa fedha za simu huko Tanzania ili kujenga mifumo bora ya ulinzi.",
      consentTitle: "Idhini ya Utafiti",
      consentText: "Utafiti huu unafanywa kwa madhumuni ya kitaaluma na ubunifu. Majibu yote ni siri na hayajulikani.",
      consentAgree: "Ninaelewa na nakubali kushiriki katika utafiti huu",
      sectionA: "Sehemu A: Demografia",
      ageRange: "Kundi la Umri",
      mobileServices: "Huduma za Fedha za Simu Zinazotumika (Chagua zote zinazotumika)",
      frequency: "Mzunguko wa Miamala",
      selectFrequency: "Chagua mzunguko",
      daily: "Kila siku",
      weekly: "Kila wiki",
      monthly: "Kila mwezi",
      rarely: "Mara chache",
      sectionB: "Sehemu B: Uzoefu wa Ulaghai",
      lostMoney: "Je, umewahi kupoteza fedha kupitia ulaghai wa fedha za simu?",
      yes: "Ndiyo",
      no: "Hapana",
      fraudMethod: "Njia ya Ulaghai",
      selectMethod: "Chagua njia",
      call: "Simu",
      sms: "SMS/Ujumbe wa Maandishi",
      ussd: "Msimbo wa USSD",
      link: "Kiungo/Tovuti ya Uongo",
      other: "Nyingine",
      amountLost: "Kiasi cha Karibu Kilichopotea (TZS)",
      timeToRealize: "Muda Uliochukua Kutambua Ilikuwa Ulaghai",
      selectTimeframe: "Chagua muda",
      immediately: "Mara moja",
      minutes: "Ndani ya dakika",
      hours: "Ndani ya masaa",
      days: "Ndani ya siku",
      weeks: "Baada ya wiki",
      sectionC: "Sehemu C: Ujinga wa Kijamii",
      guidedOnPhone: "Je, umewahi kuongozwa simu kufanya muamala?",
      callerIdentity: "Mpigiaji alidai kuwa nani?",
      callerPlaceholder: "k.m., Mwakilishi wa benki, wakala wa M-Pesa, n.k.",
      actionsInstructed: "Uliambiwa kufanya nini?",
      actionsPlaceholder: "Eleza hatua ulizofuata...",
      emotionalState: "Ulihisije wakati wa tukio hilo?",
      selectEmotion: "Chagua hali ya kihemko",
      calm: "Utulivu na ujasiri",
      confused: "Msongamano",
      pressured: "Kulazimishwa/Kuharakishwa",
      scared: "Kuogopa/Kuwa na wasiwasi",
      trusting: "Kuamini",
      sectionD: "Sehemu D: Ulinzi wa Sasa",
      helpReceived: "Je, ulipokea msaada kutoka kwa mtoa huduma wako wa fedha za simu au benki?",
      fullRecovery: "Ndiyo, urejeshaji kamili",
      partialRecovery: "Ndiyo, urejeshaji wa sehemu",
      noRecovery: "Hakuna urejeshaji",
      didNotReport: "Sikuripoti",
      na: "Haihusiki",
      trustLevel: "Kiwango cha Uaminifu katika Mifumo ya Sasa",
      veryHigh: "Juu sana",
      high: "Juu",
      moderate: "Wastani",
      low: "Chini",
      veryLow: "Chini sana",
      warningAdequacy: "Je, maonyo ya sasa ya ulaghai ni ya kutosha?",
      clearHelpful: "Ndiyo, ni wazi na yanasaidia",
      couldBeBetter: "Kiasi fulani, lakini yanaweza kuwa bora zaidi",
      confusing: "Hapana, ni ya kusikitisha au yanapuuzwa",
      sectionE: "Sehemu E: AI na M-PayShield",
      desireAI: "Je, ungependa AI kuzuia ulaghai KABLA ya fedha kutumwa?",
      stronglyYes: "Ndiyo sana",
      maybe: "Labda",
      stronglyNo: "Hapana kabisa",
      comfortBlocking: "Una raha kiasi gani na AI kuzuia miamala inayoshukiwa?",
      veryComfortable: "Raha sana",
      comfortable: "Raha",
      neutral: "Wastani",
      uncomfortable: "Bila raha",
      veryUncomfortable: "Bila raha kabisa",
      preferredProvider: "Ungependa nani kutoa M-PayShield AI?",
      selectProvider: "Chagua mtoa huduma",
      telco: "Mtoa Huduma wa Mitandao ya Simu (Vodacom, Airtel, Tigo, nk.)",
      bank: "Benki au Taasisi ya Kifedha",
      government: "Wakala wa Serikali",
      private: "Kampuni Binafsi ya Teknolojia",
      anyProvider: "Mtoa huduma yeyote wa kuaminika",
      willingnessToUse: "Je, ungetumia M-PayShield AI ikiwa inapatikana?",
      definitelyYes: "Hakika ndiyo",
      probablyYes: "Pengine ndiyo",
      notSure: "Sina uhakika",
      probablyNo: "Pengine hapana",
      definitelyNo: "Hakika hapana",
      openFeedback: "Kwa nini ungependa au usingependa M-PayShield AI? (Hiari)",
      feedbackPlaceholder: "Shiriki mawazo yako, wasiwasi, au mapendekezo...",
      communityTitle: "Msaada wa Jamii",
      communityText:
        "Utafiti huu unategemea msaada wa jamii. Baada ya kuwasilisha, tafadhali saidia kwa kushiriki kiungo hiki cha utafiti na wengine ili tuweze kukusanya maoni zaidi na kujenga mfumo wa kifedha unaosalama pamoja.",
      researchLink: "Kiungo cha Utafiti:",
      submitButton: "Wasilisha Jibu la Utafiti",
      submitting: "Inawasilisha...",
    },
  }

  const st = surveyTranslations[language]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-slate-900">
            {st.header}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-slate-700 hover:text-emerald-600 transition">
              {st.backToHome}
            </Link>
            <LanguageToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <nav className="container mx-auto px-4 py-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-emerald-600 transition text-lg"
              >
                {st.backToHome}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center text-balance">{st.title}</h1>
        <p className="text-slate-700 text-center mb-8 leading-relaxed">{st.subtitle}</p>

        {/* Consent Section */}
        <Card className="mb-8 border-amber-500 bg-amber-50">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{st.consentTitle}</h3>
            <p className="text-slate-800 mb-4 leading-relaxed">{st.consentText}</p>
            <div className="flex items-start gap-3">
              <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} />
              <Label htmlFor="consent" className="text-slate-900 font-medium cursor-pointer">
                {st.consentAgree}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Survey Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section A: Demographics */}
          <Card className={!consent ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{st.sectionA}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">{st.ageRange}</Label>
                <RadioGroup
                  value={formData.ageRange}
                  onValueChange={(value) => setFormData({ ...formData, ageRange: value })}
                  required
                >
                  {["18-25", "26-35", "36-45", "46-55", "56+"].map((age) => (
                    <div key={age} className="flex items-center gap-2">
                      <RadioGroupItem value={age} id={`age-${age}`} />
                      <Label htmlFor={`age-${age}`} className="cursor-pointer">
                        {age}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.mobileServices}</Label>
                <div className="space-y-2">
                  {["M-Pesa", "Tigo Pesa", "Airtel Money", "Halopesa", language === "sw" ? "Nyingine" : "Other"].map(
                    (service) => (
                      <div key={service} className="flex items-center gap-2">
                        <Checkbox
                          id={service}
                          checked={formData.mobileMoneyServices.includes(service)}
                          onCheckedChange={(checked) => handleCheckboxChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.frequency}</Label>
                <Select
                  value={formData.transactionFrequency}
                  onValueChange={(value) => setFormData({ ...formData, transactionFrequency: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={st.selectFrequency} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{st.daily}</SelectItem>
                    <SelectItem value="weekly">{st.weekly}</SelectItem>
                    <SelectItem value="monthly">{st.monthly}</SelectItem>
                    <SelectItem value="rarely">{st.rarely}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Section B: Fraud Experience */}
          <Card className={!consent ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{st.sectionB}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">{st.lostMoney}</Label>
                <RadioGroup
                  value={formData.lostMoney}
                  onValueChange={(value) => setFormData({ ...formData, lostMoney: value })}
                  required
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="lost-yes" />
                    <Label htmlFor="lost-yes" className="cursor-pointer">
                      {st.yes}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="lost-no" />
                    <Label htmlFor="lost-no" className="cursor-pointer">
                      {st.no}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.lostMoney === "yes" && (
                <>
                  <div>
                    <Label className="text-base font-semibold mb-3 block">{st.fraudMethod}</Label>
                    <Select
                      value={formData.fraudMethod}
                      onValueChange={(value) => setFormData({ ...formData, fraudMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={st.selectMethod} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">{st.call}</SelectItem>
                        <SelectItem value="sms">{st.sms}</SelectItem>
                        <SelectItem value="ussd">{st.ussd}</SelectItem>
                        <SelectItem value="link">{st.link}</SelectItem>
                        <SelectItem value="other">{st.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-base font-semibold mb-3 block">
                      {st.amountLost}
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      placeholder={language === "sw" ? "k.m., 50,000" : "e.g., 50,000"}
                      value={formData.amountLost}
                      onChange={(e) => setFormData({ ...formData, amountLost: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">{st.timeToRealize}</Label>
                    <Select
                      value={formData.timeToRealize}
                      onValueChange={(value) => setFormData({ ...formData, timeToRealize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={st.selectTimeframe} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediately">{st.immediately}</SelectItem>
                        <SelectItem value="minutes">{st.minutes}</SelectItem>
                        <SelectItem value="hours">{st.hours}</SelectItem>
                        <SelectItem value="days">{st.days}</SelectItem>
                        <SelectItem value="weeks">{st.weeks}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Section C: Social Engineering */}
          <Card className={!consent ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{st.sectionC}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">{st.guidedOnPhone}</Label>
                <RadioGroup
                  value={formData.guidedOnPhone}
                  onValueChange={(value) => setFormData({ ...formData, guidedOnPhone: value })}
                  required
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="guided-yes" />
                    <Label htmlFor="guided-yes" className="cursor-pointer">
                      {st.yes}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="guided-no" />
                    <Label htmlFor="guided-no" className="cursor-pointer">
                      {st.no}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.guidedOnPhone === "yes" && (
                <>
                  <div>
                    <Label htmlFor="caller" className="text-base font-semibold mb-3 block">
                      {st.callerIdentity}
                    </Label>
                    <Input
                      id="caller"
                      type="text"
                      placeholder={st.callerPlaceholder}
                      value={formData.callerIdentity}
                      onChange={(e) => setFormData({ ...formData, callerIdentity: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="actions" className="text-base font-semibold mb-3 block">
                      {st.actionsInstructed}
                    </Label>
                    <Textarea
                      id="actions"
                      placeholder={st.actionsPlaceholder}
                      value={formData.actionsInstructed}
                      onChange={(e) => setFormData({ ...formData, actionsInstructed: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">{st.emotionalState}</Label>
                    <Select
                      value={formData.emotionalState}
                      onValueChange={(value) => setFormData({ ...formData, emotionalState: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={st.selectEmotion} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calm">{st.calm}</SelectItem>
                        <SelectItem value="confused">{st.confused}</SelectItem>
                        <SelectItem value="pressured">{st.pressured}</SelectItem>
                        <SelectItem value="scared">{st.scared}</SelectItem>
                        <SelectItem value="trusting">{st.trusting}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Section D: Current Protection */}
          <Card className={!consent ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{st.sectionD}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">{st.helpReceived}</Label>
                <RadioGroup
                  value={formData.helpReceived}
                  onValueChange={(value) => setFormData({ ...formData, helpReceived: value })}
                  required
                >
                  {[
                    { value: "Yes, full recovery", label: st.fullRecovery },
                    { value: "Yes, partial recovery", label: st.partialRecovery },
                    { value: "No recovery", label: st.noRecovery },
                    { value: "Did not report", label: st.didNotReport },
                    { value: "N/A", label: st.na },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`help-${option.value}`} />
                      <Label htmlFor={`help-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.trustLevel}</Label>
                <RadioGroup
                  value={formData.trustLevel}
                  onValueChange={(value) => setFormData({ ...formData, trustLevel: value })}
                  required
                >
                  {[
                    { value: "Very high", label: st.veryHigh },
                    { value: "High", label: st.high },
                    { value: "Moderate", label: st.moderate },
                    { value: "Low", label: st.low },
                    { value: "Very low", label: st.veryLow },
                  ].map((level) => (
                    <div key={level.value} className="flex items-center gap-2">
                      <RadioGroupItem value={level.value} id={`trust-${level.value}`} />
                      <Label htmlFor={`trust-${level.value}`} className="cursor-pointer">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.warningAdequacy}</Label>
                <RadioGroup
                  value={formData.warningAdequacy}
                  onValueChange={(value) => setFormData({ ...formData, warningAdequacy: value })}
                  required
                >
                  {[
                    { value: "yes", label: st.clearHelpful },
                    { value: "somewhat", label: st.couldBeBetter },
                    { value: "no", label: st.confusing },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`warn-${option.value}`} />
                      <Label htmlFor={`warn-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Section E: AI & M-PayShield */}
          <Card className={!consent ? "opacity-50 pointer-events-none" : ""}>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">{st.sectionE}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">{st.desireAI}</Label>
                <RadioGroup
                  value={formData.desireAIPrevention}
                  onValueChange={(value) => setFormData({ ...formData, desireAIPrevention: value })}
                  required
                >
                  {[
                    { value: "Strongly yes", label: st.stronglyYes },
                    { value: "Yes", label: st.yes },
                    { value: "Maybe", label: st.maybe },
                    { value: "No", label: st.no },
                    { value: "Strongly no", label: st.stronglyNo },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`ai-${option.value}`} />
                      <Label htmlFor={`ai-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.comfortBlocking}</Label>
                <RadioGroup
                  value={formData.comfortWithBlocking}
                  onValueChange={(value) => setFormData({ ...formData, comfortWithBlocking: value })}
                  required
                >
                  {[
                    { value: "Very comfortable", label: st.veryComfortable },
                    { value: "Comfortable", label: st.comfortable },
                    { value: "Neutral", label: st.neutral },
                    { value: "Uncomfortable", label: st.uncomfortable },
                    { value: "Very uncomfortable", label: st.veryUncomfortable },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`comfort-${option.value}`} />
                      <Label htmlFor={`comfort-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.preferredProvider}</Label>
                <Select
                  value={formData.preferredProvider}
                  onValueChange={(value) => setFormData({ ...formData, preferredProvider: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={st.selectProvider} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telco">{st.telco}</SelectItem>
                    <SelectItem value="bank">{st.bank}</SelectItem>
                    <SelectItem value="government">{st.government}</SelectItem>
                    <SelectItem value="private">{st.private}</SelectItem>
                    <SelectItem value="any">{st.anyProvider}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">{st.willingnessToUse}</Label>
                <RadioGroup
                  value={formData.willingnessToUse}
                  onValueChange={(value) => setFormData({ ...formData, willingnessToUse: value })}
                  required
                >
                  {[
                    { value: "Definitely yes", label: st.definitelyYes },
                    { value: "Probably yes", label: st.probablyYes },
                    { value: "Not sure", label: st.notSure },
                    { value: "Probably no", label: st.probablyNo },
                    { value: "Definitely no", label: st.definitelyNo },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`use-${option.value}`} />
                      <Label htmlFor={`use-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="feedback" className="text-base font-semibold mb-3 block">
                  {st.openFeedback}
                </Label>
                <Textarea
                  id="feedback"
                  placeholder={st.feedbackPlaceholder}
                  value={formData.openFeedback}
                  onChange={(e) => setFormData({ ...formData, openFeedback: e.target.value })}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Community Support Message */}
          <Card className={`border-emerald-500 bg-emerald-50 ${!consent ? "opacity-50 pointer-events-none" : ""}`}>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{st.communityTitle}</h3>
              <p className="text-slate-800 mb-4 leading-relaxed">{st.communityText}</p>
              <div className="bg-white p-3 rounded border border-emerald-600">
                <p className="text-sm font-semibold text-slate-700 mb-1">{st.researchLink}</p>
                <p className="text-emerald-700 font-mono text-sm break-all">https://myresearch.netlify.app</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!consent || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-12 py-6 text-lg w-full md:w-auto"
            >
              {loading ? st.submitting : st.submitButton}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <p className="mb-2">
            {language === "sw" ? "Utafiti na Tito Oscar Mwaisengela" : "Research by Tito Oscar Mwaisengela"}
          </p>
          <p className="mb-2">
            {language === "sw" ? "Chuo Kikuu cha Dar es Salaam – COICT" : "University of Dar es Salaam – COICT"}
          </p>
          <p className="text-slate-400">
            © {new Date().getFullYear()} {language === "sw" ? "Utafiti Wangu" : "MyResearch"}.{" "}
            {language === "sw" ? "Haki zote zimehifadhiwa" : "All rights reserved"}.
          </p>
        </div>
      </footer>
    </div>
  )
}
