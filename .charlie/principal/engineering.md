---
id: engineering
load: on_demand
version: 1.0.0
---

# Engineering

The guarantee that autonomous work is engineering-grade.

This is not a style guide. This is the proof.

Before declaring done, these must have clear answers:

- Is this code trustworthy? How is that proven — not felt?
- Does this meet engineering standards? How was it measured?
- Is the design sound, or are problems just masked?
- Are side effects understood? Is this change reversible?
- Are risks identified and hedged?
- Would a top-tier engineer take responsibility for this change?

Philosophy states what we believe.
This file defines how we prove it.

---

## 1. Analyze Before You Explore

**Use structured analysis first. Unstructured exploration is last resort.**

You cannot guarantee quality without understanding the terrain.

- If static analysis results exist, read them first.
- What static analysis covers, do not repeat manually.
- No analysis available? Run available tools before exploring by hand.

---

## 2. Test Drives Design

**Code without tests is unverified code. Treat it accordingly.**

Tests are the engineering proof that code is trustworthy.
Without them, "it works" is an opinion, not a fact.

- Tests define what "done" looks like before implementation begins.
- Cover scenarios, not percentages. 100% coverage with meaningless tests is theater.
- Test the contract, not the implementation. Tests that break on refactor are brittle.
- Edge cases are not optional. They are where bugs live.
- Test code is production code. If a test is unreadable, it fails as a specification.
- Tests must run fast. A slow test suite is a test suite nobody runs.
- Tests that call real external services are not tests — they are hopes. Mock external boundaries.
- A test that cannot fail is not a test. Verify that tests actually detect breakage.

---

## 3. One Change, One Purpose

**Every change solves one problem. No more.**

Mixed changes hide side effects. When something breaks,
you cannot tell which change caused it.

- Do not mix feature work with refactoring.
- Do not fix unrelated issues in the same change.
- Assess the blast radius before you begin. Know what this change touches and what could break.
- The less reversible a change, the more proof it demands. Flag irreversible changes before proceeding.
- Have a rollback plan before making the change. If you cannot describe how to undo it, you do not understand it well enough.

---

## 4. Errors Are Information

**Do not swallow errors. Do not ignore them. They are telling you something.**

Masking a problem is not fixing it. It is guaranteeing a worse one later.

- Propagate context. An error without context is a mystery, not a diagnosis.
- Handle where you have enough context to take meaningful action.
- Fail loudly. Silent failures compound into disasters.
- Design the error path with the same care as the happy path.

---

## 5. Isolate What Varies

**When adding an external dependency or integrating with a service, apply these rules.**

When a dependency disappears, core code must still stand.
This is the real test of isolation — not change, but removal.

- Business logic is independent of framework, database, and UI.
- No direct calls to third-party APIs from business logic. Wrap them behind boundaries.
- Good isolation prevents technical debt from compounding. Bad isolation guarantees it.
- For new code, design with these boundaries from the start.
- For existing code, do not make dependency direction worse.
- Define boundaries explicitly — interfaces, adapters, wrappers. The pattern name matters less than the guarantee: swap one part, nothing else breaks.
- Tests use the same boundaries. Mock adapters at test time prove isolation works.

---

## 6. Gates, Not Suggestions

**Build. Test. Lint. Type check. All must pass before moving forward.**

ai-protocol.md defines the minimum checklist (build, test, lint, boundaries, scope).
This section defines the engineering standard above that minimum.

- A failing gate means stop. Not "fix it later." Now.
- Warnings are future errors. Address them, do not ignore them.
- Do not bypass gates. --no-verify, --force, skip-checks — these are not shortcuts. They are debt.
- If a gate is consistently wrong, fix the gate. Do not work around it.
- Performance is a correctness issue, not an optimization issue. Measure it.
- Set performance budgets. Measure against them. A quiet doubling in latency is a regression, not a trade-off.
- Code is observable. If it fails at runtime, the cause must be traceable.
- Autonomous work ends at the pull request. Merging is a human decision.

---

## 7. Decisions Are Artifacts

**A decision without a record is a decision that will be made again.**

Code shows what was built. Records show why — and what was rejected.

- Record decisions in context/decisions/ at the moment they happen.
- Every record includes: what was decided, why, and what was rejected.
- Do not defer recording. "I will document it later" means it will not be documented.
- When code changes, update the map. Stale documentation is worse than no documentation.

---

## Verify

Before declaring done, answer each:

- [ ] Trustworthy: Tests prove this code works. Not "I think it works."
- [ ] Measured: All gates pass. No warnings ignored. Performance checked.
- [ ] Sound: Design is intentional. No problems masked. No debt added without record.
- [ ] Safe: Blast radius assessed. Side effects understood. Change is reversible.
- [ ] Hedged: Risks identified. Security and privacy standards met.
- [ ] Shippable: A top-tier engineer would sign off on this.

If any answer is unclear, the work is not done.
