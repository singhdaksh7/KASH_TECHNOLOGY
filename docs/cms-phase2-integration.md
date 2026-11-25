# CMS Phase 2 — integration notes (v2.1.0)

Integration of `feature/cms-phase2-backend` (dafc8c3) and `feature/cms-phase2-admin` (9643943) onto V1 `main` (v2.0.0).

## Decisions worth knowing
- **V1 wins for core behaviour** (auth, 2FA, RBAC, public renderer, page builder save/draft model, media, forms/lead shapes). Phase 2 services are called *from* V1-shaped routes.
- **Draft-reset rule.** A material edit sends `IN_REVIEW`, `CHANGES_REQUESTED`, `APPROVED` and `SCHEDULED` pages back to `DRAFT` (approval/schedule cleared, audited as `page.reset_to_draft`). This includes editing a global block that a page links. **`PUBLISHED` pages are deliberately not set to DRAFT:** V1 holds edits in `Page.draft` and the live page keeps serving its published content until "Publish changes", so resetting would take a live page offline. The unpublished changes are flagged in the builder.
- **Seed** is additive: role permissions are only added, never revoked, so Phase 2 grants and any permissions an administrator adds survive every deploy (the entrypoint re-seeds on each start).
- **Scheduling** stores UTC instants only. The UI sends wall-clock date/time + IANA timezone; the server converts (DST-safe). Display defaults to Asia/Kolkata.
- **Optimization** (`WEBP`/`AVIF`) returns `501 UNSUPPORTED_CAPABILITY`; the UI shows "Image optimization is not enabled on this server yet." No numbers are fabricated.
- **SEO dashboard** shows only audit findings from stored content. Removed the previous mock tabs (keywords, crawl score).
- **Email:** with no `RESEND_API_KEY` leads and submissions are still saved; the admin shows a notice and submissions record `emailStatus=FAILED`.

## Known limitations
- `team_invite` / `security_notice` templates are seeded and editable but nothing sends them yet.
- Nightly backup covers the database only (not the media volume).
- The orphan-page check relies on navigation settings; link-check assumes articles at `/insights/{slug}` and projects at `/work/{slug}`.
- Mobile layouts for the Phase 2 admin were adjusted (detail panels become overlays below `lg`) but not checked on physical devices; the Page Builder remains desktop-focused.
