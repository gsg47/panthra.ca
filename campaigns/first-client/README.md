# PANTHRA — First-Client Email Campaign

Outbound playbook to land PANTHRA’s first paying clients in Calgary and across Alberta. Keep every message short, specific, and useful — no buzzword dumps.

**Brand line:** Silent protection. Absolute security.  
**Site:** https://panthra.ca  
**Contact:** contact@panthra.ca · +1 587-816-0621

---

## Goal

Book discovery calls with owners / ops / IT leads at SMBs that feel security risk but do not have an enterprise security team.

Primary offer to open with:

1. A free 30-minute security pulse check (email, identities, backups, one “what if we’re hit” scenario)
2. A clear follow-up: optional paid assessment or monitoring starter

Success metric for this kit: **3 booked calls from 40–60 personalized sends**.

---

## Ideal customer profile (ICP)

| Fit | Details |
| --- | --- |
| Size | ~8–120 employees |
| Geography | Calgary first, then Alberta / Prairie corridor |
| Industries | Professional services, clinics / health-adjacent, energy services, construction / trades with field staff, accounting / legal |
| Triggers | Recent phishing scare, new remote staff, insurance / client questionnaire, Microsoft 365 growth, no dedicated IT security |
| Buyer | Owner, office manager, clinic director, operations lead, IT manager (if present) |

Disqualify: pure consumer freelancers, companies with a full in-house SOC, or anyone asking for “unlimited free audits.”

---

## Sequence overview

| Day | Touch | File |
| --- | --- | --- |
| 0 | Email 1 — relevant observation + soft | `emails/sequence-core.md` |
| 3–4 | Email 2 — proof / scenario | `emails/sequence-core.md` |
| 8–10 | Email 3 — soft break-up + open door | `emails/sequence-core.md` |

Industry tweaks live in `emails/industry-variants.md`.  
Reply handling lives in `emails/reply-scripts.md`.

Rules:

- Personalize the first 1–2 sentences every time (use `prospects/research-checklist.md`)
- One CTA per email
- Send Tue–Thu, 8:30–10:30 MT when possible
- Cap at ~15 new prospects / day so quality stays high
- Log every send and reply in `prospects/tracker.csv`

---

## Weekly operating rhythm

1. **Mon** — pick 15–20 prospects, research, fill tracker
2. **Tue–Thu** — send Email 1 / follow-ups; handle replies same day
3. **Fri** — review reply rate, book calls, refine subject lines

---

## Email signature

Install the HTML signature before sending. Preview and copy helpers:

- Live preview: `/campaigns/first-client/signature/preview.html`
- Docs: `signature/README.md`
- Hosted logo (for real emails):  
  `https://panthra.ca/assets/email-signature/panthra-sig-72.png`

---

## Compliance & tone

- No fake urgency, no fear-mongering screenshots, no purchased spam lists
- Only contact publicly listed or properly obtained business emails
- If someone opts out, mark `status=unsubscribed` and stop
- Sound like a competent local partner, not a global MSP brochure

---

## Folder map

```
campaigns/first-client/
├── README.md                 ← this playbook
├── emails/
│   ├── sequence-core.md
│   ├── industry-variants.md
│   └── reply-scripts.md
├── prospects/
│   ├── research-checklist.md
│   └── tracker.csv
└── signature/
    ├── README.md
    ├── preview.html
    ├── signature-full.html
    ├── signature-compact.html
    ├── signature-plain.txt
    └── panthra-sig-*.png
```

Public assets for signatures also live at:

```
assets/email-signature/panthra-sig-{48,72,96}.png
```
