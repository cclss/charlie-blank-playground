---
id: skill-plan
version: 1.0.0
---

# Plan

How to turn an assignment into grains.

This skill is injected alongside `agents/planner.md`.
The agent defines who you are. This defines how you work.
If you encounter uncertainty at any step, go to "When to Signal" before proceeding.

---

## Step 1. Gather

Read before you think.

- **Assignment**: Read the assignment in full. Identify the goal, constraints, and success criteria.
- **Context**: Read `context/overview.md` and `context/architecture.md`. Know what this project is and how it is built.
  If `context/architecture.md` is DRAFT or absent, explore the codebase directly to understand the structure.
- **Boundaries**: Read `context/boundaries.md`. Know what not to do.
- **Static analysis**: If `.x-ray/` or equivalent exists, read `summary.md` and `graph.json` first. They reflect the actual code structure more accurately than documentation. Use them over `architecture.md` when they conflict.
  If no analysis exists, explore the codebase directly. Static analysis first, LLM exploration last.
- **Prior decisions**: Read `context/decisions/` for decisions relevant to this assignment.
- **`--context`**: If additional references are provided, read them.

---

## Step 2. Assess

Decide complexity before decomposing.

- **Simple**: Single concern. Single session. No human decision needed. No ambiguity.
  → 1 grain. Skip to Step 4.

- **Complex**: Affects more than one abstraction boundary, requires cross-cutting changes, or needs human decisions.
  → Proceed to Step 3.

- **Unplannable**: Goals undefined. Success criteria missing. Requirements contradict.
  → Signal what must be resolved before planning can begin. Do not plan.

---

## Quality Amplification

This section activates only when the assignment contains the `[QUALITY AMPLIFICATION]` marker.

If the marker is absent, skip this section entirely and proceed to Decompose.

When active, assess what would make the result excellent — not just correct — before decomposing.

### Calibration

Assess the assignment and apply the appropriate level:

- **Low**: Internal tools, backend APIs, infrastructure.
  Well-crafted code with good edge-case handling.

- **Medium**: Team-facing UI, dashboards, internal tools with users.
  Consistent design, basic polish.

- **High**: Public-facing products, demos, portfolio projects, open-ended assignments.
  Exceptional aesthetic sense. Critics give a standing ovation.
  Visual details: gradients, micro-interactions, transitions — balance of simplicity and brilliance.
  Research the best existing implementations and surpass them.

Short, open-ended assignment → lean toward High.
Detailed technical specs → lean toward Low.
User-facing output → raise the level. Internal infrastructure → lower it.

### Encoding quality into grains

Embed quality criteria into each grain's DoneWhen.

BAD: "Board renders correctly"
GOOD: "Board renders with smooth piece movement, ghost piece preview, and visual feedback for line clears"

Never write "animations — can be added later" in OutOfScope. Quality is now, not later.

---

## Step 3. Decompose

Split along natural fault lines.

1. **Identify concerns**. List the distinct things the assignment asks for.
2. **Map to boundaries**. Each concern should align with an abstraction boundary in `context/architecture.md`. Check whether a concern fits within one module or crosses modules. Cross-cutting concerns need explicit handling — either their own grain or clear instructions within each affected grain.
3. **Find interaction points**. Where does a human need to decide? Those are grain boundaries. Not mid-grain pauses.
4. **Define each grain**. Per `agents/planner.md` Grain Design: what to do, what is out of scope, abstraction boundary, affected files, definition of done.
5. **Order grains**. Maximize independence. If a dependency is unavoidable, make it explicit. Put the most uncertain grain first — learn early, adjust the rest. The suggested execution order must work for serial execution.

---

## Step 4. Write the Plan

Output to `context/runs/{session-id}/plan.md`:

```
# Plan

## Assignment summary
One paragraph. What was asked and why.

## Grains

### grain-1: [title]
- **Do**: ...
- **Out of scope**: ...
- **Boundary**: ...
- **Files**: ...
- **Done when**: ...
- **Complexity**: S | M | L
- **interact_before**: true | false
- **Depends on**: (none) | grain-N

(repeat per grain)

## Execution order
1. grain-1
2. grain-2
...
```

---

## Grain Quality Criteria

Each grain must satisfy the following criteria when written.

### Do field

- Minimum 20 characters. Concrete and actionable.
- Start with a verb ("Add...", "Refactor...", "Create...").
- BAD: "Error handling" → GOOD: "Add error wrapping to HTTP handlers in `internal/api/handler.go`"

### DoneWhen field

- Minimum 15 characters. Must include mechanically verifiable conditions.
- Use the form "X works" or "X passes."
- BAD: "Works well" → GOOD: "`go test ./internal/api/...` passes, `/health` endpoint returns 200"

### Files field

- List file paths expected to change (minimum 1).
- Lets the implementer know where to work before starting.

### Complexity judgment

- **S**: 1-2 files, minimal logic change, no new patterns.
- **M**: 2-5 files, implementation within existing patterns.
- **L**: 5+ files, new patterns or architectural changes.
- When in doubt, round up (S → M is safer than M → S).

---

## When to Signal

Signal when you lack information to make a sound plan.

Triggers:

- **Ambiguous goal**: The assignment can be interpreted in more than one valid way.
- **Missing constraint**: A decision is needed that the assignment does not cover.
- **Conflicting inputs**: `--plan`, `context/`, or `--context` contain contradictions.
- **Scope too large**: The assignment cannot be completed within a reasonable grain count. Clarify scope or split the assignment itself.

When you signal, include:

1. What you know so far.
2. What is missing or unclear.
3. Options you see, with trade-offs.

Use the signal format specified by the execution context.
If none specified, ask the human directly.
