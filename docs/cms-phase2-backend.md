# CMS Phase 2 backend

Branch `feature/cms-phase2-backend`. Backend contracts for the Phase 2 admin UI (`feature/cms-phase2-admin`, `9643943`). Not deployed, not merged.

All responses use the Phase 1 envelope: `{ "success": true, "data": … }` or `{ "success": false, "error": { "code", "message", "details" } }`. Every admin route goes through `admin()` (`src/lib/server/api.ts`): session, 2FA enforcement, same-origin check, then permission checks inside the service layer (`assertCan`). `SUPER_ADMIN` passes every check.

## 1. Schema and migration

**Migration:** `prisma/migrations/20261125000000_cms_phase2_backend` (apply with `npx prisma migrate deploy`, unchanged).

It is generated as a diff from the **real V1 baseline** (`20261124000000_platform_backend`, 20 KB of SQL as shipped on `integration/kash-cms-v1`). The placeholder stub that used to sit under that name on this branch was replaced byte-for-byte by the V1 file, and V1's schema additions (`Page.draft`, extra `SeoMetadata` columns, `binaryTargets`) were copied in, so this migration contains **no drops**.

Safety review (verified against a scratch PostgreSQL 16 with rows inserted under V1 before applying):
* only `CREATE TYPE/TABLE/INDEX`, `ADD COLUMN` (all nullable or defaulted), `ADD CONSTRAINT … FOREIGN KEY`, `ALTER TYPE "PageStatus" ADD VALUE`
* grep for `DROP|RENAME|TRUNCATE|DELETE|SET NOT NULL` → 0 matches
* existing `Page`/`Lead` rows survive; `prisma migrate diff` after deploy → no drift
* `ALTER TYPE … ADD VALUE` cannot be used for new values in the same transaction; nothing in the migration does.

New/changed: `PageStatus` +`IN_REVIEW, CHANGES_REQUESTED, APPROVED, ARCHIVED`; `Page` review/schedule fields; `PageSection.globalBlockId` (FK, RESTRICT); `MediaAsset.folderId` (FK, RESTRICT) + `tags`; `Article`/`PortfolioProject` `publishAt`/`unpublishAt`; `Lead` `assignedToId, priority, nextFollowUpAt, estimatedValue, lastActivityAt, tags`; `Form` `successMessage, successRedirectUrl, createLead, sendNotification`; `FormField` `step, section, description, conditionalRules`; new tables `PageTemplate, GlobalBlock, Task, Notification (unique userId+dedupeKey), MediaFolder (self-tree), LeadActivity, EmailTemplate, FormTemplate, PortfolioTemplate`.

Seed: `prisma/seed-phase2.ts`, called from `prisma/seed.ts`. Idempotent; permissions upserted, grants only added, built-in templates created if missing and never overwritten.

## 2. Permissions

Seeded keys (`src/lib/rbac/phase2-permissions.ts`): `templates.view/manage`, `global_blocks.view/manage`, `content.submit_review/review/approve/publish/schedule`, `seo.audit`, `media.folders`, `media.force_delete`, `leads.assign`, `leads.manage_followup`, `tasks.view/manage`, `notifications.view`, `email_templates.view/manage`, `import_export.use`, `search.use`. (`content.publish` is additional to the brief's §23 list; publishing also accepts the existing `pages.publish`.)

| Role | Phase 2 grants |
|---|---|
| SUPER_ADMIN, ADMINISTRATOR | all |
| MARKETING_MANAGER | templates/blocks view, submit/review/approve/schedule, media.folders, leads.assign, leads.manage_followup, tasks.view/manage, notifications, email_templates.view, import_export.use, search |
| SEO_MANAGER | templates/blocks view, submit/review, seo.audit, notifications, tasks.view, search |
| CONTENT_EDITOR | templates/blocks view, submit, media.folders, notifications, tasks.view, search |
| VIEWER | templates/blocks view, notifications, search |

Grants apply to roles that exist. **Integration note:** V1's `seed.ts` rewrites each role's permissions on every run (`deleteMany` + `createMany`), so when merged, append `PHASE2_ROLE_GRANTS[name]` to V1's `ROLES` table (or call `seedPhase2` after `seedAccess` and drop the `deleteMany`), otherwise the grants are wiped on re-seed.

## 3. API reference

### Page templates (`templates.view/manage`, `pages.create`)
`GET/POST /api/admin/page-templates` · `GET/PATCH/DELETE /api/admin/page-templates/[id]` · `POST /api/admin/page-templates/[id]/create-page`

Built-ins: Blank Page, Service Page, Landing Page, Portfolio Case Study, Location SEO Page, Campaign Page, About Page, Contact Page (`isSystem: true`; edit/delete only by `SUPER_ADMIN`, else `403 SYSTEM_TEMPLATE`).
```
POST /api/admin/page-templates      { "name": "Promo", "category": "CAMPAIGN", "definition": { "sections": [{ "type": "cta", "content": {} }] } }
                                    or { "name": "From page", "fromPageId": "…" }
POST …/[id]/create-page             { "title": "Meerut SEO", "slug": "/meerut-seo" }   → 201 DRAFT page, sections cloned, createdBy = caller, version 1, audit page.create_from_template
```

### Global blocks (`global_blocks.view/manage`)
`GET/POST /global-blocks` · `GET/PATCH/DELETE /global-blocks/[id]` · `GET /global-blocks/[id]/usage` · `POST /global-blocks/[id]/detach` `{pageId?, sectionId?}` · `POST /global-blocks/[id]/link` `{pageId, position?}` (needs `pages.edit`; adds a linked section to the page's draft).

Linked sections store `globalBlockId`; the public page route resolves type/content/style from the block at read time. `DELETE` while referenced → `409 BLOCK_IN_USE` with the usage list. `detach` copies the block's current content/style into the section(s) (live rows and drafts). Usage returns `{pageId,title,slug,status,sectionCount,live,inDraft}`.

### Approval workflow (pages)
```
DRAFT/CHANGES_REQUESTED -submit-review-> IN_REVIEW -approve-> APPROVED -publish-> PUBLISHED
                                        \-request-changes-> CHANGES_REQUESTED   \-schedule-> SCHEDULED -(scheduler)-> PUBLISHED
any non-archived -archive-> ARCHIVED -unarchive-> DRAFT;  PUBLISHED -unpublish-> DRAFT;  SCHEDULED -cancel-schedule-> APPROVED
```
`POST /api/admin/pages/[id]/` `submit-review` (`content.submit_review`) · `request-changes` `{note}` required (`content.review`) · `approve` (`content.approve`; the submitter cannot approve their own submission unless `SUPER_ADMIN`) · `publish`, `unpublish` (`content.publish` or `pages.publish`) · `schedule` `{publishAt?, unpublishAt?}` (`content.schedule`) · `cancel-schedule` · `archive`, `unarchive`.
Invalid jumps → `409 INVALID_TRANSITION`. Holders of `content.approve` may fast-track `DRAFT`/`CHANGES_REQUESTED` → `PUBLISHED`/`SCHEDULED` (recorded as approval+publication); anyone else gets `403`. A published page may be given only an `unpublishAt` (status unchanged). Each action is audited; status changes are guarded (`UPDATE … WHERE status = <validated>`) so concurrent changes give `409 CONFLICT`. Publishing applies `Page.draft` to the live rows (as V1 does), snapshots a version and runs `afterContentPublished`. **Integration note:** V1's page-save route should reset `IN_REVIEW/APPROVED` back to `DRAFT` when content is edited; the new routes do not touch V1's save path.

### Scheduling
`processScheduledContent()` (`src/lib/cms/scheduler.ts`): publishes `SCHEDULED` items with `publishAt <= now` (pages, articles, portfolio) and moves `PUBLISHED` items with `unpublishAt <= now` back to `DRAFT`. Each item is claimed by a conditional `UPDATE`, so re-runs and concurrent runs act exactly once; a failing item is audited (`*.publish_failed`), notified once per scheduled time, left `SCHEDULED`, and does not stop the rest.

`POST /api/internal/scheduler/content` — `Authorization: Bearer $CMS_SCHEDULER_SECRET` (or `x-scheduler-secret`). 404 if the secret is unset, 401 if wrong (constant-time compare). Returns `{ranAt, published[], unpublished[], failed[], skipped}`.

**Cron on the Illure VPS (not installed by this branch):**
```
# /etc/cron.d/kash-scheduler   — every minute
* * * * * deploy curl -fsS -m 30 -X POST -H "Authorization: Bearer $(cat /etc/kash/scheduler-secret)" http://127.0.0.1:3000/api/internal/scheduler/content >> /var/log/kash-scheduler.log 2>&1
```
Keep the secret in a root-readable file (mode 600) and set `CMS_SCHEDULER_SECRET` to the same value in the app container's environment. The endpoint is not protected by the admin session, so bind curl to the internal address (or reverse-proxy-deny `/api/internal/` from the internet). Missed runs are harmless: the next run catches up.

### Central publish hook
`afterContentPublished()` (`src/lib/cms/publish-hooks.ts`): audit log → notification (best effort, wrapped) → public-site revalidation. Used by manual publish/unpublish/archive, the scheduler and bulk publish. It never throws.

### Revisions
`GET /pages/[id]/versions` → `[{id, version, createdAt, reason, by}]` (restore route unchanged).
`GET /pages/[id]/versions/[a]/compare/[b]` →
```
{ from:{version,…}, to:{version,…}, diff:{ identical, metadata:[{field,from,to}], seo:[…],
  sections:{ added:[…], removed:[…], changed:[{id,type,position,enabled,typeChanged,globalBlock,content:[{path,from,to}],style:[…]}], orderChanged, order:{from,to} },
  summary:{…} } }
```
Sections are matched by id, then by type in order (ids change after a restore). Reorders are judged among surviving sections.

### SEO audit (`seo.audit`)
`GET /seo/audit` → `{generatedAt, summary:{critical,warning,recommendation,passed,pagesAudited,issues}, issues[], passed[], notes[]}`; `GET /seo/issues?severity=&type=&entityType=&limit=&offset=` → `{total, issues[]}`. Issue: `{id,type,severity,entityType,entityId,url,message,recommendation}`; severities `CRITICAL|WARNING|RECOMMENDATION`, plus `PASSED` entries in `passed[]`.
Checks: missing/duplicate/oversized (>60) title; missing/duplicate/oversized (>160) description; missing/multiple H1; missing/invalid canonical; noindex; missing OG image; images without alt (page content and media library); broken internal links; orphan pages; redirect chains; redirect loops; missing schema. Pages are audited on their working copy; CRITICAL is downgraded to WARNING for unpublished pages; built-in route pages skip content checks. Orphan check is skipped (and `notes` says so) if no navigation links exist. Known paths assume articles at `/insights/{slug}` and projects at `/work/{slug}`. No traffic, ranking or Search Console data is produced.

### Media
`GET/POST /media/folders` · `PATCH/DELETE /media/folders/[id]` (`?moveContentsToParent=true`) · `PATCH /media/[id]/move {folderId|null}` (`media.folders`). Nesting ≤ 6, unique names per parent (case-insensitive), cycles rejected, non-empty folders → `409 FOLDER_NOT_EMPTY`.
`GET /media/[id]/usage` → `{inUse,total,byType,items:[{entityType,entityId,label,location}]}` scanning Pages (live sections, drafts, social images), Global Blocks, Portfolio, Articles, Header/Footer/other settings, Theme. `DELETE /media/[id]` is a soft delete; in use → `409 MEDIA_IN_USE`; `?force=true` needs `media.force_delete` and is audited (`media.force_delete`).
`GET /media/capabilities` → `{provider, optimization:{supported:false, formats:{WEBP:{supported,reason},AVIF:{…}}}}`; `POST /media/[id]/optimize {format}` → `501 UNSUPPORTED_CAPABILITY`. **Deferred:** real WebP/AVIF conversion — the local storage provider keeps originals only and no image library is a declared dependency; nothing is faked.

### Lead CRM (`leads.view/edit/assign/manage_followup`)
`GET /leads` filters: `status, priority` (comma lists), `assignee` (`me|unassigned|id`), `service, source, tag, q, from, to, followUpDue, limit`. Response stays a plain array (Phase 1 compatible); total in `X-Total-Count`. `PATCH /leads` (status) is unchanged but now appends history, writes activity.
`GET /leads/[id]` (lead + notes + `activities` + submissions + tasks) · `POST /leads/[id]/notes {body}` · `PATCH /leads/[id]/assign {assignedToId|null}` · `PATCH …/follow-up {nextFollowUpAt|null, note?}` · `PATCH …/priority {priority?, estimatedValue?, tags?}`.
`LeadActivity.type`: `CREATED, STATUS_CHANGED, ASSIGNED, NOTE_ADDED, FOLLOW_UP_SET, EMAIL_SENT, TASK_CREATED` (+ `PRIORITY_CHANGED, UPDATED`). Every activity updates `lastActivityAt`.

### Tasks, notifications
`GET/POST /tasks` (`?status&priority&assignee&relatedType&relatedId&overdue&q`) · `GET/PATCH/DELETE /tasks/[id]`. Related to `LEAD|PAGE|ARTICLE|PORTFOLIO` (caller needs that entity's view permission). `tasks.manage` sees/edits all; `tasks.view` sees own (assigned/created) and may change only the status of tasks assigned to them.
`GET /notifications?unread=&limit=&cursor=` → `{items, unreadCount, nextCursor}` · `POST /notifications/[id]/read` · `POST /notifications/read-all`. Generated for: new lead, review requested, changes requested, approved, scheduled, publish/unpublish, publish failure, form submission (forms that do not create leads), lead/task assignment. De-duplicated by `(userId, dedupeKey)`.

### Email templates (`email_templates.view/manage`)
`GET /email-templates` · `GET/PATCH /email-templates/[key]` · `POST /email-templates/[key]/preview`. Keys: `lead_internal, lead_confirmation, team_invite, security_notice, page_approval, newsletter_confirmation`. Syntax is only `{{variableName}}` from the key's allow-list; anything else (`{{a.b}}`, `{{#if}}`, unknown names) is rejected with `400 UNSAFE_TEMPLATE`. Subjects have line breaks stripped. Values are never re-interpreted. `notifyLead` (lead forms) now renders `lead_internal` / `lead_confirmation`, falling back to built-in text if a template is disabled/invalid. `team_invite` and `security_notice` are seeded and renderable via `sendTemplatedEmail`, but nothing on this branch sends them (the team/security flows live on the V1 branch).

### Forms
`GET/POST /forms` · `GET/PATCH/DELETE /forms/[id]` (`forms.view/edit`) — field set replaced atomically; forms with submissions can't be deleted (deactivate). `GET /form-templates` · `POST /form-templates/[id]/create {name?, slug?}` clones Form + FormField (Contact Form, Project Enquiry, Free Digital Audit, Request Quote, Newsletter, Callback Request).
Advanced config: `step` (1..10 contiguous), `section`, `description`, `settings.multiStep/steps`, `successMessage`, `successRedirectUrl` (local path or https only), `createLead`, `sendNotification`, `conditionalRules`:
```
{ "action": "show|hide|require", "match": "all|any", "conditions": [{ "field": "service", "operator": "equals|not_equals|contains|not_contains|is_empty|is_not_empty|greater_than|less_than", "value": "Other" }] }
```
Zod `.strict()`; references must exist, no self-reference, no cycles. Rules are data evaluated by fixed operators; no code runs. `saveSubmission` enforces them (hidden fields ignored, rule-required fields enforced), skips lead creation when `createLead=false`, skips email when `sendNotification=false`, and returns `successMessage`/`successRedirectUrl`.

### Portfolio templates
`GET /portfolio-templates` · `POST /portfolio-templates/[id]/create {title, slug?}` → DRAFT project (Technology Project, Mobile App, ERP / CRM, Website, Branding, Marketing Campaign).

### Bulk (all-or-nothing, one transaction, audited)
`POST /pages/bulk {action: publish|archive|unarchive, ids ≤50}` · `/portfolio/bulk {publish|archive, ≤50}` · `/leads/bulk {assign|tag|status|priority, ≤200}` · `/media/bulk {move|tag, ≤200}`. All ids validated first (404 lists missing); illegal page transitions → `409 BULK_REJECTED` and nothing changes; a failure mid-batch rolls the whole batch back. Already-in-state items are reported as `skipped`.

### Import / export (`import_export.use` + entity permission)
Export: `GET /export/{pages|portfolio|articles|forms|leads}?format=json|csv` (pages/articles/forms JSON; leads CSV; portfolio either). Selected columns only; a guard rejects any payload containing password/session/TOTP/recovery/secret-like keys. Exports are audited. CSV cells that spreadsheets would evaluate (`= + - @ tab CR`, except plain numbers/phone numbers) are prefixed with `'`.
Import: `POST /import/{pages|portfolio|leads} {mode:"dry-run"|"execute", data, digest?, skipRejected?, allowDuplicates?}`. `data` is the `{pages:[…]}` object for pages, CSV text otherwise. Dry-run returns `{digest, counts, accepted[], rejected[], warnings[]}` and writes nothing. `execute` requires the digest of exactly the same payload (`409 DIGEST_MISMATCH`), refuses if rows were rejected unless `skipRejected` (`422 HAS_REJECTED_ROWS`), runs in one transaction, creates pages/projects as DRAFT, and audits. Imported formula-like cells are neutralised and warned about. Limits: 200 pages, 2000 CSV rows, 2 MB.

### Search
`GET /search?q=&limit=` (`search.use`, 2–100 chars). Groups only for entities the caller may view (`pages/portfolio/articles/media/leads`), ≤10 each, soft-deleted rows excluded. Uses case-insensitive `contains`; no trigram index is added (would need an extension).

## 4. Antigravity client mapping

| Client method | Endpoint |
|---|---|
| `getPageTemplates()` | `GET /api/admin/page-templates` |
| `createPageFromTemplate(id, …)` | `POST /api/admin/page-templates/[id]/create-page` |
| `getGlobalBlocks()` / `saveGlobalBlock()` | `GET /api/admin/global-blocks` / `POST` (create) or `PATCH /[id]` |
| `submitForReview()` / `requestChanges()` / `approvePage()` | `POST /api/admin/pages/[id]/submit-review` / `request-changes` / `approve` |
| `schedulePublish()` / `cancelSchedule()` | `POST /api/admin/pages/[id]/schedule` / `cancel-schedule` |
| `getPageVersions()` / `compareVersions(a,b)` | `GET /pages/[id]/versions` / `…/versions/[a]/compare/[b]` |
| `getMediaFolders()` / `moveMediaToFolder()` | `GET /media/folders` / `PATCH /media/[id]/move` |
| `optimizeMediaItem()` | `POST /media/[id]/optimize` (currently `501 UNSUPPORTED_CAPABILITY`); capability probe `GET /media/capabilities` |
| `assignLead()` / `setLeadPriority()` | `PATCH /leads/[id]/assign` / `PATCH /leads/[id]/priority` |
| `getTasks()` / `saveTask()` | `GET /tasks` / `POST /tasks` or `PATCH /tasks/[id]` |
| `getNotifications()` / `markNotificationRead()` | `GET /notifications` / `POST /notifications/[id]/read` (+ `read-all`) |
| `getEmailTemplates()` / `saveEmailTemplate()` | `GET /email-templates` / `PATCH /email-templates/[key]` |
| `getFormTemplates()` | `GET /form-templates` (+ `POST /form-templates/[id]/create`) |
| `getPortfolioTemplates()` | `GET /portfolio-templates` (+ `POST …/[id]/create`) |

All paths are under `/api/admin`. Antigravity's branch was not modified.

## 5. Tests

`npm run test:platform` runs `tests/platform.test.ts` (Phase 1), `tests/phase2-unit.test.ts` (33 pure tests) and `tests/phase2-db.test.ts` (20 integration suites against real PostgreSQL). The DB suite is skipped unless `TEST_DATABASE_URL` points at a database with all migrations applied:
```
docker run -d --name pg -e POSTGRES_PASSWORD=pw -e POSTGRES_DB=kash -p 55432:5432 postgres:16-alpine
DATABASE_URL=postgresql://postgres:pw@127.0.0.1:55432/kash npx prisma migrate deploy
TEST_DATABASE_URL=postgresql://postgres:pw@127.0.0.1:55432/kash npm run test:platform
```
The suite creates uniquely-named rows and can be re-run on the same database; use a disposable database, not production.

## 6. Merge notes for V1 integration

Files that exist on both branches and will conflict (resolve as noted): `prisma/schema.prisma` (V1's additions are already included), `prisma/migrations/20261124000000_platform_backend/migration.sql` (identical), `prisma/seed.ts` (see §2), `src/lib/server/api.ts`, `src/lib/rbac/permissions.ts`, `src/lib/auth/session.ts` (copied from V1; take V1), `src/lib/forms/submissions.ts` (Phase 2 version ports V1's validations; take this one), `src/app/api/admin/leads/route.ts`, `src/app/api/public/pages/[slug]/route.ts`, V1's `pages/[id]/versions`, `media/[id]`, `forms` routes (this branch's versions return raw records, V1's return UI DTOs: keep V1's route shape and call the Phase 2 services — `validateFormConfig`, `deleteMediaAsset`, `compareVersions`, `resolveSections` — from them).
