---
id: skill-review
version: 1.0.0
---

# Review

How to verify a completed assignment.

This skill is injected alongside `agents/reviewer.md`.
The agent defines who you are. This defines how you work.

---

## What You Have

The code has already passed `charlie doctor --quick` (Integrity, Discipline, Craftsmanship, Autonomy — the mechanical 4 axes).
Build, test, lint, boundary checks — all green. Mechanical checks are done.
Do not re-verify what machines already verified.

Your job starts where machines stop. You judge. You do not fix.

---

## Step 1. Understand the Assignment

Before judging the code, understand what was asked.

- Read the original assignment.
- Read `context/runs/{session-id}/plan.md`. Know the grain structure and intended design.
- Read `context/architecture.md`. Know the project's technical direction.
- Read `context/decisions/` for decisions made during implementation.

---

## Step 2. Review the Whole

Individual grains may each look fine. Your job is the sum.

Evaluate in this order. Most likely to fail first — stop early if you can.

**1. Requirement fulfillment:**
- Does this implementation do what the assignment asked? Not something close — exactly what was asked.
- Are there missing cases? Unhandled errors? Ignored edge cases?

**2. Semantic coherence:**
- When all grains are combined, does the result make sense as one unit?
- Do grain interfaces align? No mismatched types, contracts, or assumptions?

**3. Architectural alignment:**
- Does the implementation follow the direction in `context/architecture.md`?
- Are decisions recorded in `context/decisions/`? Are they sound — consistent with `architecture.md` and with trade-offs made explicit?

**4. Readability:**
- Can the next AI or team member pick this up and continue without asking what happened?

**5. Craftsmanship:**
- Would the result impress when presented to its audience?
- For UI: visual completeness, consistency, polish.
- For code: edge-case coverage, error handling, API ergonomics.
- This criterion produces **warnings only**, not FAIL verdicts. Functional completion takes priority.

---

## Step 3. Judge

**PASS:**
All criteria met. A senior engineer would approve this PR. You would ship this without embarrassment.

Output: `PASS` with a brief summary of what was verified.

**FAIL:**
One or more criteria not met.

Output:

1. Which criteria failed and why.
2. Which grains are affected.
3. A `fix-plan.md` — what needs to change and why.

---

## Review Workflow Guide

A reference for how to approach each review systematically.

### Phase 1: Orientation

- `git diff --stat` to understand the scope of changes.
- `git diff` to read the actual changes (when available).
- Check each grain's Do / DoneWhen / OutOfScope.

### Phase 2: Exploration

- Selectively Read/Grep only the suspicious parts from the diff.
- Do not read entire files — only the changed parts and their surrounding context.

### Phase 3: Judgment (5 criteria)

**1. Requirements fulfillment:**
- Check each grain's DoneWhen one by one.
- State judgment concretely: "DoneWhen condition X is not met."
- Anything in OutOfScope is excluded from FAIL reasons.

**2. Semantic consistency:**
- Check only interface mismatches between grains (function signatures, types, imports).
- Style consistency is not a FAIL reason (warning only).

**3. Architecture alignment:**
- Reference `context/architecture.md` if it exists.
- If it does not exist, this criterion is an automatic PASS.

**4. Readability:**
- Only FAIL for "incomprehensible code" — not for "could be better code."
- Naming issues and lack of comments are warnings, not FAIL reasons.

**5. Craftsmanship:**
- Is the output portfolio-quality or homework-quality?
- This is a warning, not a FAIL criterion.

### Phase 4: Verdict

- If any FAIL-eligible criterion (1–4) has a substantive problem → FAIL.
- If only minor issues exist → PASS + warning comments.

**Default stance: if requirements are met, PASS — even if the code is not perfect.**

---

## Fix-Plan

The fix-plan must be actionable. The implementer executes it without guessing.

```
# Fix Plan

## Failed criteria
- [criterion]: [what is wrong and why]

## Affected grains
- grain-N: [what needs to change]

## Instructions
For each affected grain:
- What to fix.
- Why it is wrong.
- What "fixed" looks like.
```

Even for cross-grain issues, break the fix into per-grain instructions. The orchestrator re-executes grain by grain.

Do not write vague instructions. Be specific enough for the implementer to execute without guessing.

Bad: "Improve error handling."
Good: "Add timeout handling to the HTTP client in `auth/client.go` — currently a hung request blocks the grain indefinitely."

Bad: "Fix the interface mismatch."
Good: "grain-1 returns user ID as `string`, grain-2 expects `int`. Align on `string` in grain-2's `handler.go` — grain-1's contract is correct per the API spec."

### Structured Fix Plan Format

When writing a FAIL fix-plan, follow this structure for each fix item:

```
### fix-item-1
- **Grain**: target grain-id
- **File**: path/to/file.go:line-range
- **Issue**: what is wrong (symptom and cause)
- **Action**: specific fix instruction
  - Before: `existing code snippet`
  - After: `fixed code snippet`
```

Rules for fix items:

- File path and line number must always be included.
- When Before/After code snippets are provided, the implementer can apply the fix without interpretation.
- Give concrete instructions, not abstract ones.

Bad: "Improve error handling."
Good: "Add `if err != nil` check at `handler.go:45`."

Bad: "Fix the test."
Good: "In `handler_test.go:120`, change expected status from `200` to `201` — the handler now returns Created."
