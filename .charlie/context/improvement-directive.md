# Charlie DNA Improvement Directive

> Date: 2026-03-26
> Target: charlie-dna project (github.com/cclss/charlie-dna)
> Related: comprehensive-improvement-plan.md

---

## Working Principles

1. **Follow DNA authoring principles first.** Maintain the style, structure, frontmatter format, and bilingual patterns of existing files.
2. **If this directive conflicts with DNA authoring principles, do not decide on your own — get user confirmation.** E.g.: "The directive says to write it this way, but given the existing SKILL.md structure, this placement feels more natural. Shall I proceed?"
3. Do not delete existing content. **Append-only** principle.
4. Never change formats parsed by CLI (YAML frontmatter, `[VERDICT]` blocks, etc.).
5. Read the target file first before each item, understand the existing structure, then proceed.

---

## Part 1: SKILL/Agent File Improvements (7 items)

### DNA-A3: Fix Plan Structured Format Guide

**Target**: `principal/skills/review/SKILL.md`

**Task**: Add a guide for the Reviewer to write Fix Plans in a structured format when issuing a FAIL verdict.

**Location**: As a subsection under the verdict output instructions.

**Content to add** (adjusted to bilingual style):

```
## Fix Plan Format

When issuing a FAIL verdict, the following structure must be followed:

### fix-item-1
- **Grain**: target grain-id
- **File**: path/to/file.go:line-range
- **Issue**: What is wrong (symptom, cause)
- **Action**: Specific fix instruction
  - Before: `existing code snippet`
  - After: `corrected code snippet`

Rules:
- File path and line number must always be included
- When Before/After code snippets are provided, Implementer can apply them without interpretation
- Specific instructions ("add if err != nil at handler.go:45"), not abstract ones ("improve error handling")
```

**Caution**: Do not change the existing PASS/FAIL verdict format. CLI's `parseVerdict()` parses it.

---

### DNA-A4: Detailed Review 4-Criteria Judgment Guide

**Target**: `principal/skills/review/SKILL.md`

**Task**: Add specific judgment workflows for each of the 4 criteria (Requirements, Semantic consistency, Architecture, Readability).

**Content to add**:

```
## Review Workflow

### Step 1: Orientation
- Get change scope via git diff --stat
- Get actual changes via git diff (when available)
- Check each grain's Do/DoneWhen/OutOfScope

### Step 2: Exploration
- Selectively Read/Grep only suspicious parts of the diff
- Do not read entire files — only the changed parts and their surrounding context

### Step 3: Judgment (per criterion)

1. Requirements fulfillment
   - Check each grain's DoneWhen one by one
   - Specific judgments in the form "DoneWhen condition X is not met"
   - Exclude anything in OutOfScope from FAIL reasons

2. Semantic consistency
   - Only check interface mismatches between grains (function signatures, types, imports)
   - Style consistency is not a FAIL reason (warning only)

3. Architecture alignment
   - Reference context/architecture.md if available
   - If not available, auto-PASS this criterion

4. Readability
   - Only FAIL for "incomprehensible code" — "could be better code" is not a FAIL
   - Naming and lack of comments are warnings (not FAIL)

### Step 4: Verdict
- FAIL if any criterion has a substantive issue
- PASS + warning comment if only minor issues
```

**Key**: Default stance is "PASS if requirements are met, even if not perfect." Prevents conservative judgment (almost always FAIL).

---

### DNA-A5: Strengthen Reviewer Behavioral Instructions

**Target**: `agents/reviewer.md`

**Task**: Add a behavioral rules section to the agent body. Separate from existing role definition.

**Content to add**:

```
## Behavioral Rules

1. Read the code directly — do not judge by diff --stat and git diff alone. For suspicious parts, always verify the original code with the Read tool.
2. DoneWhen is the anchor of judgment — verify each grain's DoneWhen conditions one by one. Met = PASS, not met = FAIL.
3. Ignore OutOfScope — anything in a grain's OutOfScope is not a review target. Do not use it as a FAIL reason.
4. Fix Plans must be immediately executable by Implementer — not abstract instructions like "improve error handling", but file:line + Before/After snippets.
```

**Caution**: agents/reviewer.md has frontmatter (`id`, `model`, etc.) + body structure. Do not touch frontmatter.

**Relationship with A-1 (CLI)**: CLI will provide the full git diff code to the Reviewer prompt. So "don't judge by diff alone" serves as a safety net meaning "even if diff is sufficient, verify the original when needed." Complementary, not conflicting.

---

### DNA-B1: Specify Grain Quality Criteria

**Target**: `principal/skills/plan/SKILL.md`

**Task**: Add a quality criteria section to the grain authoring step. So the Planner knows in advance the criteria CLI's `validate.go` checks post-hoc.

**Content to add**:

```
## Grain Quality Criteria

Each grain must satisfy the following when written:

### Do Field
- At least 20 characters, specific, actionable description
- Start with a verb ("Add...", "Refactor...", "Create...")
- BAD: "error handling" → GOOD: "Add error wrapping to HTTP handlers in internal/api/handler.go"

### DoneWhen Field
- At least 15 characters, verifiable completion criteria
- Include mechanically verifiable conditions in "X works" form
- BAD: "works well" → GOOD: "go test ./internal/api/... passes, /health endpoint returns 200"

### Files Field
- Specify file paths expected to change (at least 1)
- Lets Implementer know where to work in advance

### Complexity Judgment
- S: 1-2 files, minimal logic change, no new patterns
- M: 2-5 files, implementation within existing patterns
- L: 5+ files, new patterns/architecture changes involved
- When in doubt, round up (M is safer than S)
```

---

### DNA-B2: Planner Exploration Strategy Guide

**Target**: `agents/planner.md`

**Task**: Add an exploration strategy section to the body. Prevent over-exploration (reading all files) / under-exploration (guessing without reading).

**Content to add**:

```
## Exploration Strategy

Before breaking an assignment into grains, understand the codebase in this order:

### Phase 1: Understand Overall Structure (1-2 turns)
- Read context/architecture.md
- Read context/overview.md
- Read context/boundaries.md

### Phase 2: Explore Related Code (2-4 turns)
- Directly Read files/modules mentioned in the assignment
- Grep for related functions/types
- Understand existing patterns (how similar functionality is already implemented)

### Phase 3: Confirm Impact Scope (1 turn)
- Finalize list of files to change
- Check whether test files exist
- Check dependencies (imports/callers)

### Self-Check
After writing grains, self-review:
- Is each grain's Do clear enough to "know what to do without reading the code"?
- Does DoneWhen include "mechanically verifiable" criteria?
- Is Files non-empty?
- Are inter-grain dependencies accurate?
```

**Caution**: agents/planner.md also has frontmatter + body structure. Do not touch frontmatter.

---

### DNA-C1: Strengthen Self-verification Checklist

**Target**: `principal/skills/implement/SKILL.md`

**Task**: Make the existing Step 5 Verify checklist more concrete.

**Replace/enhance existing Verify step with**:

```
## Step 5: Verify (mandatory after implementation)

Execute the checklist below and signal completion only after all pass:

1. Build check: Run build command. Must have 0 errors.
2. Test check: Run related tests. Run tests for new code if they exist.
3. DoneWhen verification: Check each grain's DoneWhen conditions one by one.
4. Scope check: Confirm no changes were made to anything in grain's OutOfScope.
   - Verify via git diff --stat that changed files match the grain's Files list
5. Import/dependencies: Confirm newly added imports are cleaned up.

If any fail → fix and re-Verify.
```

**Caution**: Existing Step 5 structure may be consistent with other Steps. Adjust to match existing patterns. If it doesn't fit, confirm with user.

---

### DNA-C2: Strengthen Scope Guard

**Target**: `principal/skills/implement/SKILL.md`

**Task**: Add scope guard rules before the Implement step.

**Content to add**:

```
## Scope Guard (verify before any code change)

- Only perform work specified in the grain's Do field.
- Never modify anything specified in OutOfScope.
- Comply with constraints specified in Boundary.
- Do not perform additional refactoring "for better code."
- Only write test code if explicitly requested in the grain.
- Verify via git diff --stat that changed files match the grain's Files list.
```

**Location**: Just before the Implement step (usually Step 3 or Step 2). Adjust to existing step numbering.

---

## Part 2: Principal Directory Multilingual Split

### Goal

Split the current bilingual (English/Korean) files in `principal/` into **language-specific versions**, so CLI can install only the target language files via `charlie init --lang ko` or `charlie init --lang en`.

### Current State

```
principal/
├── INDEX.md              ← bilingual
├── ai-protocol.md        ← bilingual
├── engineering.md         ← bilingual
├── ...
└── skills/
    ├── plan/SKILL.md      ← bilingual
    ├── implement/SKILL.md
    └── review/SKILL.md
```

### Target Structure

```
principal/                 ← default (same as current, bilingual maintained)
├── INDEX.md
├── ...
└── skills/...

principal-en/              ← English only
├── INDEX.md
├── ...
└── skills/...

principal-ko/              ← Korean only
├── INDEX.md
├── ...
└── skills/...
```

### Behavior (handled by CLI)

- `charlie init` (no --lang): Use `principal/` as-is (existing behavior, bilingual version)
- `charlie init --lang ko`: Install `principal-ko/` contents to `.charlie/principal/` (skip original `principal/`)
- `charlie init --lang en`: Install `principal-en/` contents to `.charlie/principal/`

**CLI's loader.go is unchanged** — always reads from `.charlie/principal/`. Only what gets placed there at init time differs.

### Task Instructions

1. **Keep `principal/`**: Leave current bilingual version as-is. This is the default when `--lang` is not specified.

2. **Create `principal-en/`**: Copy `principal/`, then remove Korean portions from each file to create English-only versions.

3. **Create `principal-ko/`**: Copy `principal/`, then remove English portions from each file to create Korean-only versions.

4. **Apply same to `agents/` directory**: Split into `agents/`, `agents-en/`, `agents-ko/`. (If agents files are also bilingual)

5. **Maintain file structure**: File names, directory structure, and frontmatter format in each language directory must be identical to `principal/`. CLI loads by path.

6. **SKILL.md parsing compatibility**: CLI-parsed text like frontmatter keys and `[VERDICT]` must remain in English regardless of language. (CLI parses English keywords)

### Decisions Needed — Confirm with User

- Cases where the bilingual split criteria are ambiguous (e.g., comments inside code examples, technical terms)
- If `agents/` files are English-only rather than bilingual → whether to separately translate for `agents-ko/`
- If some files are bilingual and others are single-language → how to handle
