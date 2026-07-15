export function HeroSection() {
  return (
    <section className="py-4 flex flex-col md:flex-row justify-between items-start gap-6">
      <div className="max-w-2xl">
        <p className="text-lg text-foreground/80 leading-relaxed">
          <span className="font-semibold text-foreground">Senior software architect</span> —
          deep dives into <span className="text-primary font-medium">distributed systems</span>,
          <span className="text-secondary font-medium"> cloud-native</span> patterns,
          and <span className="text-primary font-medium">secure</span> by design.
          Production-grade write-ups for the pragmatic engineer.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="text-primary">●</span> 12 min read avg
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="text-secondary">●</span> go, rust, typescript
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="text-primary">●</span> k8s, aws, azure
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
        <div className="bg-muted border border-border rounded-lg px-4 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <span className="text-secondary">●</span>
          security audit · <span className="font-mono text-primary">v1.4.2</span>
        </div>
        <div className="bg-muted border border-border rounded-lg px-4 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <span className="text-primary">●</span>
          analytics · <span className="font-mono">6.2k page views (weekly)</span>
        </div>
      </div>
    </section>
  )
}