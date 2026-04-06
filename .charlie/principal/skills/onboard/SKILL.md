---
id: skill-onboard
version: 1.0.0
---

# Onboard

How to bootstrap a project's context from its masterplan.

This skill runs once via `charlie onboard`. It is not repeated.
No agent identity is paired — this is a standalone setup procedure.
If you encounter uncertainty at any step, go to "When to Signal" before proceeding.

---

## Step 1. Read Inputs

Read everything available before generating anything.

- **`context/masterplan.md`** — Required. This is the source of truth for what the project is, why it exists, and what it aims to do. If this file is missing or empty, signal (see "When to Signal").
- **`--context`** — Optional. Additional references provided by the human (existing docs, design specs, external resources). Read them all.
- **Existing codebase** — If code already exists, explore it. If `.x-ray/` or equivalent exists, start there. The masterplan describes intent; the code describes reality. When they conflict, note the discrepancy in the generated files.

---

## Step 2. Generate Context Files

All generated files start as `STATUS: DRAFT`. Write it as the first line of each file.

DRAFT files must not be referenced by AI as authoritative until the human confirms them.

### 2.1 `context/overview.md`

What the project is, in plain language. A newcomer reads this first and knows what they are working on.

Include:

- Project purpose and scope.
- Key terminology specific to this project.
- Current project status — what exists, what is planned, what is not started.

### 2.2 `context/architecture.md`

The technical structure of the project. How it is built, not what it does.

Include:

- Tech stack — languages, frameworks, databases, infrastructure.
- Module/package structure and their responsibilities. Module structure defines the physical boundaries.
- Key abstraction boundaries — the logical contracts between modules. Where one module ends and another begins.
- Data flow — how data moves through the system.
- **Abstraction level** — what is the right level of abstraction for this project? Small composable functions, layered services, or domain-driven modules? The answer differs per project. State it explicitly. Start with a reasonable default. Revise as the project evolves.
- Operational context — how it is deployed, where it runs, how it fails. Code architecture alone is insufficient.

### 2.3 `context/boundaries.md`

What not to do. Constraints that apply regardless of the assignment.

Include:

- Technologies, patterns, or approaches that are explicitly off-limits.
- External services or APIs that must not be called or replaced.
- Architectural decisions that are settled and must not be revisited.

If the masterplan does not specify boundaries, state: "No explicit boundaries defined. Apply engineering.md and security.md defaults."

### 2.4 `context/roadmap.md` (conditional)

Only generate this if the project uses `roadmap: local` mode (set in `config.yaml`).

If not applicable, skip.

---

## Step 3. Generate Onboarding Materials

These go to `learning/onboarding/`. They are the guided tour for newcomers.

### 3.1 `learning/onboarding/README.md`

The reading order. A newcomer follows this list from top to bottom.

Include:

- How the `.charlie/` directory is structured and what each part does — principal/ (immutable principles), agents/ (role definitions), skills/ (procedures), context/ (project state), learning/ (accumulated knowledge), memory/ (session history).
- The reading order per `collaboration.md` Section 5. This file is the starting point. List the remaining steps:

1. `learning/before-you-start/` — Read before touching code.
2. `context/overview.md` → `context/architecture.md` → `context/boundaries.md`
3. `learning/adr/` — Skim recent decisions.

### 3.2 `learning/onboarding/architecture-tour.md`

A walkthrough of the codebase for someone who has never seen it.

- Start from the entry point. Trace the main flow.
- Explain the "why" behind structural choices, not just the "what."
- The tour is a path — what to look at first and in what order. `context/architecture.md` is the map — what is there. Reference the map for details, do not duplicate it.
- If no code exists yet, describe the intended structure based on the masterplan. Mark it clearly: "Based on masterplan — not yet implemented."

---

## Step 4. Present for Review

List every file you generated with a one-line summary of what it contains.

Tell the human:

- All files are STATUS: DRAFT.
- Each file needs human review and confirmation before AI treats it as authoritative.
- To confirm a file, change its status to `STATUS: CONFIRMED`.

---

## When to Signal

Signal when inputs are insufficient to generate useful context.

Triggers:

- **Missing masterplan**: `context/masterplan.md` is absent or empty. Cannot proceed.
- **Ambiguous scope**: The masterplan does not make clear what the project does or what its boundaries are.
- **Contradictory inputs**: The masterplan and `--context` materials conflict.
- **Missing tech stack**: Cannot determine languages, frameworks, or infrastructure from available inputs.
- **Significant divergence**: The existing codebase contradicts the masterplan in ways that affect the generated context files. Do not silently guess which is correct — ask.

When you signal, include:

1. What you were able to determine.
2. What is missing.
3. What you need from the human to proceed.

Use the signal format specified by the execution context.
If none specified, ask the human directly.
