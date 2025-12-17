"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MessageSquare, GraduationCap, School, Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "@/lib/theme-context"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export default function LandingPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${theme === "dark" ? "bg-slate-900/70 border-slate-800" : "bg-white/70 border-slate-200"} shadow-sm border-b backdrop-blur-sm`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-xl md:text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            MyResearch
          </h1>

          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="#about"
              className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"} transition`}
            >
              About Research
            </Link>
            <Link
              href="/survey"
              className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"} transition`}
            >
              Survey
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-slate-900"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-slate-900"}`} />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`md:hidden ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border-t`}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"} transition text-lg`}
              >
                About Research
              </Link>
              <Link
                href="/survey"
                onClick={() => setMobileMenuOpen(false)}
                className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"} transition text-lg`}
              >
                Survey
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Abstract Background */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{
          backgroundImage: `url('/images/abstract-background-with-low-poly-design_1048-8478.avif')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-slate-950/80" : "bg-slate-900/70"}`} />
        <div className="relative z-10 container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">{t("title")}</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">{t("subtitle")}</p>
          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
            <Link href="/survey">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>

      {/* About the Research */}
      <section id="about" className={`py-16 px-4 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="container mx-auto max-w-6xl">
          <h3 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {t("aboutTitle")}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <CardContent className="pt-6">
                <h4 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {t("problem")}
                </h4>
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {t("problemText")}
                </p>
              </CardContent>
            </Card>
            <Card className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <CardContent className="pt-6">
                <h4 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {t("socialEngineering")}
                </h4>
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {t("socialEngineeringText")}
                </p>
              </CardContent>
            </Card>
            <Card className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
              <CardContent className="pt-6">
                <h4 className={`text-xl font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {t("aiPrevention")}
                </h4>
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {t("aiPreventionText")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Owner Profile Card */}
      <section className={`py-16 px-4 ${theme === "dark" ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="container mx-auto max-w-4xl">
          <h3 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {t("researchOwner")}
          </h3>
          <Card
            className={`${theme === "dark" ? "bg-slate-800 border-slate-700 shadow-xl" : "bg-white shadow-lg border-slate-200"}`}
          >
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Profile Image - Perfect Circle */}
                <div className="flex-shrink-0">
                  <img
                    src="/images/whatsapp-image-2025-12-14-at-13.31.22.jpeg"
                    alt="Tito Oscar Mwaisengela"
                    className="w-48 h-48 rounded-full object-cover border-4 border-emerald-600 shadow-lg"
                  />
                </div>

                {/* Profile Information */}
                <div className="flex-1 text-center md:text-left">
                  <h4 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    Tito Oscar Mwaisengela
                  </h4>
                  <p className="text-lg text-emerald-600 mb-4">{t("computerScience")}</p>

                  {/* Academic Info */}
                  <div className="mb-6">
                    <div className={`flex items-start gap-2 mb-2 justify-center md:justify-start`}>
                      <GraduationCap
                        className={`w-5 h-5 mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                      />
                      <div>
                        <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                          {t("university")}
                        </p>
                        <p className={theme === "dark" ? "text-slate-400" : "text-slate-700"}>{t("college")}</p>
                        <p className={theme === "dark" ? "text-slate-500" : "text-slate-600"}>{t("degree")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Education Timeline */}
                  <div className="mb-6">
                    <div className={`flex items-start gap-2 justify-center md:justify-start`}>
                      <School className={`w-5 h-5 mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`} />
                      <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-700"}`}>
                        <p>{t("primarySchool")}</p>
                        <p>{t("secondarySchool")}</p>
                        <p>{t("advancedLevel")}</p>
                        <p>{t("university")} – COICT</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className={`w-4 h-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`} />
                      <a
                        href="mailto:titomwaisengela@gmail.com"
                        className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"}`}
                      >
                        titomwaisengela@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className={`w-4 h-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`} />
                      <a
                        href="tel:+255618238986"
                        className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"}`}
                      >
                        +255 618 238 986
                      </a>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MessageSquare className={`w-4 h-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`} />
                      <a
                        href="https://wa.me/255614538424"
                        className={`${theme === "dark" ? "text-slate-300 hover:text-emerald-400" : "text-slate-700 hover:text-emerald-600"}`}
                      >
                        +255 614 538 424 (WhatsApp)
                      </a>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MessageSquare className={`w-4 h-4 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`} />
                      <a
                        href="https://tmdeveloper.netlify.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === "dark" ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-700"} font-semibold`}
                      >
                        {t("portfolioLink")} - tmdeveloper.netlify.app
                      </a>
                    </div>
                  </div>

                  {/* Objective Statement */}
                  <div
                    className={`${theme === "dark" ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"} p-4 rounded-lg border`}
                  >
                    <p className={`leading-relaxed italic ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                      {t("objectiveStatement")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Your Participation Matters */}
      <section className={`py-16 px-4 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="container mx-auto max-w-4xl">
          <h3 className={`text-3xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {t("whyParticipation")}
          </h3>
          <div className="space-y-4">
            <Card
              className={`border-l-4 border-l-emerald-600 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <CardContent className="p-6">
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                  <strong>{t("economicImpact")}:</strong> {t("economicText")}
                </p>
              </CardContent>
            </Card>
            <Card
              className={`border-l-4 border-l-emerald-600 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <CardContent className="p-6">
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                  <strong>{t("communityProtection")}:</strong> {t("communityText")}
                </p>
              </CardContent>
            </Card>
            <Card
              className={`border-l-4 border-l-emerald-600 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <CardContent className="p-6">
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                  <strong>{t("innovation")}:</strong> {t("innovationText")}
                </p>
              </CardContent>
            </Card>
            <Card
              className={`border-l-4 border-l-emerald-600 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <CardContent className="p-6">
                <p className={`leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-800"}`}>
                  <strong>{t("academicExcellence")}:</strong> {t("academicText")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-emerald-600 hover:bg-emerald-700 transition">
        <div className="container mx-auto max-w-3xl text-center">
          <h3 className="text-3xl font-bold text-white mb-6">{t("readyTitle")}</h3>
          <p className="text-emerald-50 text-lg mb-8 leading-relaxed">{t("readyText")}</p>
          <Button asChild size="lg" className="bg-white hover:bg-slate-100 text-emerald-700 px-8 py-6 text-lg">
            <Link href="/survey">{t("startSurvey")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`${theme === "dark" ? "bg-slate-950 text-slate-300" : "bg-slate-900 text-slate-300"} py-8 px-4`}
      >
        <div className="container mx-auto text-center">
          <p className="mb-2">Research by Tito Oscar Mwaisengela</p>
          <p className="mb-2">Developed and Designed by Tito Oscar</p>
          <p className="mb-4">University of Dar es Salaam – COICT</p>
          <a
            href="https://tmdeveloper.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block"
          >
            Portfolio: tmdeveloper.netlify.app
          </a>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <Link
              href="/admin"
              className="text-emerald-400 hover:text-emerald-300 text-sm inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Dashboard
            </Link>
          </div>
          <p className="text-slate-400 mt-4">© {new Date().getFullYear()} MyResearch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
