# Roles and permissions

## 1. Personas

Personas describe the real people behind each role. Design decisions should be checked against them:
*"would Dilani at the front desk find this quicker or slower?"*

### Owner: Ruwan, 52, owns Northside Driving School
- Also teaches a few lessons a week. Uses a laptop in the office and a tablet in the car.
- **Goals:** know the school is profitable; keep cars legal and on the road; keep instructors busy.
- **Pain points:** finds out about unpaid balances and expired MOTs too late; can't see utilisation
  without a spreadsheet.
- **Key screens:** owner dashboard, reports, invoices, vehicles, settings.

### Administrator: Priya, 34, office manager
- Full-time at a desktop. Runs billing, compliance, instructor rotas and user accounts.
- **Goals:** invoices out on time, payments matched, no double-bookings, accurate records.
- **Pain points:** chasing overdue payments by hand; reconciling paper diaries.
- **Key screens:** dashboard, invoices, payments, instructors (availability), vehicles, settings.

### Receptionist: Dilani, 27, front desk
- On the phone most of the day; often books a lesson while the learner is still on the call.
- **Goals:** find a free slot in seconds; register a new learner without leaving the call; take a
  payment and send a receipt.
- **Pain points:** switching between diaries; not knowing if a learner owes money before booking.
- **Key screens:** reception "Today" dashboard, schedule, learners, book lesson, record payment.

### Instructor: Sam, 41, ADI (Approved Driving Instructor)
- Spends the day in the car. Uses a phone or tablet between lessons, in short bursts.
- **Goals:** see today's lessons and where to pick learners up; record attendance and progress in
  under a minute; know which learners are test-ready.
- **Pain points:** paper progress cards; finding out about cancellations late.
- **Key screens:** "My day", lesson record, my learners, my availability.

## 2. Roles

| Role | Who | Scope of data |
|---|---|---|
| **Owner** | School owner(s) | Everything, including financial reports and users. |
| **Admin** | Office manager | Everything except changing the owner account and school ownership settings. |
| **Receptionist** | Front-desk staff | Learners, scheduling, tests, payments; read-only instructors and vehicles; no reports or settings. |
| **Instructor** | Approved driving instructors | **Only their own** lessons, learners they teach, their availability; no financial data beyond a learner's "balance outstanding" flag. |

An instructor who is also the owner signs in once with the Owner role (roles do not combine; the
higher role wins) and still sees "My day" when they are the lesson's instructor (*Assumption* A-07).

## 3. Permission matrix

`✓` full · `R` read only · `Own` only their own records · `—` no access

| Area / action | Owner | Admin | Receptionist | Instructor |
|---|---|---|---|---|
| **Dashboard** | Owner | Admin | Reception "Today" | "My day" |
| **Learners**: view list & details | ✓ | ✓ | ✓ | Own (learners they teach) |
| Learners: create / edit | ✓ | ✓ | ✓ | — |
| Learners: change status (on hold, withdrawn) | ✓ | ✓ | ✓ | — |
| Learners: mark "test ready" | ✓ | ✓ | — | Own |
| Learners: delete / anonymise (GDPR) | ✓ | ✓ | — | — |
| **Lessons**: view schedule | ✓ | ✓ | ✓ | Own |
| Lessons: book / reschedule / cancel | ✓ | ✓ | ✓ | Own: request cancel only (*Q-08*) |
| Lessons: record attendance & notes | ✓ | ✓ | ✓ | Own |
| **Progress**: assess skills | ✓ | R | R | Own |
| **Driving tests**: view | ✓ | ✓ | ✓ | Own |
| Driving tests: book / record result | ✓ | ✓ | ✓ | Record result: Own |
| **Instructors**: view | ✓ | ✓ | R | Own profile |
| Instructors: create / edit | ✓ | ✓ | — | — |
| Instructors: edit availability & absences | ✓ | ✓ | — | Own (absence requests need approval, *Q-09*) |
| **Vehicles**: view | ✓ | ✓ | R | R (assigned vehicle) |
| Vehicles: create / edit / compliance dates | ✓ | ✓ | — | — |
| Vehicles: report a defect | ✓ | ✓ | ✓ | ✓ |
| **Invoices**: view | ✓ | ✓ | ✓ | — |
| Invoices: create / issue | ✓ | ✓ | ✓ | — |
| Invoices: void / credit | ✓ | ✓ | — | — |
| **Payments**: record | ✓ | ✓ | ✓ | — |
| Payments: refund / void | ✓ | ✓ | — | — |
| **Packages**: sell to learner | ✓ | ✓ | ✓ | — |
| **Reports**: operational (lessons, utilisation) | ✓ | ✓ | — | — |
| Reports: financial (revenue, debtors) | ✓ | ✓ | — | — |
| **Settings**: school profile, lesson types, prices, packages, hours | ✓ | ✓ | — | — |
| Settings: users & roles | ✓ | ✓ (cannot edit Owner) | — | — |
| **Audit log**: view | ✓ | ✓ | — | — |

### Rules behind the matrix

- **BR-20** Instructors can only see learners who have, or had, a lesson with them, and only their own
  lessons. This is enforced in the API by resource-based authorisation, not only by hiding UI.
- **BR-21** Instructors never see invoice or payment amounts. They see a single flag on the learner
  ("Balance outstanding") so they know not to start a lesson that the school has put on hold.
- **BR-22** Every change to money, statuses and users is written to the audit log (who, what, when,
  before/after).
- **BR-23** Navigation items a role cannot access are hidden, not disabled.
