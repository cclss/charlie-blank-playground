# AGENTS.md

> STATUS: CONFIRMED

This project uses the Charlie system.
This file is the first entry point read by the Agent CLI.

---

## Startup

1. Check `.charlie/override/`. If an active override exists, follow it first.
2. Read `.charlie/principal/INDEX.md`.
3. Read the necessary files in the order specified by INDEX.md.
4. Check the STATUS of every file. Do not reference any file whose STATUS is not CONFIRMED.

---

## Commands

### /onboard

Initial project setup. One-time only.

1. Read and follow `.charlie/principal/skills/onboard/SKILL.md`.
2. Required input: `.charlie/context/masterplan.md`
3. Optional input: additional materials passed via `--context`.

### /done

End of session.

1. Read and follow `.charlie/principal/skills/handoff/SKILL.md`.

### /fix

Fix items that the reviewer marked as FAIL.

1. Read `.charlie/context/runs/{session-id}/fix-plan.md`.
2. Re-execute only the scope specified by fix-plan, following `.charlie/principal/skills/implement/SKILL.md`.

---

## Immutable

The following directories must never be modified.
These files are only changed via `charlie dna update`.

- `.charlie/principal/`
- `.charlie/agents/`

---

## Golden Rules

- Do not proceed based on anything that is not confirmed.
- Do not fill in blanks with guesses.
- If you don't know, stop and ask.
