# Contributing Guidelines

Welcome to the SH27 project! We're glad you're interested in contributing. Before you get started, please take a minute to familiarise yourself with the following guidelines to ensure smooth collaboration.

## Branch Strategy

- Make sure the `develop` branch you are using in your local repo up-to-date with the remote repo first: <br>
  `git checkout develop ` <br>
  `git pull origin develop`
- For any new features or bug fixes, always checkout from the `develop` branch: <br>
  `git checkout -b feature-branch-name`
- Use the following format for branch names: `{issue-number}-{issue-title}`. For example, `42-fix-login-Issue`.

## Pull Requests

- **No Direct Pushes to Main**: Always create pull requests (PRs) when making changes.
- When creating a PR, make sure to link it to the relevant issue for better tracking and context. This is done automatically as long as you use the relevant issue number in the branch name as explained [here](#-branch-strategy).

## Commit Messages

- Commit messages should follow this format: `{issue-number}: {commitMsg}`. For example, `42: added unit tests`
- Commit messages should summarize the changes made in preferably one short sentence
- Use small, focused commits over large ones whenever possible. This helps in better tracking and understanding of changes.

## Code Review

- All code changes require review from at least one team member. Please paste a link to your merge request in the MS Teams channel with a brief description of the changes made.
- Any feedback from reviews should be addressed promptly by the person that initated the merge request.

## Release Process

- During a release:
  - `develop` is merged into `main`.
  - The merged code is deployed to the production environment.

## Continuous Integration (CD/CI)

- If the CD/CI pipeline for the `develop` branch breaks, it should be communicated in the Teams chat and immediately be picked up by someone.
- No new branches or merge requests should be created until the broken build is resolved.

## Collaboration

- Be respectful and constructive in merge request reviews.
- For communication, don't DM team members but instead use the dedicated MS Teams channel. (using @mention is fine and recommended)
