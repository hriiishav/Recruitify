import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Briefcase, Users, ClipboardList, TrendingUp, Zap, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Briefcase,
    title: "Job Management",
    description: "Create, edit, and manage job postings with drag-and-drop reordering and advanced filtering.",
    href: "/jobs",
  },
  {
    icon: Users,
    title: "Candidate Pipeline",
    description: "Track 1000+ candidates through your hiring pipeline with kanban boards and detailed profiles.",
    href: "/candidates",
  },
  {
    icon: ClipboardList,
    title: "Assessment Builder",
    description: "Build custom assessments with conditional logic, multiple question types, and live preview.",
    href: "/assessments",
  },
]

const stats = [
  { label: "Active Jobs", value: "25+", icon: TrendingUp },
  { label: "Candidates", value: "1,000+", icon: Users },
  { label: "Assessments", value: "50+", icon: ClipboardList },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative mx-auto max-w-7xl">
            <div className="text-center animate-fade-in-up">
              <h1 className="text-4xl sm:text-6xl font-bold text-balance mb-6">
                Premium{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Recruitment
                </span>{" "}
                Platform
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
                Streamline your hiring process with industry-level tools for job management, candidate tracking, and
                custom assessments. Built for modern recruitment teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="premium-button" asChild>
                  <Link href="/jobs">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="premium-button bg-transparent">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card
                    key={stat.label}
                    className="premium-card text-center"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need to <span className="text-primary">hire better</span>
              </h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Powerful features designed for modern recruitment teams who demand excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.title}
                    className="premium-card group cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                      <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80" asChild>
                        <Link href={feature.href}>
                          Explore feature
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="premium-card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/20 rounded-full">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4">Ready to transform your hiring?</h3>
                <p className="text-xl text-muted-foreground mb-8 text-pretty">
                  Join forward-thinking companies using Recruitify to build exceptional teams.
                </p>
                <Button size="lg" className="premium-button" asChild>
                  <Link href="/jobs">
                    Start Managing Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
