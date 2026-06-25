import CharAnimation from "@/components/char-animation";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Terminal,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "Custom Instructions",
    description:
      "Define exact guidelines, behavioral limits, personality traits, and format rules for each standalone helper.",
  },
  {
    icon: MessageSquare,
    title: "Focused Conversations",
    description:
      "Launch separate chat threads that retain memory contextual to the specific assistant and tasks you configure.",
  },
  {
    icon: Terminal,
    title: "Clean Interfaces",
    description:
      "Work inside a highly optimized environment featuring responsive card grids and clean dark dashboard layouts.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create an Agent",
    description:
      "Give it a name and highly specific instructions for a particular domain or task.",
  },
  {
    number: "2",
    title: "Start a Thread",
    description:
      "Initiate a new chat. The agent perfectly remembers its role and rules without repetition.",
  },
  {
    number: "3",
    title: "Iterate & Save",
    description:
      "Tweak instructions anytime. All future conversations will instantly adapt to the new rules.",
  },
];

export default function Landing() {
  return (
    <main className="relative z-10">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] text-foreground mb-6">
            Re-usable AI {" "}
            <CharAnimation
              text="Agents"
              className="text-primary"
            /> {" "}
            tailored for your workflow.
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-10">
            Construct focused AI assistants with custom behavioral rules.
            Turn repeated prompts into standalone, reusable agents that save
            hours of repeated instructions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="h-10 w-[80%] md:w-fit px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-primary/40"
            >
              Build First Agent
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/sign-in"
              className="h-10 w-[80%] md:w-fit px-8 rounded-full border border-border bg-background/40 backdrop-blur-md text-foreground text-xs md:text-sm font-semibold flex items-center justify-center transition-all duration-300 shadow-lg shadow-foreground/5"
            >
              Enter Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl p-8 border border-border bg-background/80 backdrop-blur-md hover:border-primary/30 transition-all duration-500"
              >
                <div
                  className="size-12 rounded-xl mb-6 flex items-center
                  justify-center border border-border bg-foreground/[0.03]
                  group-hover:bg-primary transition-all"
                >
                  <Icon className="size-6 text-primary group-hover:text-primary-foreground" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-4 md:mx-auto px-4 py-12 md:py-24 border border-foreground/5 bg-background/80 backdrop-blur-md rounded-4xl"
      >
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            How Mono Works
          </h2>

          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
            Three simple steps to supercharge your workflow with
            specialized AI assistants.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center p-6">
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2
                text-6xl font-black text-primary/10"
              >
                {step.number}
              </span>

              <div className="relative z-10 mt-6">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>

                <p className="text-xs md:text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="pricing"
        className="max-w-4xl mx-auto px-4 py-24"
      >
        <div className="border border-foreground/5 bg-background/80 backdrop-blur-md rounded-4xl p-10 md:p-14 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
            Start building for free
          </h2>

          <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto mb-8">
            Join thousands of developers and professionals saving hours
            every week with reusable, specialized AI agents.
          </p>

          <Link
            href="/sign-up"
            className="inline-flex h-10 px-8 rounded-full bg-foreground text-background text-xs md:text-sm font-semibold items-center justify-center hover:scale-105 transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}