import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Ready to Unlock Repository Insights?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use David Github Analyzer to make better decisions about open source
            projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8">
              Start Analyzing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
