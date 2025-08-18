import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with repository analysis",
    features: ["5 repository analyses per month", "Basic summaries and insights", "Star tracking", "Community support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For developers who need comprehensive insights",
    features: [
      "Unlimited repository analyses",
      "Advanced AI summaries",
      "PR intelligence & analytics",
      "Cool facts discovery",
      "Version tracking",
      "Priority support",
      "Export capabilities",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and organizations at scale",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "Custom integrations",
      "Advanced analytics dashboard",
      "Bulk repository analysis",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-border ${plan.popular ? "ring-2 ring-accent" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="font-heading text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold font-heading">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-accent hover:bg-accent/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
