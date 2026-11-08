/* Noodlegear wireframes: realistic sample data (fictional people and vehicles).
   Prototype "now" is Tuesday 10 Nov 2026, 11:20 (Europe/London). */
(function () {
  'use strict';
  const D = (window.NG.data = {});
  D.today = '2026-11-10';
  D.now = new Date('2026-11-10T11:20:00');
  const at = (t, day = D.today) => `${day}T${t}:00`;

  D.users = {
    owner: { name: 'Ruwan Fernando', role: 'Owner' },
    admin: { name: 'Priya Shah', role: 'Admin' },
    receptionist: { name: 'Dilani Perera', role: 'Reception' },
    instructor: { name: 'Sam Patel', role: 'Instructor', instructorId: 'I-025' },
  };

  D.instructors = [
    { id: 'I-021', name: 'Ruwan Fernando', adi: '412876', badge: '2027-03-31', trans: 'Manual', car: 'LB73 WNZ', status: 'onLesson', phone: '07700 900101', hours: 'Mon–Fri 08:00–18:00', week: 31, cap: 40, learners: 14, pass: 0.68 },
    { id: 'I-022', name: 'Sarah Mitchell', adi: '398214', badge: '2028-06-30', trans: 'Manual', car: 'YR22 HDF', status: 'available', phone: '07700 900102', hours: 'Mon–Sat 08:30–18:00', week: 36, cap: 40, learners: 17, pass: 0.71 },
    { id: 'I-023', name: 'Ayesha Khan', adi: '421907', badge: '2027-11-30', trans: 'Automatic', car: 'KX24 LMR', status: 'onLesson', phone: '07700 900103', hours: 'Tue–Sat 09:00–17:30', week: 28, cap: 36, learners: 12, pass: 0.62 },
    { id: 'I-024', name: 'Liam Turner', adi: '405533', badge: '2027-08-31', trans: 'Manual', car: 'MA23 PLE', status: 'onLeave', phone: '07700 900104', hours: 'Mon–Fri 09:00–17:00', week: 0, cap: 35, learners: 9, pass: 0.58, absence: 'On leave 9–13 Nov' },
    { id: 'I-025', name: 'Sam Patel', adi: '433120', badge: '2026-12-20', trans: 'Automatic', car: 'PF21 XKD', status: 'onLesson', phone: '07700 900105', hours: 'Mon–Fri 08:00–18:30', week: 34, cap: 40, learners: 15, pass: 0.66 },
  ];
  D.instructor = (id) => D.instructors.find((i) => i.id === id);

  D.learners = [
    { id: 'L-10234', name: 'Amaya Silva', ins: 'I-021', trans: 'Manual', status: 'active', next: at('10:00', '2026-11-12'), lessons: 14, balance: 120, overdue: true, credit: 0, phone: '07700 900123', email: 'amaya.silva@example.com', dob: '2007-03-14', postcode: 'NS4 7QT', address: '14 Elm Grove, Northside', licence: 'SILVA902125AM9IJ', joined: '2026-02-03' },
    { id: 'L-10241', name: 'Oliver Bennett', ins: 'I-022', trans: 'Manual', status: 'testReady', next: at('09:00', '2026-11-13'), lessons: 22, balance: 0, credit: 2, phone: '07700 900456', email: 'o.bennett@example.com', dob: '2006-08-02', postcode: 'NS2 1AB', address: '3 Mill Lane, Northside', licence: 'BENNE808026OB9KL', joined: '2026-01-12' },
    { id: 'L-10248', name: 'Priya Nair', ins: 'I-023', trans: 'Automatic', status: 'active', next: at('09:00', '2026-11-14'), lessons: 6, balance: 45, credit: 0, phone: '07700 900211', email: 'priya.nair@example.com', dob: '2008-01-22', postcode: 'NS1 4RT', address: '27 Station Road, Northside', licence: '', joined: '2026-09-20' },
    { id: 'L-10252', name: 'Kasun Perera', ins: 'I-021', trans: 'Manual', status: 'passed', next: null, lessons: 31, balance: 0, credit: 0, phone: '07700 900874', email: 'kasun.p@example.com', dob: '2005-11-09', postcode: 'NS3 9PL', address: '9 Hill Rise, Northside', licence: 'PEREI911095KP9MN', joined: '2025-11-18' },
    { id: 'L-10257', name: 'Sophie Clarke', ins: 'I-024', trans: 'Automatic', status: 'onHold', next: null, lessons: 9, balance: 210, overdue: true, credit: 0, phone: '07700 900333', email: 'sophie.c@example.com', dob: '2007-06-30', postcode: 'NS5 2DD', address: '61 Park View, Northside', licence: 'CLARK706307SC9QR', joined: '2026-05-04' },
    { id: 'L-10263', name: 'Daniel Okafor', ins: 'I-021', trans: 'Manual', status: 'active', next: at('14:00'), lessons: 17, balance: 0, credit: 5, phone: '07700 900519', email: 'd.okafor@example.com', dob: '2004-04-17', postcode: 'NS2 6GH', address: '5 Brook Street, Northside', licence: 'OKAFO404174DO9ST', joined: '2026-04-15' },
    { id: 'L-10266', name: 'Nimali Fernando', ins: 'I-023', trans: 'Automatic', status: 'active', next: at('11:00'), lessons: 3, balance: 60, credit: 0, phone: '07700 900602', email: 'nimali.f@example.com', dob: '2008-09-03', postcode: 'NS1 8JK', address: '18 Rose Court, Northside', licence: '', joined: '2026-10-08' },
    { id: 'L-10270', name: 'James Whitaker', ins: null, trans: 'Manual', status: 'enquiry', next: null, lessons: 0, balance: 0, credit: 0, phone: '07700 900147', email: 'j.whitaker@example.com', dob: '', postcode: 'NS4 3LM', address: '', licence: '', joined: '2026-11-09' },
    { id: 'L-10274', name: 'Hannah Lewis', ins: 'I-021', trans: 'Manual', status: 'testReady', next: at('08:00', '2026-11-17'), lessons: 25, balance: 0, credit: 1, phone: '07700 900788', email: 'hannah.l@example.com', dob: '2006-12-11', postcode: 'NS3 5UV', address: '40 Queens Road, Northside', licence: 'LEWIS612116HL9WX', joined: '2026-02-20' },
    { id: 'L-10279', name: 'Ravi Gunawardena', ins: 'I-022', trans: 'Automatic', status: 'withdrawn', next: null, lessons: 12, balance: 0, credit: 0, phone: '07700 900930', email: 'ravi.g@example.com', dob: '2003-02-26', postcode: 'NS6 1YZ', address: '2 Orchard Way, Northside', licence: 'GUNAW302263RG9AB', joined: '2026-03-01' },
    { id: 'L-10283', name: 'Ethan Brooks', ins: 'I-021', trans: 'Manual', status: 'active', next: at('11:00'), lessons: 8, balance: 0, credit: 3, phone: '07700 900241', email: 'ethan.b@example.com', dob: '2008-05-19', postcode: 'NS2 3CD', address: '11 Ash Close, Northside', licence: 'BROOK805198EB9CD', joined: '2026-08-11' },
    { id: 'L-10286', name: 'Zara Ahmed', ins: 'I-023', trans: 'Automatic', status: 'active', next: at('12:30'), lessons: 11, balance: 0, credit: 0, phone: '07700 900352', email: 'zara.a@example.com', dob: '2007-10-01', postcode: 'NS1 2EF', address: '7 Linden Avenue, Northside', licence: 'AHMED710017ZA9EF', joined: '2026-06-22' },
    { id: 'L-10289', name: 'Noah Clarke', ins: 'I-025', trans: 'Automatic', status: 'active', next: at('10:30'), lessons: 15, balance: 0, credit: 4, phone: '07700 900463', email: 'noah.c@example.com', dob: '2006-07-25', postcode: 'NS5 8GH', address: '22 Meadow Way, Northside', licence: 'CLARK607256NC9GH', joined: '2026-05-19' },
    { id: 'L-10292', name: 'George Hall', ins: 'I-025', trans: 'Automatic', status: 'testReady', next: at('14:30'), lessons: 28, balance: 0, credit: 0, phone: '07700 900574', email: 'george.h@example.com', dob: '2005-01-14', postcode: 'NS3 1IJ', address: '15 Church Lane, Northside', licence: 'HALLG501145GH9IJ', joined: '2026-01-30' },
    { id: 'L-10295', name: 'Ella Davies', ins: 'I-025', trans: 'Automatic', status: 'active', next: at('13:00'), lessons: 5, balance: 38, credit: 0, phone: '07700 900685', email: 'ella.d@example.com', dob: '2008-03-08', postcode: 'NS4 9KL', address: '8 Willow Drive, Northside', licence: '', joined: '2026-10-02' },
    { id: 'L-10298', name: 'Jack Wilson', ins: 'I-025', trans: 'Automatic', status: 'active', next: at('09:15', '2026-11-17'), lessons: 19, balance: 0, credit: 0, phone: '07700 900796', email: 'jack.w@example.com', dob: '2006-11-27', postcode: 'NS2 7MN', address: '33 Valley Road, Northside', licence: 'WILSO611276JW9MN', joined: '2026-03-23' },
  ];
  D.learner = (id) => D.learners.find((l) => l.id === id);
  D.byName = (n) => D.learners.find((l) => l.name === n);

  // Today's lessons. status derived against D.now (11:20).
  const L = (ins, start, mins, learner, type, status, pickup, note) => ({ ins, start: at(start), mins, learner, type, status, pickup, note });
  D.lessonsToday = [
    L('I-021', '08:00', 60, 'Hannah Lewis', 'Standard lesson', 'completed', 'Home · NS3 5UV'),
    L('I-021', '10:00', 60, 'Amaya Silva', 'Standard lesson', 'completed', 'Northside College'),
    L('I-021', '11:00', 60, 'Ethan Brooks', 'Standard lesson', 'inProgress', 'Home · NS2 3CD'),
    L('I-021', '14:00', 120, 'Daniel Okafor', 'Motorway lesson', 'scheduled', 'Home · NS2 6GH'),
    L('I-021', '16:30', 60, 'Amaya Silva', 'Standard lesson', 'scheduled', 'Northside College'),
    L('I-022', '08:30', 90, 'Oliver Bennett', 'Extended lesson', 'completed', 'Home · NS2 1AB'),
    L('I-022', '10:30', 60, 'Ravi Gunawardena', 'Standard lesson', 'noShow', 'Home · NS6 1YZ'),
    L('I-022', '13:30', 60, 'Oliver Bennett', 'Mock test', 'scheduled', 'Northside test centre'),
    L('I-022', '15:00', 60, 'Priya Nair', 'Standard lesson', 'scheduled', 'Station Road'),
    L('I-023', '09:00', 90, 'Priya Nair', 'Extended lesson', 'completed', 'Home · NS1 4RT'),
    L('I-023', '11:00', 60, 'Nimali Fernando', 'Standard lesson', 'inProgress', 'Rose Court'),
    L('I-023', '12:30', 120, 'Zara Ahmed', 'Double lesson', 'scheduled', 'Home · NS1 2EF'),
    L('I-023', '16:00', 60, 'Nimali Fernando', 'Standard lesson', 'scheduled', 'Rose Court'),
    L('I-025', '08:00', 60, 'Ella Davies', 'Standard lesson', 'completed', 'Home · NS4 9KL', 'Clutch control on hills next time.'),
    L('I-025', '09:15', 60, 'Jack Wilson', 'Standard lesson', 'scheduled', 'Home · NS2 7MN', 'Not recorded yet'),
    L('I-025', '10:30', 90, 'Noah Clarke', 'Extended lesson', 'inProgress', 'Home · NS5 8GH', 'Roundabouts and dual carriageways.'),
    L('I-025', '13:00', 60, 'Ella Davies', 'Standard lesson', 'scheduled', 'Northside College', 'Balance outstanding'),
    L('I-025', '14:30', 120, 'George Hall', 'Test day (warm-up + test)', 'scheduled', 'Home · NS3 1IJ', 'Test 15:40 at Northside test centre'),
    L('I-025', '17:00', 60, 'Jack Wilson', 'Standard lesson', 'scheduled', 'Home · NS2 7MN'),
  ];

  D.vehicles = [
    { reg: 'LB73 WNZ', model: 'Ford Fiesta 1.0 EcoBoost', trans: 'Manual', ins: 'I-021', status: 'inUse', mot: '2027-01-14', insurance: '2027-04-01', tax: '2027-02-28', service: '2026-12-02', miles: 18420 },
    { reg: 'YR22 HDF', model: 'Volkswagen Polo 1.0 TSI', trans: 'Manual', ins: 'I-022', status: 'available', mot: '2026-11-22', insurance: '2027-05-15', tax: '2027-01-31', service: '2027-03-10', miles: 46210 },
    { reg: 'KX24 LMR', model: 'Toyota Yaris Hybrid', trans: 'Automatic', ins: 'I-023', status: 'inUse', mot: '2027-09-03', insurance: '2027-06-30', tax: '2027-08-31', service: '2027-02-14', miles: 9870 },
    { reg: 'MA23 PLE', model: 'Vauxhall Corsa 1.2', trans: 'Manual', ins: 'I-024', status: 'available', mot: '2027-05-20', insurance: '2027-03-31', tax: '2027-04-30', service: '2027-01-19', miles: 22950 },
    { reg: 'PF21 XKD', model: 'Kia Picanto 1.25 Auto', trans: 'Automatic', ins: 'I-025', status: 'inUse', mot: '2027-07-08', insurance: '2027-02-01', tax: '2027-06-30', service: '2026-11-28', miles: 51340 },
    { reg: 'DA19 RTY', model: 'Ford Fiesta 1.1 (spare)', trans: 'Manual', ins: null, status: 'offRoad', mot: '2026-11-05', insurance: '2027-01-31', tax: '2027-01-31', service: '2026-10-30', miles: 78120, reason: 'Clutch replacement. Back 13 Nov.' },
  ];

  D.invoices = [
    { no: 'INV-2026-0151', learner: 'Ella Davies', issued: '2026-11-10', due: '2026-11-24', total: 38, paid: 0, status: 'issued', lines: [['Standard lesson · 60 min · 10 Nov 2026', 1, 38]] },
    { no: 'INV-2026-0150', learner: 'Daniel Okafor', issued: '2026-11-09', due: '2026-11-23', total: 350, paid: 350, status: 'paid', lines: [['Package · 10 lessons', 1, 350]] },
    { no: 'INV-2026-0149', learner: 'Priya Nair', issued: '2026-11-06', due: '2026-11-20', total: 102, paid: 57, status: 'issued', lines: [['Extended lesson · 90 min · 03 Nov 2026', 1, 57], ['Standard lesson · 60 min · 05 Nov 2026', 1, 45]] },
    { no: 'INV-2026-0148', learner: 'Nimali Fernando', issued: '2026-11-04', due: '2026-11-18', total: 60, paid: 0, status: 'issued', lines: [['Standard lesson · 60 min · 04 Nov 2026', 1, 38], ['Late cancellation fee · 02 Nov 2026', 1, 22]] },
    { no: 'INV-2026-0147', learner: 'George Hall', issued: '2026-11-02', due: '2026-11-16', total: 95, paid: 95, status: 'paid', lines: [['Test day · car hire and warm-up', 1, 95]] },
    { no: 'INV-2026-0146', learner: 'Amaya Silva', issued: '2026-10-14', due: '2026-10-28', total: 120, paid: 0, status: 'overdue', lines: [['Standard lesson · 60 min · 07 Oct 2026', 1, 38], ['Standard lesson · 60 min · 09 Oct 2026', 1, 38], ['Mock test · 60 min · 13 Oct 2026', 1, 44]] },
    { no: 'INV-2026-0145', learner: 'Sophie Clarke', issued: '2026-10-01', due: '2026-10-15', total: 210, paid: 0, status: 'overdue', lines: [['Standard lessons × 5 · September', 5, 42]] },
    { no: 'INV-2026-0144', learner: 'Oliver Bennett', issued: '2026-09-28', due: '2026-10-12', total: 350, paid: 350, status: 'paid', lines: [['Package · 10 lessons', 1, 350]] },
    { no: 'INV-2026-0143', learner: 'Ravi Gunawardena', issued: '2026-09-20', due: '2026-10-04', total: 38, paid: 0, status: 'void', lines: [['Standard lesson · 60 min (issued in error)', 1, 38]] },
    { no: 'INV-2026-0142', learner: 'Hannah Lewis', issued: '2026-09-15', due: '2026-09-29', total: 680, paid: 680, status: 'paid', lines: [['Package · 20 lessons', 1, 680]] },
  ];

  D.payments = [
    { ref: 'PAY-20419', learner: 'Daniel Okafor', at: '2026-11-09T16:12', amount: 350, method: 'Card', alloc: 'INV-2026-0150', status: 'paid', by: 'Dilani Perera' },
    { ref: 'PAY-20418', learner: 'Priya Nair', at: '2026-11-07T10:05', amount: 57, method: 'Bank transfer', alloc: 'INV-2026-0149', status: 'partiallyPaid', by: 'Priya Shah' },
    { ref: 'PAY-20417', learner: 'George Hall', at: '2026-11-02T14:40', amount: 95, method: 'Card', alloc: 'INV-2026-0147', status: 'paid', by: 'Dilani Perera' },
    { ref: 'PAY-20416', learner: 'Amaya Silva', at: '2026-11-07T09:12', amount: 60, method: 'Card', alloc: 'Learner credit', status: 'pending', by: 'Dilani Perera' },
    { ref: 'PAY-20415', learner: 'Ravi Gunawardena', at: '2026-10-28T11:30', amount: 120, method: 'Card', alloc: 'Package refund', status: 'refunded', by: 'Priya Shah' },
    { ref: 'PAY-20414', learner: 'Oliver Bennett', at: '2026-09-28T15:02', amount: 350, method: 'Cash', alloc: 'INV-2026-0144', status: 'paid', by: 'Dilani Perera' },
    { ref: 'PAY-20413', learner: 'Hannah Lewis', at: '2026-09-15T12:20', amount: 680, method: 'Bank transfer', alloc: 'INV-2026-0142', status: 'paid', by: 'Priya Shah' },
  ];

  D.tests = [
    { learner: 'George Hall', ins: 'I-025', at: '2026-11-10T15:40', centre: 'Northside', ref: '58213907', status: 'booked', car: 'PF21 XKD' },
    { learner: 'Oliver Bennett', ins: 'I-022', at: '2026-11-18T09:10', centre: 'Northside', ref: '58219442', status: 'booked', car: 'YR22 HDF' },
    { learner: 'Hannah Lewis', ins: 'I-021', at: '2026-11-24T13:50', centre: 'Eastfield', ref: '58224015', status: 'booked', car: 'LB73 WNZ' },
    { learner: 'Amaya Silva', ins: 'I-021', at: '2026-12-03T09:40', centre: 'Northside', ref: '58230871', status: 'booked', car: 'LB73 WNZ' },
    { learner: 'Kasun Perera', ins: 'I-021', at: '2026-11-02T11:20', centre: 'Northside', ref: '58190334', status: 'passed', faults: '4 minors', car: 'LB73 WNZ' },
    { learner: 'Jack Wilson', ins: 'I-025', at: '2026-10-27T14:30', centre: 'Eastfield', ref: '58176120', status: 'failed', faults: '1 serious (junction observation), 6 minors', car: 'PF21 XKD' },
  ];

  D.lessonTypes = [
    ['Standard lesson', 60, 38], ['Extended lesson', 90, 57], ['Double lesson', 120, 76],
    ['Motorway lesson', 120, 80], ['Mock test', 60, 45], ['Test day (warm-up + test)', 120, 95],
  ];
  D.packages = [['5 lessons', 5, 180, '12 months'], ['10 lessons', 10, 350, '12 months'], ['20 lessons', 20, 680, '18 months'], ['Intensive (30 hours)', 20, 1050, '3 months']];

  // Syllabus based on DVSA "Driver's record" topics (Assumption A-10)
  D.skills = ['Cockpit checks and controls', 'Moving off and stopping', 'Mirrors and signals', 'Junctions', 'Roundabouts', 'Meeting and overtaking',
    'Pedestrian crossings', 'Dual carriageways', 'Country roads', 'Hazard awareness', 'Independent driving', 'Emergency stop',
    'Bay parking', 'Parallel parking', 'Pull up on the right', 'Motorways'];
  D.levelNames = ['', 'Introduced', 'Under instruction', 'Prompted', 'Seldom prompted', 'Independent'];
  D.skillLevels = { 'Amaya Silva': [5, 5, 4, 4, 3, 3, 4, 2, 3, 3, 3, 4, 2, 2, 3, 1], 'Noah Clarke': [5, 5, 5, 4, 4, 3, 4, 3, 3, 4, 3, 4, 3, 2, 3, 1], 'George Hall': [5, 5, 5, 5, 5, 4, 5, 4, 4, 4, 5, 5, 4, 4, 4, 4] };

  D.weekly = [['14 Sep', 182, 6916], ['21 Sep', 176, 6688], ['28 Sep', 191, 7258], ['05 Oct', 188, 7144], ['12 Oct', 170, 6460], ['19 Oct', 164, 6232], ['26 Oct', 149, 5662], ['02 Nov', 186, 7068], ['09 Nov', 74, 2812]];

  D.staff = [
    ['Ruwan Fernando', 'ruwan@northside-driving.example', 'Owner', 'Today, 08:02'],
    ['Priya Shah', 'priya@northside-driving.example', 'Admin', 'Today, 08:45'],
    ['Dilani Perera', 'dilani@northside-driving.example', 'Receptionist', 'Today, 08:31'],
    ['Sarah Mitchell', 'sarah@northside-driving.example', 'Instructor', 'Today, 08:20'],
    ['Ayesha Khan', 'ayesha@northside-driving.example', 'Instructor', 'Today, 08:55'],
    ['Liam Turner', 'liam@northside-driving.example', 'Instructor', '06 Nov 2026'],
    ['Sam Patel', 'sam@northside-driving.example', 'Instructor', 'Today, 07:48'],
  ];

  D.daysUntil = (iso) => Math.round((new Date(iso + 'T00:00:00') - new Date(D.today + 'T00:00:00')) / 86400000);
})();
