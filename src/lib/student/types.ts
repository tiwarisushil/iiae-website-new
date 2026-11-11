// Shapes of the CRM API responses the student pages use.

export type AcademicRecord = {
  board?: string;
  passingYear?: string | number;
  school?: string;
  stream?: string;
  scoreType?: 'percentage' | 'cgpa' | '';
  marksObtained?: string | number;
  maximumMarks?: string | number;
  percentage?: string | number;
  cgpa?: string | number;
};

/** GET /dashboard for a student. Fee amounts are in rupees. */
export type StudentDashboard = {
  profile: {
    studentId: string;
    courseName: string;
    batchName: string;
    entranceStatus: string;
    entranceScore: number;
  };
  finance: { totalFee: number; scholarship: number; netFee: number; paidFee: number; pendingBalance: number };
  registrationPending: boolean;
  /** Live exam phase the student can register for again ('' when none). */
  reapplyPhase?: string;
  registration: {
    name: string;
    email: string;
    phone: string;
    alternatePhone: string;
    studentId: string;
    gender: string;
    dob: string | null;
    category: string;
    fatherName: string;
    motherName: string;
    parentMobile: string;
    parentEmail: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pin: string;
    courseName: string;
    qualification: string;
    examCentreFirst: string;
    examCentreSecond: string;
    photoUrl: string;
    signatureUrl: string;
    registrationFeeAmount: number;
    acknowledgementUrl: string;
    registrationFeePaid: boolean;
    formSubmittedAt: string | null;
    examPhase?: string;
    phaseHistory?: { examPhase: string; formSubmittedAt: string | null; registrationFeeAmount: number; registrationFeePaid: boolean }[];
    academics: Partial<Record<'classX' | 'classXII' | 'diploma' | 'iti' | 'graduation' | 'postGraduation', AcademicRecord>>;
    extraAnswers: { fieldId: string; label: string; value: string }[];
    documents: { name: string; url: string }[];
  };
};

/** GET /settings (the parts students use). */
export type PortalSettings = { admitCardEnabled?: boolean; resultEnabled?: boolean };
