import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, Star, GitPullRequest, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Smart Summaries",
    description:
      "Get AI-powered summaries of any repository including purpose, tech stack, and key features in seconds.",
  },
  {
    icon: Star,
    title: "Star Analytics",
    description:
      "Track star growth over time, identify trending periods, and understand what drives repository popularity.",
  },
  {
    icon: GitPullRequest,
    title: "PR Intelligence",
    description: "Analyze pull request patterns, contributor activity, and identify the most impactful changes.",
  },
  {
    icon: BarChart3,
    title: "Growth Metrics",
    description: "Comprehensive analytics on commits, contributors, issues, and project health indicators.",
  },
  {
    icon: Zap,
    title: "Cool Facts Discovery",
    description: "Uncover interesting statistics and hidden insights about repositories that others miss.",
  },
  {
    icon: Shield,
    title: "Version Tracking",
    description: "Stay updated with latest releases, breaking changes, and important version updates.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            Powerful Features for Repository Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand and analyze GitHub repositories at scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-2 bg-accent/10 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="font-heading">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
