# Contributing

Read [README.md](README.md) first and get the website running locally.

## Branches

| Branch | Deploys to | Who merges |
|---|---|---|
| `main` | Staging preview | PM, from your pull requests |
| `production` | https://pemilu.hmif.dev | PM only, after release approval |
| your branch | Preview for its pull request | |

Always branch from `main` and open pull requests into `main`, never into `production`.

## Workflow

1. Work only on issues the PM assigned to you.
   No issue for what you want to do? Ask the PM first.
2. Update `main` and create a branch from it:
   ```bash
   git switch main
   git pull
   git switch -c feat/12-countdown-timer
   ```
3. Commit small, working steps. Push your branch.
4. Open a pull request into `main`. Write `Closes #12` in the description.
5. The PM reviews it. Fix the comments by pushing more commits to the same branch.
6. The PM merges it. Delete your branch afterwards.

You cannot push to `main` directly. Every change goes through a pull request.

## Branch names

`<type>/<issue number>-<short-description>`, for example `fix/31-navbar-contrast`.

## Issue titles

Say what is wrong in one short line, starting with the thing that is wrong. Fill in the issue template.

## Commit messages

`<type>: <what changed>`, in English, lower case, for example `fix: navbar text contrast on dark mode`.

| Type | Use for |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `style` | Visual changes only |
| `refactor` | Code change that does not change behaviour |
| `chore` | Dependencies, config, tooling |
| `docs` | README, CONTRIBUTING, comments |

## Before opening a pull request

- The website runs with `npm run dev` and your change works in the browser.
- `npx prettier --write .` has formatted your code.
- The pull request shows a screenshot for any visual change.
- One pull request does one thing. Split unrelated changes.

## Never commit

- `.env` or any password, key, or token
- Voter data, DPT files, or any spreadsheet with names, NIM, or emails
- Design or planning documents. These live in the shared Google Drive.

Committed something by mistake? Tell the PM right away. Deleting it in a new commit is not enough,
because it stays in the git history.

## Security

Found a security problem? Do not open a public issue. Message the PM privately.

## Questions

Ask in the IT group chat, or comment on the issue. Asking early is better than guessing.
