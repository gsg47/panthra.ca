# Prospect tracker guide

Primary file: **`PANTHRA-first-client-tracker.xlsx`**

One workbook, separate sheets for each industry, plus Instructions and Overview.

## Sheets

| Tab | Purpose |
|-----|---------|
| **Instructions** | How to run the campaign + status meanings |
| **Overview** | Pipeline counts across industries (auto formulas) |
| **Legal** | Law firms & professional services |
| **Healthcare** | Clinics / healthcare |
| **Financial** | Accounting, insurance, finance |
| **Agencies** | Agencies & other professional services |
| **Education** | Schools / training orgs |

## Open in Excel

1. Download `PANTHRA-first-client-tracker.xlsx` from the repo.
2. Double-click to open in Excel (or File → Open).
3. Use the industry tabs. Status column already has a dropdown.
4. Save as your working copy (e.g. on OneDrive/Desktop).

## Open in Google Sheets

1. Go to [sheets.google.com](https://sheets.google.com).
2. **File → Import → Upload** → select the `.xlsx`.
3. Choose **Replace spreadsheet** → Import.
4. Confirm each industry tab is there. Dropdowns usually carry over; if Status loses validation, re-add from the list below.
5. Optional: File → Make a copy so you don’t overwrite shared versions.

## Daily workflow

1. Open **Overview** for due/overdue counts.
2. Go to the industry tab you’re working.
3. Sort/filter by **Next follow-up** (today + overdue first).
4. Send the due touch → update **Status**, date columns, and **Next follow-up**.
5. On reply → Status = `replied` and **stop the sequence**.

## Status dropdown values

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

## Follow-up timing

| After | Next follow-up | Then send |
|-------|----------------|-----------|
| Email 1 | +3 days | Email 2 |
| Email 2 | +4 days | Email 3 |
| Email 3 | +5 days | Email 4 |
| Email 4 (no reply) | — | `lost` or `nurture` (+60–90 days) |
| Soft “not now” | +60–90 days | New check-in |
| Positive reply | Same / next day | Book call |

## Pace

**5–8 new Email 1s per day.** Follow-ups come from **Next follow-up**, not a separate blast.

## CSV fallback

`tracker.csv` is still available for a flat single-sheet import if you prefer. The `.xlsx` workbook is the recommended version.
