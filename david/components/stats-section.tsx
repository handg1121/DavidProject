import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    number: "50K+",
    label: "Repositories Analyzed",
    description: "Comprehensive insights generated",
  },
  {
    number: "1M+",
    label: "Pull Requests Tracked",
    description: "Detailed PR analytics provided",
  },
  {
    number: "99.9%",
    label: "Uptime Guarantee",
    description: "Reliable service you can trust",
  },
  {
    number: "< 2s",
    label: "Average Analysis Time",
    description: "Lightning-fast insights",
  },
]

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Trusted by Developers Worldwide</h2>
          <p className="text-xl text-muted-foreground">Join thousands of developers who rely on our insights</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-border">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold font-heading text-accent mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
