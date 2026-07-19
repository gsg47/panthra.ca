# Prospect research checklist

Spend **3–6 minutes** per prospect before Email 1. If you cannot write a real `{{Hook}}`, skip or park the lead.

## 1) Confirm fit

- [ ] Headcount roughly in ICP (or clear SMB signals)
- [ ] Alberta / Calgary-relevant (or strong reason to stretch)
- [ ] Industry matches a variant in `industry-variants.md`
- [ ] Not an enterprise with an obvious in-house security org

## 2) Find the person

- [ ] Decision-maker or strong influencer (owner, ops, clinic director, IT)
- [ ] Business email only (no personal Gmail unless they publish it for work)
- [ ] Name spelling verified (site, LinkedIn, press)

## 3) Build `{{Hook}}` (pick one strong signal)

- [ ] Site: new service, portal, careers, locations, tech badges
- [ ] LinkedIn: hiring, tool mentions, posts about incidents/insurance
- [ ] News / Google Business: expansion, awards, incidents (be careful / factual)
- [ ] Stack clues: Microsoft 365, specific vendors, remote work language

Write the hook as **one concrete sentence**. If it could apply to any company, rewrite it.

## 4) Compliance pass

- [ ] Public / permissioned contact path
- [ ] No scraped “secret” employee emails from dubious sources
- [ ] No sensitive personal data stored in the tracker beyond what’s needed

## 5) Log it

Add a row to `tracker.csv` **before** sending Email 1:

- company, contact, email, industry, hook, status=`queued` → `email1_sent`
