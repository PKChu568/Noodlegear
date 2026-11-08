# Open questions and assumptions

The requirements were written with these assumptions. Each one is a decision for the owner. Answer
by editing the **Decision** column (or tell Claude), then the stories and wireframes are updated.

## Assumptions

| ID | Assumption | Affects | Decision |
|---|---|---|---|
| A-01 | The school operates in the UK: DVSA practical tests, ADI instructors, MOT, GBP, `Europe/London`. | Everything | |
| A-02 | One school; branches are optional and off by default. | Settings, filters | |
| A-03 | Lessons are booked by staff only. No learner self-booking in the first release. | Lessons | |
| A-04 | Payments are taken outside Noodlegear (card terminal, cash, bank transfer) and **recorded** in it. | Billing | |
| A-05 | Pay-as-you-go lessons are invoiced **when the lesson is completed**; package lessons consume prepaid credit instead. | Billing | |
| A-06 | Emails (confirmations, reminders, receipts) are sent by Noodlegear. SMS is out of scope. | Notifications | |
| A-07 | A person has exactly one role. An owner who teaches signs in as Owner and also sees their own lessons. | Roles | |
| A-08 | Standard lesson lengths are 60, 90 and 120 minutes; bookings start on 15-minute boundaries. | Scheduling | |
| A-09 | Each lesson uses one vehicle; the instructor's default vehicle is pre-selected. | Scheduling | |
| A-10 | The progress syllabus is a fixed list of skills (based on the DVSA "Driver's record" topics), each assessed 1–5. | Progress | |
| A-11 | Invoice numbers are `INV-YYYY-nnnn`, sequential with no gaps, restarting each year. | Billing | |
| A-12 | Learner data for passed or withdrawn learners is kept for 6 years (financial records), then anonymised. | GDPR | |

## Questions

| ID | Question | Why it matters | Options | Decision |
|---|---|---|---|---|
| Q-01 | Does the school have more than one branch? | Adds a branch filter to most lists and a branch on instructors, vehicles and lessons. | No / Yes (how many) | |
| Q-02 | Should learners get their own login (view lessons, pay, book)? | A learner portal is a separate product surface with its own security. | Not now / Later / First release | |
| Q-03 | What is the cancellation policy? | Drives the late-cancellation fee and the cancel dialog. | e.g. less than 48 h notice → full lesson fee | |
| Q-04 | How are no-shows charged? | Billing rule for `noShow`. | Full fee / Partial / None | |
| Q-05 | Do packages expire? | Credit handling and reminders. | Never / After N months | |
| Q-06 | Can a package be refunded part-used? | Refund calculation. | No / Pro-rata | |
| Q-07 | Is VAT charged? | Invoice layout and totals. | Not VAT registered / VAT at 20% | |
| Q-08 | Can instructors cancel their own lessons, or only request cancellation? | Permission and approval flow. | Cancel / Request only | |
| Q-09 | Do instructor absences need approval? | Approval queue on the admin dashboard. | Yes / No | |
| Q-10 | Are instructors employees or franchisees, and does Noodlegear calculate their pay? | Payroll is currently out of scope. | Out of scope / Report only / Full payroll | |
| Q-11 | Which payment methods are accepted? | Payment form options. | Card, cash, bank transfer, other | |
| Q-12 | Should the system send automatic payment reminders for overdue invoices? | Notification rules. | No / At N days overdue | |
| Q-13 | Are pick-up locations per lesson or per learner? | Lesson form and "My day". | Per learner (default address) with per-lesson override | |
| Q-14 | Does the school book driving tests itself (DVSA business account) or do learners book them? | Test booking flow. | School / Learner / Both | |

## Design-system additions proposed by the wireframes

The wireframes needed a few things the design system does not yet document. Following AGENTS.md §8,
they are **proposals**, drawn in the wireframes but not yet added to `docs/`:

| ID | Proposal | Where used | Notes |
|---|---|---|---|
| P-01 | **Sign-in page** pattern: centred 400px surface on the canvas, product mark, email and password fields, primary "Sign in" button. No illustration. | SCR-00 | Not in `patterns.md` (only signed-in pages are). |
| P-02 | **Schedule grid** details: 15-minute rows of 12px, instructor columns, lesson block layout and status border colours. | SCR-20, SCR-03 | `patterns.md §3.6` describes it; the grid metrics are new. |
| P-03 | **Skill level meter**: five 8×8px squares filled with the brand colour, with the number as text. | SCR-11, SCR-22, SCR-30 | Learner progress needs a compact per-skill indicator. |
| P-04 | **Compliance date cell**: a date plus a status badge ("Due in 12 days" warning, "Expired" danger). | SCR-60, SCR-61 | Uses existing badge tones; codifies the thresholds (30 days = warning). |
