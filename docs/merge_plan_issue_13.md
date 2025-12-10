Merge plan for issue #13 — [BLACKBOX] Fusionar cambios perdidos de ramas de trabajo desconcentradas

Generated: 2025-12-08T10:19:45.264Z

Summary
- Goal: Consolidate important feature branches into master in a safe, phased way, keeping history clear and ensuring builds/tests pass before pushing.
- Scope: Candidate branches (from issue #13):
  - feature/chatbot-implementation (18d35c4...)
  - feature/statistics-screens (b26be51...)
  - feature/rebrand-to-manda2-ki6 (2f43248...)
  - feature/mariadb-mysql-migration-analysis-gs5-gemini (7eeca8a...)
  - sesion4-visual-consistency (44818d4...)
  - sesion4-visual-consistency-clean (b43c06f...)
  - other isolated branches: frontend-only, backend-only, deploy, despliegue/exitoso

Phase 0 — Preparation (confirm before merging)
- Create an integration branch locally: git fetch origin && git checkout -b integration/blackbox-issue-13 origin/master
- Ensure CI/tools installed: npm install (root), cd frontend && npm install; cd ../backend && npm install
- Run baseline checks on master: node test-deployment-status.js && curl -sS http://localhost:5000/api/health (if backend running)
- Create backups/tags: git tag pre-blackbox-13-$(date +"%Y%m%d%H%M%S")

Phase 1 — Low-risk merges (UI/Content + docs)
- Merge sesion4-visual-consistency-clean into integration first to validate styling-only changes:
  - git merge --no-ff origin/sesion4-visual-consistency-clean -m "Merge: sesion4 visual consistency (clean)"
  - Run frontend build: cd frontend && npm run build
  - Run linter and fix simple issues if they block build
- If build/tests fail, resolve locally and commit merges as separate commits documenting conflict resolution.

Phase 2 — Feature merges (chatbot, stats)
- Merge feature/statistics-screens next (charts often add deps):
  - git fetch origin && git merge --no-ff origin/feature/statistics-screens -m "Merge: statistics screens"
  - Install/verify additional deps (e.g., charting libs), run frontend build and run smoke tests
- Merge feature/chatbot-implementation afterwards (larger, may touch backend and email utils):
  - git merge --no-ff origin/feature/chatbot-implementation -m "Merge: chatbot implementation"
  - Run backend tests: node test-backend.js and test-otp-email.js / test-otp-verify.js as applicable
  - Validate email/OTP flows in staging environment or via mock configs (do not send real emails in CI)

Phase 3 — Infra/DB/rebrand merges
- Merge feature/mariadb-mysql-migration-analysis-gs5-gemini in an isolated step and run DB migration analysis scripts locally:
  - Ensure migrations are non-destructive or run against a local copy of DB
- Merge feature/rebrand-to-manda2-ki6 last (name/path changes may cause many conflicts):
  - Resolve path/routing conflicts carefully, update import paths and environment vars

Phase 4 — Validation and cleanup
- Run full build/test cycle:
  - cd frontend && npm run build && cd ../backend && npm run build (or start dev checks)
  - Run vitest: cd frontend && npm test
  - Run backend smoke tests: node test-deployment-status.js
- Fix discovered issues, optionally create small follow-up commits on integration branch
- Create CHANGELOG.md entry summarizing merged features and authors

Phase 5 — Merge to master and deploy
- When integration branch is stable and reviewed, open PR against master with clear description and changelog
- Use --no-ff merges to preserve merge commits and document conflict resolutions
- Merge PR via GitHub (or locally) and push tags
- Trigger CI/CD (Railway) deploy to staging and validate health endpoints

Rollback plan
- If master is broken after merge: revert merge commit(s) by git revert -m 1 <merge-commit-sha> and redeploy
- Keep the integration branch around until production is stable

Immediate next actions (starting now)
1) Confirm approval to create/operate on integration branch and perform local merges. If approved, recommended commands:
   - git fetch origin
   - git checkout -b integration/blackbox-issue-13 origin/master
   - git tag pre-blackbox-13-<timestamp>
2) Run dependency installs and baseline builds:
   - npm install
   - cd frontend && npm install && npm run build
   - cd ../backend && npm install
3) Merge sesion4-visual-consistency-clean and validate frontend build

Notes and risks
- Rebranding and DB migration branches are highest risk; handle them last and with DB backups.
- Chatbot and statistics may add/new deps; allow time to update package-lock and audit
- Avoid pushing to master directly; use PRs for review and CI validation

Files created/updated by this plan
- docs/merge_plan_issue_13.md (this file)
- Suggested branch: integration/blackbox-issue-13

If approved, proceed to create the integration branch and run Phase 0 commands. If any merge fails or conflicts are complex, document conflict resolution in the integration branch commits and update this plan accordingly.

Labels: status:in-progress, agent:assistant
