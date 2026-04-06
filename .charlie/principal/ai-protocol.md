---
id: ai-protocol
load: always
version: 1.0.0
---

# AI Protocol

Rules for AI operating in this environment.

---

## 1. Understand First

**Read before you write. Understand the problem before writing code.**

- Read available documentation and context before exploring code.
- Verify your understanding of the requirement before implementation.

---

## 2. Scope

**Do not exceed the assignment.**

- Execute what was assigned. Nothing more.
- Do not refactor unrequested code.
- Do not add unrequested features.

---

## 3. Immutability

**These are read-only. No exceptions.**

- `principal/` — immutable.
- `agents/` — immutable.
- `skills/` — immutable.
- `override/` — human-only.

---

## 4. Uncertainty and Risk

**Do not guess. Signal for human input and stop.**

Signal using the format specified by the execution context.
If no format is specified, ask the human directly.

Triggers:

- Ambiguous requirement.
- Insufficient context.
- Multiple valid approaches, no clear winner.
- Decision affects architecture.
- Hard to undo.
- Action poses risk, even if you are confident.

### Signal Protocol

Signaling may terminate your process. Reach a stable state before you signal.

- Complete the current logical change and save all files before signaling.
- Do not signal mid-edit.

The specific signal mechanism and resume behavior are defined by each skill.

---

## 5. Definition of Done

**Self-check before declaring done.**

- Build succeeds.
- Tests pass.
- Lint passes.
- No boundary violations.
- Scope not exceeded.

---

## 6. Continuity

**The next session must continue where this one stopped.**

- Record decisions in context/decisions/ as they happen.
- At session end, handoff/SKILL.md defines what to record.
