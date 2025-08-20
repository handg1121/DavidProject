"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, FileText, Copy, Check } from "lucide-react"

export function APIDemoSection() {
	const [isLoading, setIsLoading] = useState(false)
	const [copied, setCopied] = useState(false)
	const [requestPayload, setRequestPayload] = useState(`{
  "repository": "facebook/react",
  "analysis_type": "comprehensive",
  "include_prs": true,
  "include_releases": true,
  "timeframe": "30d"
}`)

	const [response, setResponse] = useState(`{
  "repository": "facebook/react",
  "summary": "React is a JavaScript library for building user interfaces with 220k+ stars and active development.",
  "stars": 220847,
  "cool_facts": [
    "Most starred JavaScript library on GitHub",
    "Created by Facebook in 2013",
    "Powers millions of websites worldwide"
  ],
  "latest_prs": [
    {
      "title": "feat: Add React 19 concurrent features",
      "author": "gaearon",
      "merged_at": "2024-01-15",
      "impact": "high"
    },
    {
      "title": "fix: Resolve memory leak in useEffect",
      "author": "sebmarkbage", 
      "merged_at": "2024-01-14",
      "impact": "medium"
    }
  ],
  "version_updates": {
    "latest": "18.2.0",
    "previous": "18.1.0",
    "release_notes": "Bug fixes and performance improvements"
  },
  "analysis_date": "2024-01-16T10:30:00Z"
}`)

	const handleSendRequest = async () => {
		setIsLoading(true)

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000))

		try {
			const payload = JSON.parse(requestPayload)
			// Simulate different responses based on repository
			if (payload.repository === "vercel/next.js") {
				setResponse(`{
  "repository": "vercel/next.js",
  "summary": "Next.js is a React framework for production with 118k+ stars and rapid development.",
  "stars": 118234,
  "cool_facts": [
    "Most popular React framework",
    "Used by Netflix, Uber, and Airbnb",
    "Supports both SSR and SSG"
  ],
  "latest_prs": [
    {
      "title": "feat: App Router improvements",
      "author": "timneutkens",
      "merged_at": "2024-01-15",
      "impact": "high"
    }
  ],
  "version_updates": {
    "latest": "14.0.4",
    "previous": "14.0.3",
    "release_notes": "Performance optimizations and bug fixes"
  },
  "analysis_date": "2024-01-16T10:30:00Z"
}`)
			} else {
				// Keep the default React response for other repos
				setResponse(response)
			}
		} catch (error) {
			setResponse(`{
  "error": "Invalid JSON payload",
  "message": "Please check your request format"
}`)
		}

		setIsLoading(false)
	}

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<section className="py-24 bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<Badge variant="outline" className="mb-4">
						Live API Demo
					</Badge>
					<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Try Our API in Action</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Experience the power of David Github Analyzer with a live API demonstration. Edit the request payload and
						see real-time insights.
					</p>
				</div>

				<div className="max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-8">
						{/* Request Panel */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Play className="h-5 w-5 text-accent" />
											API Request
										</CardTitle>
										<CardDescription>Edit the payload and send a request to our API</CardDescription>
									</div>
									<Button variant="outline" size="sm">
										<FileText className="h-4 w-4 mr-2" />
										Documentation
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="flex items-center justify-between mb-2">
										<label className="text-sm font-medium">Request Payload</label>
										<Button variant="ghost" size="sm" onClick={() => copyToClipboard(requestPayload)}>
											{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
										</Button>
									</div>
									<Textarea
										value={requestPayload}
										onChange={(e) => setRequestPayload(e.target.value)}
										className="font-mono text-sm min-h-[200px]"
										placeholder="Enter your API request payload..."
									/>
								</div>
								<Button onClick={handleSendRequest} disabled={isLoading} className="w-full">
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Analyzing Repository...
										</>
									) : (
										<>
											<Play className="h-4 w-4 mr-2" />
											Send Request
										</>
									)}
								</Button>
							</CardContent>
						</Card>

						{/* Response Panel */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
									API Response
								</CardTitle>
								<CardDescription>Live response from David Github Analyzer API</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="relative">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium">Response Data</span>
										<Button variant="ghost" size="sm" onClick={() => copyToClipboard(response)}>
											{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
										</Button>
									</div>
									<div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-auto max-h-[300px]">
										<pre className="whitespace-pre-wrap text-foreground">
											{JSON.stringify(JSON.parse(response), null, 2)}
										</pre>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Examples removed */}
				</div>
			</div>
		</section>
	)
} 