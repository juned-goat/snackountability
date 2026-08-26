# Workflow

One rule, followed consistently: **nothing lands on `main` except through a
tested, merged feature branch.**

## Branches

- `feature/<short-name>` — new functionality
- `fix/<short-name>` — bug fixes
- `chore/<short-name>` — tooling, infra, docs

## Per feature

1. Branch off the latest `main`.
2. Build it.
3. Before opening a PR: typecheck + lint pass, CI is green, and you've
   manually smoke-tested the actual behavior (not just "it compiles").
4. Open a PR. Describe what was manually verified, since we don't have full
   test coverage yet — that description is doing the job a test suite
   would otherwise do.
5. Merge (squash) once green. Delete the branch.

As real automated tests get added — start with `packages/shared`, it's pure
logic and the cheapest to test — passing tests join the bar in step 3.

## Exceptions

None, deliberately — including for tiny changes. If a change feels too
small to deserve a branch, that's usually a sign it should be folded into
whatever feature branch is already open, not a reason to push to `main`
directly.
