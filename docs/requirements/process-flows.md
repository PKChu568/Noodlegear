# Process flows

How work moves through Noodlegear. Diagrams are Mermaid (they render on GitHub). Status names match
`tokens/noodlegear.tokens.json → status.domains` exactly.

## 1. Learner journey (end to end)

```mermaid
flowchart LR
    A["Enquiry<br/>(phone, web form, walk-in)"] --> B["Register learner<br/>SCR-12"]
    B --> C{"Ready to start?"}
    C -- "Not yet" --> D["Status: enquiry<br/>follow-up later"]
    C -- "Yes" --> E["Status: active"]
    E --> F["Sell package or<br/>pay as you go<br/>SCR-74"]
    F --> G["Book lessons<br/>SCR-21"]
    G --> H["Lessons delivered,<br/>attendance + progress<br/>SCR-22"]
    H --> I{"Skills at level 4+?"}
    I -- "No" --> G
    I -- "Yes" --> J["Instructor marks<br/>test ready"]
    J --> K["Book driving test<br/>SCR-41"]
    K --> L{"Result"}
    L -- "Pass" --> M["Status: passed"]
    L -- "Fail" --> G
```

## 2. Learner status lifecycle

```mermaid
stateDiagram-v2
    [*] --> enquiry: Registered without lessons
    [*] --> active: Registered and starting
    enquiry --> active: First lesson booked
    enquiry --> withdrawn: No longer interested
    active --> onHold: Paused (reason required)
    onHold --> active: Resumed
    active --> testReady: Instructor marks ready
    testReady --> active: More lessons needed
    testReady --> passed: Test passed
    active --> withdrawn: Leaves school
    onHold --> withdrawn: Leaves school
    passed --> [*]
    withdrawn --> [*]
```

## 3. Booking a lesson (reception, while on a call)

```mermaid
flowchart TD
    S["Caller asks for a lesson"] --> F["Find learner<br/>header search or SCR-10"]
    F --> N{"Found?"}
    N -- "No" --> R["Register learner<br/>SCR-12"] --> B
    N -- "Yes" --> ST{"Learner status active?"}
    ST -- "On hold / withdrawn" --> X["Explain, offer to reactivate<br/>(BR-04)"]
    ST -- "Yes" --> B["Open Book lesson<br/>from schedule slot or learner"]
    B --> P["Choose lesson type, instructor,<br/>date, time (vehicle pre-filled)"]
    P --> V{"Checks"}
    V -- "Clash (BR-01)" --> C["Show clash + next free slot"] --> P
    V -- "Outside hours (BR-02)" --> W["Warning; Admin may override"] --> P
    V -- "Overdue balance" --> O["Warning shown, booking allowed"] --> OK
    V -- "OK" --> OK["Save"]
    OK --> E["Toast + confirmation email<br/>credit reserved if package"]
```

## 4. Lesson lifecycle

```mermaid
stateDiagram-v2
    [*] --> scheduled: Booked
    scheduled --> rescheduled: Moved (new lesson created)
    scheduled --> cancelled: Cancelled (reason, fee rule)
    scheduled --> inProgress: Start time reached
    inProgress --> completed: Instructor records attendance
    inProgress --> noShow: Learner did not attend
    scheduled --> noShow: Recorded after the fact
    completed --> [*]
    cancelled --> [*]
    noShow --> [*]
    rescheduled --> [*]
```

`inProgress` is derived from the clock (not stored); `rescheduled` keeps the history of the original slot.

## 5. Instructor's lesson day

```mermaid
sequenceDiagram
    actor I as Instructor (tablet)
    participant N as Noodlegear
    participant O as Office
    I->>N: Open "My day" (SCR-03)
    N-->>I: Lessons in time order, pick-up, notes, balance flag
    I->>N: Open lesson record (SCR-22) after the lesson
    I->>N: Attendance = completed, rate skills, add note
    N->>N: Invoice line or consume package credit (A-05)
    N-->>O: Lesson appears as recorded on the register (SCR-30)
    alt Learner did not turn up
        I->>N: Attendance = no-show
        N-->>O: No-show fee proposed (Q-04)
    end
```

## 6. Invoicing and payment

```mermaid
flowchart LR
    L["Completed pay-as-you-go lesson"] --> IL["Invoice line"]
    M["Manual charge<br/>(test fee, package)"] --> IL
    IL --> D["Draft invoice"]
    D --> IS["Issue: number INV-YYYY-nnnn<br/>status issued (immutable)"]
    IS --> P["Record payment<br/>SCR-73"]
    P --> AL["Allocate oldest first"]
    AL --> Q{"Fully paid?"}
    Q -- "Yes" --> PD["Invoice: paid"]
    Q -- "Part" --> PP["Payment status: partiallyPaid"]
    IS -. "due date passed" .-> OV["overdue (derived)"]
    IS -- "Mistake" --> V["Void or credit note<br/>(Admin)"]
```

## 7. Driving test

```mermaid
flowchart LR
    TR["Learner: testReady"] --> BK["Record test booking<br/>date, centre, DVSA ref (SCR-41)"]
    BK --> RS["Reserve car + instructor<br/>for test slot (US-TST-02)"]
    RS --> PL["Optional: warm-up lesson<br/>before test"]
    PL --> DAY["Test day"]
    DAY --> RES{"Result"}
    RES -- "Pass" --> PS["Learner passed<br/>offer to cancel future lessons"]
    RES -- "Fail" --> FL["Record faults<br/>learner back to active, book lessons"]
```

## 8. Vehicle compliance

```mermaid
flowchart LR
    D["Nightly check<br/>MOT, insurance, tax, service"] --> W{"Due within 30 days?"}
    W -- "Yes" --> A["Needs attention item<br/>badge: warning"]
    W -- "No" --> OK["No action"]
    D --> E{"Expired?"}
    E -- "Yes" --> B["Block from bookings (BR-10)<br/>badge: danger, suggest off road"]
```

---

## Business rules catalogue

| ID | Rule | Enforced in |
|---|---|---|
| BR-01 | An instructor, a vehicle and a learner can each be in only one non-cancelled lesson at any moment. | Database exclusion constraint + API (409 Conflict) |
| BR-02 | Lessons must fall within the instructor's working hours and outside absences (Admin can override). | API validation |
| BR-03 | Bookings start on 15-minute boundaries; minimum length 30 minutes. | API validation |
| BR-04 | Only `active` or `testReady` learners can be booked. | API validation |
| BR-05 | A lesson can be recorded from its start until 7 days after; later changes need Admin. | API authorisation |
| BR-10 | A vehicle with an expired MOT, insurance or road tax cannot be used in a lesson. | API validation |
| BR-11 | An instructor with an expired ADI badge cannot be assigned new lessons. | API validation |
| BR-20 | Instructors see only their own lessons and the learners they teach. | API resource-based authorisation |
| BR-21 | Instructors never see invoice or payment amounts, only a "balance outstanding" flag. | API response shaping |
| BR-22 | Changes to money, statuses and users are audited. | API + database |
| BR-23 | Navigation hides what a role cannot access. | Frontend |
| BR-30 | Money is decimal; issued invoices are immutable; invoice numbers have no gaps. | Database + API |
| BR-31 | Payments are allocated oldest invoice first unless staff choose otherwise; leftovers become learner credit. | API |
| BR-32 | Package credit is consumed on lesson completion, not on booking (released if cancelled). | API |
| BR-40 | All times are stored in UTC and shown in `Europe/London`. | API + frontend helpers |
