---
id: collaboration
load: on_demand
version: 1.0.0
---

# Collaboration

The contract for how work crosses boundaries.

Between sessions. Between people. Between AI instances.

No one owns the code. Everyone is responsible.
The moment someone says "that's my code, don't touch it," collaboration is dead.

One fact, one place. Reference freely, but never duplicate.
When the same information lives in two places, one will be wrong.

---

## 1. Commits Tell the Story

**Each commit is a sentence. The log is the narrative.**

A stranger reads the commit log and understands what happened
without opening a single file. That is the standard.

- One commit, one intent. If you cannot describe it in one sentence, split it.
- Commit often. A large uncommitted change is a large unreviewable risk.
- Keep branches short-lived. The longer a branch lives, the harder it merges.
- Message format: `type(scope): what and why`. Subject line under 144 characters. Separate subject and body with a blank line. Body explains the reasoning.
  Bad: `fix auth bug`
  Good: `fix(auth): reject expired tokens — previously returned 200 with stale session`
- The "why" matters more than the "what." Code shows what changed. The message shows why.
- The history is a document. Keep it meaningful. Clean up commit history before opening a PR — squash noise commits, reword unclear messages. "fix typo → fix again → actually fix" is not a history — it is a confession.
- Do not commit generated files, secrets, or environment-specific configuration.

---

## 2. The Pull Request Is the Deliverable

**A pull request is not a formality. It is the finished product of autonomous work.**

If the reviewer must ask "what does this do?" — the PR failed before review began.

- One PR, one topic. Mixed concerns do not get merged.
- The description states: what changed, why, and how to verify.
- If you cannot state the PR's purpose in one sentence, split it.
- The PR must be self-contained. Readable without asking the author.
- When code changes behavior, the documentation updates are part of the same PR.

---

## 3. Handoff Before Exit

**The next person must continue without asking "what happened?"**

The best handoff is no handoff.
When code and tests are clear enough, anyone can continue without a briefing document.
A handoff document is insurance for when the code's self-explanation falls short.
If your handoff consistently has nothing to say, your code quality is winning.

- Every session ends with a handoff. The ritual is mandatory. The content may be minimal.
- handoff/SKILL.md defines the procedure. This section defines the standard.
- A good handoff answers: what was done, what remains, what the next person should know.
- Do not carry context in memory alone. What is not written down does not exist.

---

## 4. Knowledge Compounds

**learning/ is the team's permanent asset. It survives AI changes, team changes, everything.**

Every session that passes without recording a lesson is compound interest lost.
Recording is not overhead — it saves the next person's time.
And the organization's time is the sum of every individual's time.

What goes where:

- `before-you-start/` — Traps and conventions. What bites newcomers.
- `adr/` — Decisions with lessons learned. Immutable once written. Status changes only. Lifecycle: PROPOSED → ACCEPTED → DEPRECATED → SUPERSEDED.
- `cookbook/` — Reusable solutions and patterns. Living documents.
- `postmortem/` — Failures and what they taught.
- `onboarding/` — Materials for newcomers. The guided tour.

Quality standard:

- Each entry must be useful to a stranger. If only the author understands it, rewrite it.
- Do not hoard knowledge in session memory. Anything reusable belongs in learning/.
- Prefer updating an existing document over creating a new one. Avoid fragmentation.
- Update cookbook/ when a pattern evolves, a better approach is found, or a solution no longer applies.
- Blame kills learning. Postmortems fix systems, not individuals. If people hide failures, the same failures repeat.
- Do not auto-delete. Accumulation is the point. Flag staleness, then let humans decide.
- A document not updated and not referenced for an extended period is suspect. Flag it during handoff — do not silently let it rot.

---

## 5. Onboarding Is a First-Class Concern

**The project teaches itself. A newcomer should be productive without the original author.**

If onboarding requires a walkthrough call, the documentation has failed.

Reading order for a new AI or team member:

1. `learning/onboarding/README.md` — Start here.
2. `learning/before-you-start/` — Read before touching code.
3. `context/overview.md` → `context/architecture.md` → `context/boundaries.md`
4. `learning/adr/` — Skim recent decisions.

Onboarding must cover how the project runs, not just how the code is structured.
Operational context — how it is deployed, where it runs, how it fails — is as important as code architecture.

Maintaining onboarding materials:

- When architecture changes, update `onboarding/architecture-tour.md`.
- When a new trap is discovered, add it to `before-you-start/gotchas.md`.
- Treat onboarding materials like tests: if they drift from reality, they are harmful.
- The reading order itself must be maintained. handoff/SKILL.md includes checking whether onboarding materials need updates.

---

## 6. Suggest, Don't Sneak

**Anyone — AI or human — may propose improvements. No one may apply them unilaterally.**

Patterns repeat. Workflows have friction. Conventions become outdated.
Anyone who sees these should speak up. That observation is valuable — if channeled correctly.

Suggestions are welcome. Rejection carries no penalty. The discussion itself is the value.

- Observed a recurring pattern? Propose a cookbook entry.
- Found workflow friction? Document it and suggest a fix.
- Think a convention should change? Propose it explicitly with rationale.
- Channel: record proposals in learning/adr/ with status PROPOSED. Include context, rationale, and alternatives considered. Same channel for AI and humans.
- Never change conventions, workflows, or team agreements without explicit approval.
