# Onboarding

> STATUS: DRAFT

Start here.
An exploration guide for anyone (human or AI) encountering this project for the first time.

---

## .charlie/ Structure

```
.charlie/
├── principal/        Immutable Charlie DNA. Project-independent.
│   ├── INDEX.md        Entry point. Specifies loading order.
│   ├── ai-protocol.md  AI work rules.
│   ├── philosophy.md   Why we work this way.
│   ├── engineering.md  Engineering principles.
│   ├── collaboration.md Collaboration rules.
│   ├── security.md     Security principles.
│   └── skills/         Behavior definitions.
├── agents/           Subagent role definitions. Immutable.
├── override/         Additional directives for principal. Human-authored only.
├── context/          Project state. Living documents.
├── memory/           Session summaries. Auto-recorded by Charlie.
├── config.yaml       Team settings (dna version, mode, etc.).
└── config.local.yaml Local settings (gitignored).
```

---

## Reading Order

1. This file (`learning/onboarding/README.md`)
2. `learning/before-you-start/gotchas.md` — Traps and caveats.
3. `learning/before-you-start/conventions.md` — Implicit rules.
4. `.charlie/context/overview.md` — What the project is.
5. `.charlie/context/architecture.md` — Technical structure.
6. `.charlie/context/boundaries.md` — What not to do.
7. `learning/onboarding/architecture-tour.md` — Architecture comprehension guide.
8. `learning/adr/` — Skim recent decisions.

---

<!-- Populated with project-specific content during onboard -->
