import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  MapPinned,
  Menu,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Use case', href: '#use-case' },
  { label: 'About', href: '#about' },
];

const features = [
  {
    title: 'Guided symptom capture',
    description: 'A simple mobile workflow helps CHVs record symptoms consistently during community visits.',
    Icon: ClipboardList,
  },
  {
    title: 'Clear risk classification',
    description: 'Cases are grouped as low, moderate, or critical so the next action is easier to understand.',
    Icon: Activity,
  },
  {
    title: 'Facility escalation',
    description: 'Urgent cases can be flagged quickly for referral and follow-up by nearby health facilities.',
    Icon: BellRing,
  },
  {
    title: 'Outbreak visibility',
    description: 'Aggregated reports help health teams notice symptom clusters and respond earlier.',
    Icon: MapPinned,
  },
];

const workflow = [
  'CHV records fever, cough, breathing difficulty, and danger signs',
  'AfyaSignal classifies risk and prepares plain-language guidance',
  'Critical cases are escalated for referral while trends are visible to coordinators',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="AfyaSignal home">
            <img src="/apple-icon.png" alt="" className="size-9 rounded-md" />
            <div className="leading-tight">
              <p className="font-semibold">AfyaSignal</p>
              <p className="text-xs text-muted-foreground">Early action for community health</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Open app
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <details className="group relative md:hidden">
            <summary
              className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-md border bg-background shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </summary>
            <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border bg-popover p-2 text-popover-foreground shadow-md">
              <div className="px-2 py-2">
                <p className="font-semibold">AfyaSignal</p>
                <p className="text-xs text-muted-foreground">Navigate or open the app.</p>
              </div>
              <div className="mt-1 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted">
                    {item.label}
                  </Link>
                ))}
                <Button asChild className="mt-2 w-full">
                  <Link href="/login">Open app</Link>
                </Button>
              </div>
            </div>
          </details>
        </div>
      </header>

      <section className="border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-5 border-primary/25 bg-background text-primary">
              AI-assisted triage for CHVs
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AfyaSignal helps communities act before illness becomes critical.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              A mobile-friendly early warning system for Community Health Volunteers to record symptoms,
              classify risk, and escalate urgent malaria and pneumonia cases faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">
                  Start triage
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#use-case">See workflow</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                ['3 roles', 'CHV, facility, admin'],
                ['Real-time', 'Risk and referral flags'],
                ['Built for field use', 'Clear mobile flows'],
              ].map(([value, label]) => (
                <div key={value} className="border-l-2 border-primary/30 pl-4">
                  <p className="font-semibold text-foreground">{value}</p>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Simple tools for faster field decisions</h2>
          <p className="mt-4 text-muted-foreground">
            AfyaSignal supports the people closest to the patient without pretending to replace clinical diagnosis.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <Card key={title} className="rounded-lg shadow-none">
              <CardHeader>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="border-y bg-muted/20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About us</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Built around early action, not overclaiming AI.</h2>
          </div>
          <div className="space-y-5 text-muted-foreground">
            <p>
              AfyaSignal was inspired by communities where malaria and pneumonia can move from mild symptoms to
              urgent risk quickly. The product focuses on helping CHVs collect the right information, understand
              triage urgency, and refer patients sooner.
            </p>
            <p>
              The AI explanation layer turns rule-based results into calm, plain-language guidance. It supports
              faster decisions while keeping diagnosis and treatment in the hands of trained health professionals.
            </p>
          </div>
        </div>
      </section>

      <section id="use-case" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Use case</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">A CHV visit that can escalate in minutes</h2>
          <p className="mt-4 text-muted-foreground">
            During a household visit, a CHV can capture symptoms, receive a risk level, and send urgent cases to the
            facility team without waiting for paper reports to move through the system.
          </p>
        </div>
        <div className="max-w-4xl rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Smartphone className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Field triage flow</p>
              <p className="text-sm text-muted-foreground">Designed for repeated use on mobile</p>
            </div>
          </div>
          <div className="space-y-4">
            {workflow.map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="pb-4">
                  <p className="font-medium">{item}</p>
                  {index < workflow.length - 1 && <Separator className="mt-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Help teams move from late response to early action.</h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">
              Open the prototype and explore the CHV, facility, and admin workflows built for community triage.
            </p>
          </div>
          <div className="flex items-center">
            <Button asChild size="lg" className="bg-[#fcfcfc] text-primary hover:bg-[#fcfcfc]/90">
              <Link href="/login">
                Open AfyaSignal
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img src="/apple-icon.png" alt="" className="size-9 rounded-md" />
              <div>
                <p className="font-semibold">AfyaSignal</p>
                <p className="text-sm text-muted-foreground">Community health triage and early warning.</p>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            {[
              [Users, 'CHV support'],
              [Building2, 'Facility alerts'],
              [ShieldCheck, 'Responsible AI'],
              [Stethoscope, 'Referral guidance'],
              [CheckCircle2, 'Risk clarity'],
              [MapPinned, 'Cluster insight'],
            ].map(([Icon, label]) => {
              const FooterIcon = Icon as typeof Users;
              return (
                <div key={label as string} className="flex items-center gap-2">
                  <FooterIcon className="size-4 text-primary" />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 AfyaSignal. Built for earlier community health response.</p>
            <p>Decision support only, not a diagnosis tool.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
