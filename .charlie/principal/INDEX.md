---
id: index
load: always
version: 1.0.0
---

# INDEX

This is the map. Use it.

Every file has a purpose. Every file has a time.

---

## Loading

**Always — load with this file:**
- `ai-protocol.md` — Rules for AI.

**Before writing code:**
- `engineering.md` — Engineering standards.

**Before security-sensitive work:**
- `security.md` — When work touches authentication, authorization, cryptography,
  external APIs, user data, secrets, or system boundaries.

**Before handoff:**
- `collaboration.md` — Commits, PRs, handoff, knowledge recording.

**When needed:**
- `philosophy.md` — When you need to understand the "why" behind the rules.

**By role — the execution context assigns your role:**
- `skills/plan/SKILL.md` — Planning.
- `skills/implement/SKILL.md` — Implementation.
- `skills/review/SKILL.md` — Review.
- `skills/handoff/SKILL.md` — Session end.
- `skills/onboard/SKILL.md` — Project onboarding. One-time.

---

## Principles at a Glance

Section titles are the tenets. The summary lives here. The detail lives in each file.

### philosophy.md
1. Discipline Is Freedom, Discipline Is Speed
2. Human Oversight Is a Feature
3. Question the Premise
4. Document First, Code Second
5. Convention Over Configuration
6. Compose Small Things
7. Earn Complexity
8. Standards Outlive Vendors
9. Write Everything Down
10. Engineering, Not Vibes

### ai-protocol.md
1. Understand First
2. Scope
3. Immutability
4. Uncertainty and Risk
5. Definition of Done
6. Continuity

### engineering.md
1. Analyze Before You Explore
2. Test Drives Design
3. One Change, One Purpose
4. Errors Are Information
5. Isolate What Varies
6. Gates, Not Suggestions
7. Decisions Are Artifacts

### collaboration.md
1. Commits Tell the Story
2. The Pull Request Is the Deliverable
3. Handoff Before Exit
4. Knowledge Compounds
5. Onboarding Is a First-Class Concern
6. Suggest, Don't Sneak

### security.md
1. Secrets Are Not Code
2. Trust Nothing External
3. Least Privilege
4. Authentication and Authorization Are Separate
5. Protect Data at Every Stage
6. Dependencies Are Attack Surface
7. Fail Secure

---

## Boundaries

`principal/`, `agents/`, `skills/` are read-only. AI does not modify them.

`override/` is human-only. When override/ contains a file with the same name
as a principal/ file, override content appends as additional instructions.
Override wins on conflict.
