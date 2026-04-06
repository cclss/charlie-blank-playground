---
id: skill-handoff
version: 1.0.0
---

# Handoff

How to close a session so the next one starts clean.

This skill is injected at session end. It runs in the current agent's context.
The agent's identity does not change. This adds a closing procedure.

---

## When This Runs

- Session end — ai-protocol.md mandates this.
- `charlie run` completion.
- `/done` command (Agent CLI direct use).

If the session is ending abnormally (context exhaustion, forced termination), skip to Step 6. The session summary is the non-negotiable minimum.

---

## Step 1. Assess What Happened

Before recording anything, know what is worth recording.

- What did you complete?
- What remains unfinished?
- Did you make decisions that a successor would question?
- Did you discover traps, patterns, or failures worth preserving?

If nothing happened worth recording beyond the session summary — say so explicitly. "No learnings to record this session" is a valid answer. Silently skipping is not.

---

## Step 2. Record Decisions

If decisions were already recorded during implementation, verify completeness — do not re-record. This step adds what was missed and elevates decisions to ADRs where warranted.

Two places. Different purposes. Do not mix them.

- **`context/decisions/`** — Fact tracking. What was decided and its current status. Living document — update as status changes. Every decision goes here.

- **`learning/adr/`** — Lesson archive. Why it was decided and what we learned. Immutable once ACCEPTED. Not every decision becomes an ADR — only those where the reasoning or trade-offs teach something. Lifecycle: PROPOSED → ACCEPTED → DEPRECATED → SUPERSEDED.

ADR format: title, status, context, decision, trade-offs, consequences.
ADR filename: next sequence number + decision summary (e.g., `0003-use-facade-for-auth.md`).

Check existing PROPOSED ADRs. If this session's work resolved one, update its status to ACCEPTED.

The test: "Would a stranger benefit from understanding *why* this decision was made?"
If yes → ADR. If the fact alone is enough → `context/decisions/` only.
When in doubt, write the ADR. A surplus of lessons is cheaper than a deficit.

---

## Step 3. Record Learnings

Check each area. Record what applies. Skip what does not.

**`learning/cookbook/`** — Reusable solutions.
- Did a reusable solution emerge? Record it: problem → solution → example → caveats.
- Does an existing cookbook entry need updating? Update it rather than creating a new one.

**`learning/postmortem/`** — Failures and surprises.
- Did something fail or go differently than expected? Record it: what happened → why → what we learned → what to do next time.
- Blame kills learning. Fix systems, not individuals.

**`learning/before-you-start/`** — Traps and conventions.
- New gotcha discovered? Add to `gotchas.md`.
- New implicit rule emerged? Add to `conventions.md`.

---

## Step 4. Check Freshness

Knowledge rots silently. This step prevents it.

- Scan the `learning/` directory listing. Check documents you referenced during this session and any that look relevant but were not referenced.
- If any document is outdated, inaccurate, or no longer relevant — flag it. Add a note at the top: `<!-- STALE: [reason] — flagged [date] -->`.
- Do not delete. Do not auto-fix. Flag and let humans decide.

---

## Step 5. Check Onboarding Materials

If the project changed, the tour must change too.

- Did this session change architecture, introduce new patterns, or alter boundaries?
- If yes: check whether `learning/onboarding/` materials still reflect reality. Small corrections — fix directly. Large rewrites — add to `context/backlog.md`.
- If no changes: skip.

---

## Step 6. Write Session Summary

Write to `memory/`:

- **Completed**: What was done.
- **Incomplete**: What remains and why.
- **Next**: What the next session should know or do first.

This is the minimum. Every session produces this, even if all other steps were skipped.
