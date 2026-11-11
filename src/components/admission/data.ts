// Content of the AIAEE exam page (/important-dates-for-aiaee). Mirrors the CRM's exam home page
// (Reactjs/src/pages/ExamHomePage.jsx); keep the two in step when dates or fees change.

export const NAV: [string, string][] = [
  ['overview', 'Overview'],
  ['courses', 'Courses Offered'],
  ['eligibility', 'Eligibility'],
  ['details', 'Exam Details'],
  ['scholarships', 'Scholarships'],
  ['fee', 'Examination Fee'],
  ['pattern', 'Exam Pattern'],
  ['dates', 'Important Dates'],
  ['faqs', 'FAQs'],
  ['regist', 'Register / Login'],
];

export type Group = [string, string[][]];

export const COURSES: Group[] = [
  ['Aircraft Maintenance Engineering (CAR 147 Basic)', [
    ['B1.1 — Mechanical (heavy aircraft and turbine engine)', 'DGCA'],
    ['B2 — Avionics (electrical, instrumentation, communication and navigation)', 'DGCA'],
  ]],
];

export const ELIGIBILITY: Group[] = [
  ['Aircraft Maintenance Engineering (CAR 147 Basic)', [
    ['B1.1 — Mechanical', '12th with Physics, Chemistry and Mathematics, or a three-year approved diploma'],
    ['B2 — Avionics', '12th with Physics, Chemistry and Mathematics, or a three-year approved diploma'],
  ]],
];

export const SCHOLARSHIPS: string[][] = [
  ['Topper of Central Board / State Board', 'Up to 100% (First year tuition fee)'],
  ['AIAEE 2027 Rankers (1 to last)', 'Between 5% to 10% (Rank wise)'],
];

export const EXAM_PHASES = [
  {
    title: 'AIAEE 2027 Phase 1',
    rows: [
      ['Registration start date', '9th September 2026'],
      ['Date of registration close', '05 January 2027'],
      ['Admit card issued', 'Between 6th and 9th January 2027'],
      ['Date of examination', '10th January 2027'],
    ],
  },
  {
    title: 'AIAEE 2027 Phase 2',
    rows: [
      ['Registration start date', '6th January 2027'],
      ['Date of registration close', '20th April 2027'],
      ['Admit card issued', 'Between 21st and 24th April 2027'],
      ['Date of examination', '25th April 2027'],
    ],
  },
  {
    title: 'AIAEE 2027 Phase 3',
    rows: [
      ['Registration start date', '21st April 2027'],
      ['Date of registration close', '04th June 2027'],
      ['Admit card issued', 'Between 4th and 5th June 2027'],
      ['Date of examination', '6th June 2027'],
    ],
  },
];

export const FEE_STRUCTURE: string[][] = [
  ['Registration fee', '₹2,000'],
  ['Admission charge', '₹50,000'],
  ['Tuition fee', '₹4,00,000'],
  ['Tuition fee', '₹4,00,000'],
  ['Grand total', '₹8,52,000'],
];

export const PATTERNS = [
  {
    title: 'Exam pattern for 10+2',
    rows: [['Physics', '25', '100'], ['Chemistry', '25', '100'], ['Mathematics', '25', '100']],
  },
];

export const FAQS: [string, string][] = [
  ['What is AIAEE?', 'AIAEE (Aircraft Maintenance Engineering Entrance Exam) is the entrance exam for admission to the CAR 147 (Basic) Aircraft Maintenance Engineering programme at the Indian Institute of Aircraft Engineering, New Delhi.'],
  ['What are the eligibility criteria for AIAEE?', 'Age at the time of admission must be between 15 and 28 years. A candidate can attempt the exam a maximum of three times. For the AME programme, the candidate must have passed Class 12 with Physics, Chemistry and Mathematics, or completed a three-year approved diploma.'],
  ['What courses can I apply for through AIAEE?', 'One degree is offered: CAR 147 (Basic) Aircraft Maintenance Engineering, in two categories. B1.1 is the Mechanical stream for heavy aircraft and turbine engines. B2 is the Avionics stream for electrical, instrumentation, communication and navigation systems.'],
  ['How many times can a candidate attempt the AIAEE exam?', 'A candidate can attempt AIAEE a maximum of three times.'],
  ['What is the age limit to apply for AIAEE?', 'The candidate must be between 15 and 28 years of age at the time of admission.'],
  ['What is the exam pattern for AIAEE?', 'The paper has 75 multiple-choice questions in Physics, Chemistry and Mathematics, with 25 questions in each subject. Each question carries 4 marks.'],
  ['In what languages is the AIAEE question paper available?', 'The question paper is available in Hindi and English.'],
  ['What is the mode of the AIAEE exam?', 'AIAEE is conducted online only. There is no exam centre.'],
  ['How can I apply for the AIAEE exam?', 'Create an account on this page, sign in, and complete the registration form from your dashboard.'],
  ['What is the registration fee for AIAEE?', 'The examination fee is ₹2,000.'],
  ['What scholarships are available through AIAEE?', 'Topper of Central Board / State Board: up to 100% of first-year tuition fee. AIAEE 2027 rankers (1 to last): between 5% and 10% rank wise. Scholarships apply on tuition fees after admission through AIAEE counselling.'],
  ['When is the AIAEE 2027 exam scheduled?', 'The AIAEE examination is scheduled between January 2027 and June 2027 in 3 phases.'],
  ['What documents are required for AIAEE registration?', 'Fill in the basic details and upload a photograph on the registration form. Documents do not need to be posted for the online application.'],
  ['When will the results of AIAEE 2027 be declared?', 'AIAEE Phase 1 to 3 results will be informed separately along with the date of counselling and admission.'],
  ['Can I get a refund of the registration fee if I do not appear for the AIAEE exam?', 'No. The registration fee is not refunded.'],
];
