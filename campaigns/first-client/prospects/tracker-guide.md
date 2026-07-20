# Prospect tracker guide

Use `tracker.csv` in **Google Sheets** (File → Import) or Excel. One row = one company / contact.

## Daily workflow

1. Sort or filter by `next_follow_up` ascending (today + overdue first).
2. Send the due touch (Email 1–4 or reply).
3. Update `status`, the matching `emailN_date`, and set the next `next_follow_up`.
4. If they reply, set `status` to `replied`, stop the sequence, and handle with `emails/reply-scripts.md`.

## Status values (use these exactly — paste into Sheets data validation)

```
research
email1_sent
email2_sent
email3_sent
email4_sent
replied
call_booked
won
lost
nurture
unsubscribed
```

| Status | Meaning | Typical next step |
|--------|---------|-------------------|
| `research` | Qualified, not emailed yet | Write personalization → send Email 1 |
| `email1_sent` | Snapshot offer out | Email 2 on Day 3 |
| `email2_sent` | Risk follow-up out | Email 3 on Day 7 |
| `email3_sent` | Value / why-us out | Email 4 on Day 12 |
| `email4_sent` | Soft break-up sent | Close as `lost` or park as `nurture` (~60–90 days) |
| `replied` | They answered — **stop sequence** | Book call or handle objection |
| `call_booked` | Snapshot / discovery on calendar | Run call → set `outcome` |
| `won` | Paid engagement closed | Ask for testimonial / referral |
| `lost` | Clear no or finished sequence cold | Archive |
| `nurture` | Timing off; revisit later | Set `next_follow_up` 60–90 days out |
| `unsubscribed` | Opted out | Never email again |

## Google Sheets setup (2 minutes)

1. Import `tracker.csv`.
2. Freeze row 1 (View → Freeze → 1 row).
3. Select the `status` column → Data → Data validation → Dropdown → paste the status list above.
4. Format `next_follow_up` and all `*_date` columns as **Date**.
5. Optional filter view: `status` is not `won` / `lost` / `unsubscribed`, sorted by `next_follow_up`.

## Follow-up timing (from playbook)

| After | Set `next_follow_up` to | Then send |
|-------|-------------------------|-----------|
| Email 1 | +3 days | Email 2 |
| Email 2 | +4 days | Email 3 |
| Email 3 | +5 days | Email 4 |
| Email 4 (no reply) | — | `lost` or `nurture` |
| Soft “not now” | +60–90 days | New Email 1 or light check-in |
| Positive reply | Same day / next business day | Book call |

## Column cheat sheet

| Column | What to put |
|--------|-------------|
| `personalization_note` | The real first-line hook (required before Email 1) |
| `source` | Where you found them (Maps, LinkedIn, referral, site) |
| `last_reply_summary` | Short note: “wants Thursday”, “has MSP”, “send pricing” |
| `call_booked_date` | Calendar date of the Snapshot / discovery |
| `outcome` | Free text or: `snapshot_done`, `proposal_sent`, `vigil_closed`, `no_fit` |
| `notes` | Anything else (gatekeeper name, LinkedIn URL, etc.) |

## Pace reminder

**5–8 new Email 1s per day.** Follow-ups for existing rows happen from `next_follow_up`, not as a separate blast.
