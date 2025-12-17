import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Share2 } from "lucide-react"

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            MyResearch
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <Card className="border-emerald-500 shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You for Your Participation!</h1>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Your responses have been successfully submitted. Your contribution is invaluable in helping us
                understand mobile money fraud and building better protection systems for all Tanzanians.
              </p>

              <div className="bg-amber-50 border border-amber-500 rounded-lg p-6 mb-8">
                <Share2 className="w-8 h-8 text-amber-700 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Help Us Reach More People</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Please share this research with your friends, family, and community. The more voices we hear, the
                  better we can protect everyone.
                </p>
                <div className="bg-white p-3 rounded border border-amber-600">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Share this link:</p>
                  <p className="text-emerald-700 font-mono text-sm break-all">https://myresearch.netlify.app</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/survey">Submit Another Response</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="mb-2">Research by Tito Oscar Mwaisengela</p>
          <p className="mb-2">University of Dar es Salaam – COICT</p>
          <p className="text-slate-400">© {new Date().getFullYear()} MyResearch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
