# User stories

Format: *As a **role**, I want **capability**, so that **benefit**.* Priority is MoSCoW for the first
release. Acceptance criteria use Given / When / Then and are written for the stories where behaviour
is not obvious. Business rules (`BR-nn`) apply wherever they are referenced.

---

## AUTH: Access

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-AUTH-01 | As a **staff member**, I want to sign in with my email and password, so that only authorised people can use the system. | Must | SCR-00 |
| US-AUTH-02 | As a **staff member**, I want to reset a forgotten password by email, so that I don't need to call the office. | Must | SCR-00 |
| US-AUTH-03 | As a **staff member**, I want to be signed out after 8 hours of inactivity, so that a shared office PC is safe. | Should | — |
| US-AUTH-04 | As an **owner/admin**, I want to invite users and assign a role, so that each person sees only what they need. | Must | SCR-90 |

**US-AUTH-01**
- Given valid credentials, when I sign in, then I land on my role's dashboard.
- Given wrong credentials, when I sign in, then I see "Email or password is incorrect" without saying which,
  and the password field is cleared.
- Given 5 failed attempts in 15 minutes, then the account is locked for 15 minutes and the message says so.

---

## DSH: Dashboards

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-DSH-01 | As an **owner/admin**, I want a dashboard with today's lessons, money due and things needing attention, so that I can run the day at a glance. | Must | SCR-01 |
| US-DSH-02 | As a **receptionist**, I want a "Today" view of all lessons by time with quick actions, so that I can answer calls and check learners in quickly. | Must | SCR-02 |
| US-DSH-03 | As an **instructor**, I want "My day": my lessons in order with learner, pick-up location and notes, so that I can plan my day from the car. | Must | SCR-03 |
| US-DSH-04 | As an **owner/admin**, I want a "Needs attention" list (overdue invoices, compliance due, unassigned lessons, absence requests), so that nothing is missed. | Must | SCR-01 |

**US-DSH-04**
- The list shows, in this order: lessons without an instructor in the next 7 days; vehicles with MOT,
  insurance or service due within 30 days or expired; invoices overdue; absence requests awaiting approval.
- Each item links to the record. Empty list shows "Nothing needs your attention" (no empty-state icon).

---

## LRN: Learners

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-LRN-01 | As a **receptionist**, I want to register a new learner (enquiry or active) during a phone call, so that I can book their first lesson straight away. | Must | SCR-12 |
| US-LRN-02 | As **staff**, I want to search learners by name, ID, phone or email, so that I find the right person in seconds. | Must | SCR-10 |
| US-LRN-03 | As **staff**, I want to filter learners by status, instructor and transmission, so that I can work through a group (e.g. all test-ready learners). | Must | SCR-10 |
| US-LRN-04 | As **staff**, I want a quick-view panel from the list, so that I can check details without losing my place. | Should | SCR-10 |
| US-LRN-05 | As **staff**, I want a learner record showing profile, upcoming lessons, balance, tests and progress, so that I have the full picture in one place. | Must | SCR-11 |
| US-LRN-06 | As **staff**, I want to put a learner on hold or withdraw them with a reason, so that they are not booked by mistake. | Must | SCR-11 |
| US-LRN-07 | As an **instructor**, I want to mark my learner "test ready", so that the office can book a driving test. | Must | SCR-11, SCR-22 |
| US-LRN-08 | As **staff**, I want to add notes to a learner, so that colleagues know preferences and history. | Should | SCR-11 |
| US-LRN-09 | As an **owner/admin**, I want to anonymise a learner on request, so that we comply with UK GDPR. | Should | SCR-11 |
| US-LRN-10 | As **staff**, I want to be warned about a possible duplicate (same name and date of birth, or same email or phone), so that we don't create two records. | Should | SCR-12 |

**US-LRN-01**
- Required: first name, last name, mobile or email (at least one), transmission preference.
  Required for status Active: date of birth, address. Optional: provisional licence number, notes.
- Licence number is validated against the UK format (16 characters) when entered.
- Learners under 17 on the entered date of birth trigger a warning "Learner can drive from 17", not an error.
- On save: a display ID `L-nnnnn` is assigned, a toast confirms, and the learner record opens with
  "Book lesson" as the primary action.

**US-LRN-06**
- On hold / withdrawn requires a reason (list + free text).
- Given future lessons exist, the dialog lists them and offers "Cancel these lessons" (default on).
- Learners on hold cannot be booked; the booking dialog explains why (BR-04).

---

## LES: Lessons and scheduling

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-LES-01 | As a **receptionist**, I want a day schedule with one column per instructor, so that I can see free slots at a glance. | Must | SCR-20 |
| US-LES-02 | As **staff**, I want a week view for one instructor, so that I can plan regular slots. | Should | SCR-20 |
| US-LES-03 | As a **receptionist**, I want to book a lesson by choosing learner, lesson type, instructor, date and time, so that it is in the diary. | Must | SCR-21 |
| US-LES-04 | As a **receptionist**, I want to click an empty slot to start a booking with instructor and time pre-filled, so that booking takes fewer steps. | Must | SCR-20, SCR-21 |
| US-LES-05 | As **staff**, I want to be stopped from double-booking an instructor, vehicle or learner, so that the diary stays correct. | Must | SCR-21 |
| US-LES-06 | As **staff**, I want to book a series (e.g. every Tuesday 10:00 for 6 weeks), so that regular learners are booked once. | Should | SCR-21 |
| US-LES-07 | As **staff**, I want to reschedule a lesson, so that changes are quick and the learner is notified. | Must | SCR-21, SCR-23 |
| US-LES-08 | As **staff**, I want to cancel a lesson with a reason, so that the slot is freed and fees are applied correctly. | Must | SCR-23 |
| US-LES-09 | As a **learner** (via staff), I want an email confirmation and a reminder 24 hours before, so that I don't forget. | Should | — |
| US-LES-10 | As **staff**, I want to see why a slot is unavailable (outside working hours, absence), so that I don't try to book it. | Should | SCR-20 |

**US-LES-03 / US-LES-05**
- Lesson type sets the default duration and price; instructor sets the default vehicle (A-09).
- Only active learners can be booked (BR-04). If the learner has an overdue balance, a warning
  MessageBar shows the amount but booking is allowed (*Q-03 may change this*).
- If the learner has package credit, the dialog shows "Uses 1 of 4 remaining package lessons".
- **BR-01** An instructor, a vehicle and a learner can each be in only one non-cancelled lesson at any
  moment. Given an overlap, when I try to save, then the dialog shows an error naming the clash
  ("Sam Patel already has a lesson from 14:00 to 15:00") and suggests the next free slot. The rule is
  enforced in the database too, so two receptionists booking at the same moment cannot both succeed.
- **BR-02** Lessons must be inside the instructor's working hours and not during an absence; the
  dialog shows a warning with an "Override" checkbox for Owner/Admin only.
- On save: toast "Lesson booked", the schedule shows the block, and a confirmation email is queued.

**US-LES-08**
- Cancellation reason is required: learner request, instructor unavailable, vehicle unavailable, weather, other.
- Given the learner cancels with less notice than the policy (*Q-03*), then a late-cancellation fee
  line is proposed, and staff can waive it with a reason.
- Cancelled lessons stay visible (struck-through state in the list, hidden in the schedule grid by default).

---

## ATT: Attendance and progress

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-ATT-01 | As an **instructor**, I want to mark a lesson completed, no-show or late, so that attendance and billing are correct. | Must | SCR-22, SCR-03 |
| US-ATT-02 | As an **instructor**, I want to rate the skills covered in a lesson (1–5), so that the learner's progress is tracked. | Must | SCR-22 |
| US-ATT-03 | As an **instructor**, I want to add a short lesson note, so that the next instructor or I know what to work on. | Must | SCR-22 |
| US-ATT-04 | As **staff**, I want an attendance register by date, so that I can resolve lessons not yet recorded. | Should | SCR-30 |
| US-ATT-05 | As an **instructor or owner**, I want a learner progress overview across all skills, so that I can judge test readiness. | Must | SCR-11, SCR-30 |

**US-ATT-01**
- Recording is possible from the lesson start time until 7 days after; later changes need Admin.
- `completed` → pay-as-you-go: an invoice line is created (A-05); package: one credit is consumed.
- `noShow` → charged per *Q-04*. `late` is a completed lesson with a "late" attendance mark.
- Lessons still `scheduled` 2 hours after their end appear in "Needs attention" and the register.

**US-ATT-02**
- The instructor sees the full syllabus, with skills covered last lesson pre-expanded.
- Levels: 1 Introduced, 2 Under instruction, 3 Prompted, 4 Seldom prompted, 5 Independent.
- A learner reaching level 4+ on every skill shows a "Ready for test?" suggestion to the instructor.

---

## TST: Driving tests

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-TST-01 | As **staff**, I want to record a booked practical test (date, time, centre, DVSA reference), so that we can plan a lesson before it. | Must | SCR-40, SCR-41 |
| US-TST-02 | As **staff**, I want the test-day car and instructor reserved automatically, so that nothing else is booked over the test. | Should | SCR-41 |
| US-TST-03 | As **staff or instructor**, I want to record the result (pass / fail, faults), so that the learner record is complete. | Must | SCR-40 |
| US-TST-04 | As an **owner**, I want the pass rate per instructor, so that I can support instructors. | Should | SCR-81 |

**US-TST-03**
- Pass → learner status becomes `passed`, future lessons are offered for cancellation.
- Fail → learner stays `testReady` = false and returns to `active`; staff are prompted to book more lessons.

---

## INS: Instructors

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-INS-01 | As an **admin**, I want to add an instructor with ADI number and badge expiry, so that only qualified instructors are booked. | Must | SCR-50, SCR-51 |
| US-INS-02 | As an **admin**, I want to set each instructor's weekly working hours, so that the schedule shows available time. | Must | SCR-51 |
| US-INS-03 | As an **instructor**, I want to request time off, so that I'm not booked while away. | Must | SCR-51 |
| US-INS-04 | As an **admin**, I want to see instructor utilisation this week, so that I can balance workload. | Should | SCR-50 |
| US-INS-05 | As an **admin**, I want a warning 60 days before an ADI badge expires, so that the instructor renews it. | Should | SCR-01, SCR-51 |

---

## VEH: Vehicles

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-VEH-01 | As an **admin**, I want to register a car with transmission and default instructor, so that it can be used in lessons. | Must | SCR-60, SCR-61 |
| US-VEH-02 | As an **admin**, I want to track MOT, insurance, road tax and service dates, so that no car is used illegally. | Must | SCR-61 |
| US-VEH-03 | As **staff**, I want an "off road" status with a reason, so that the car can't be booked while being repaired. | Must | SCR-61 |
| US-VEH-04 | As an **instructor**, I want to report a defect, so that the office can arrange a repair. | Should | SCR-61 |

**US-VEH-02**
- **BR-10** A vehicle with an expired MOT, insurance or road tax cannot be selected for a lesson.
- Due within 30 days → warning badge and "Needs attention" item; expired → danger badge, status `offRoad` suggested.

---

## BIL: Billing

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-BIL-01 | As **staff**, I want invoices generated from completed pay-as-you-go lessons, so that billing is not manual. | Must | SCR-70 |
| US-BIL-02 | As **staff**, I want to create a manual invoice (e.g. test fee, package), so that every charge is recorded. | Must | SCR-70, SCR-71 |
| US-BIL-03 | As **staff**, I want to record a payment and allocate it to one or more invoices, so that balances are accurate. | Must | SCR-73 |
| US-BIL-04 | As **staff**, I want to sell a package (e.g. 10 lessons) and track remaining credit, so that prepaid lessons are honoured. | Must | SCR-74, SCR-11 |
| US-BIL-05 | As **staff**, I want to email an invoice or receipt as PDF, so that learners have a record. | Should | SCR-71 |
| US-BIL-06 | As an **admin**, I want to void an issued invoice or issue a credit note, never edit it, so that the books stay auditable. | Must | SCR-71 |
| US-BIL-07 | As an **admin**, I want a list of overdue invoices with days overdue, so that I can chase them. | Must | SCR-70 |
| US-BIL-08 | As an **admin**, I want to refund a payment with a reason, so that refunds are traceable. | Should | SCR-72 |

**US-BIL-03**
- Amount, date, method and learner are required. Allocation defaults to the oldest unpaid invoices first.
- Unallocated amounts are kept as learner credit and shown on the learner record.
- On save: toast "Payment recorded", receipt email offered, invoice statuses update (`paid` / `partiallyPaid`).
- **BR-30** Money is stored as decimals (never floats); an issued invoice is immutable; invoice numbers have no gaps.

---

## RPT: Reports

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-RPT-01 | As an **owner**, I want lessons delivered and revenue per week, so that I can see how the school is doing. | Must | SCR-81 |
| US-RPT-02 | As an **owner/admin**, I want instructor utilisation (booked hours ÷ available hours), so that I can plan staffing. | Should | SCR-80 |
| US-RPT-03 | As an **admin**, I want an aged debtors report, so that I can chase overdue money. | Must | SCR-80 |
| US-RPT-04 | As an **owner**, I want pass rates by instructor and test centre, so that I can improve results. | Should | SCR-80 |
| US-RPT-05 | As an **owner/admin**, I want to export any report to CSV, so that I can share it with my accountant. | Must | SCR-80, SCR-81 |

Reports show a summary table first; a chart only where it answers the question (design-principles §9).

---

## SET: Settings

| ID | Story | Priority | Screens |
|---|---|---|---|
| US-SET-01 | As an **owner**, I want to edit the school profile (name, address, contact, logo), so that invoices and emails are correct. | Must | SCR-90 |
| US-SET-02 | As an **admin**, I want to manage lesson types and prices, so that bookings use the right duration and fee. | Must | SCR-90 |
| US-SET-03 | As an **admin**, I want to manage packages, so that staff can sell them. | Must | SCR-90 |
| US-SET-04 | As an **owner**, I want to set school opening hours and closed days, so that bookings respect them. | Should | SCR-90 |
| US-SET-05 | As an **owner/admin**, I want to manage users and roles, so that access is controlled. | Must | SCR-90 |
| US-SET-06 | As an **owner**, I want to set the cancellation policy and reminder timings, so that rules match our terms. | Should | SCR-90 |
