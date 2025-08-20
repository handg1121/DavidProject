import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Star, GitPullRequest, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            Unlock Deep Insights from Any <span>GitHub Repository</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Get comprehensive summaries, track stars, discover cool facts, and analyze pull requests with our powerful
            GitHub repository analyzer. Make data-driven decisions about open source projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8">
              Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-card rounded-lg">
                <Github className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">Repository Analysis</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-card rounded-lg">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">Star Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-card rounded-lg">
                <GitPullRequest className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">PR Insights</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-card rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm font-medium">Growth Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
