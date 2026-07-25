import { Announcement, TimetableClass, Homework, StudentProfile, TeacherProfile, ClassRecord, FeeRecord, ExamResult, DemoSchool, DemoSubscription, SupportTicket, AuditLog } from "./types";

export const ADMIN_METRICS = {
  totalStudents: 1240,
  totalTeachers: 85,
  attendanceToday: 94.5,
  feesCollected: 850000,
  feesPending: 120000,
};

export const TEACHER_METRICS = {
  totalStudents: 145,
  classesToday: 4,
  assignmentsToGrade: 28,
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "Annual Sports Meet Registration",
    date: "2026-07-28",
    author: "Principal's Office",
    content: "Registrations are now open for the Annual Sports Meet. Last date to apply is Aug 5th.",
    audience: "all"
  },
  {
    id: "a2",
    title: "Upcoming Parent-Teacher Meeting",
    date: "2026-07-30",
    author: "Admin Coordinator",
    content: "The PTM for the current semester is scheduled for next Saturday.",
    audience: "parents"
  },
  {
    id: "a3",
    title: "Staff Meeting Rescheduled",
    date: "2026-07-26",
    author: "Vice Principal",
    content: "The weekly staff meeting will be held at 4 PM tomorrow.",
    audience: "teachers"
  }
];

export const TEACHER_TIMETABLE: TimetableClass[] = [
  { id: "t1", day: "Monday", time: "08:30 AM", subject: "Mathematics", grade: "Grade 10", room: "Room 102" },
  { id: "t2", day: "Monday", time: "09:30 AM", subject: "Physics", grade: "Grade 11", room: "Lab 3" },
  { id: "t3", day: "Tuesday", time: "11:00 AM", subject: "Mathematics", grade: "Grade 9", room: "Room 105" },
];

export const STUDENT_TIMETABLE: TimetableClass[] = [
  { id: "s1", day: "Monday", time: "08:30 AM", subject: "Mathematics", grade: "Grade 10", room: "Room 102", teacher: "Mr. Sharma" },
  { id: "s2", day: "Monday", time: "09:30 AM", subject: "Science", grade: "Grade 10", room: "Lab 1", teacher: "Ms. Gupta" },
  { id: "s3", day: "Monday", time: "11:00 AM", subject: "History", grade: "Grade 10", room: "Room 104", teacher: "Mrs. Rao" },
];

export const STUDENT_HOMEWORK: Homework[] = [
  { id: "h1", subject: "Mathematics", title: "Algebra Worksheet", dueDate: "2026-07-26", status: "pending", teacher: "Mr. Sharma", class: "Grade 10-A", assignedDate: "2026-07-20", submissionCount: 20, totalStudents: 35 },
  { id: "h2", subject: "Physics", title: "Lab Report: Kinematics", dueDate: "2026-07-27", status: "pending", teacher: "Ms. Gupta", class: "Grade 10-A", assignedDate: "2026-07-21", submissionCount: 5, totalStudents: 35 },
  { id: "h3", subject: "English", title: "Essay Draft", dueDate: "2026-07-24", status: "graded", teacher: "Mrs. Rao", class: "Grade 10-A", assignedDate: "2026-07-15", submissionCount: 35, totalStudents: 35 },
];

export const DUMMY_STUDENT: StudentProfile = {
  id: "s1",
  name: "Aisha Khan",
  grade: "10",
  section: "A",
  rollNumber: "10A-04",
  attendancePct: 98,
  guardianName: "Mrs. Khan",
  feeStatus: "paid",
  phone: "+91 98765 43210"
};

export const MOCK_STUDENTS: StudentProfile[] = [
  DUMMY_STUDENT,
  { id: "s2", name: "Rahul Sharma", grade: "10", section: "A", rollNumber: "10A-05", attendancePct: 85, guardianName: "Mr. Sharma", feeStatus: "pending", phone: "+91 98765 43211" },
  { id: "s3", name: "Priya Patel", grade: "9", section: "B", rollNumber: "9B-12", attendancePct: 92, guardianName: "Mrs. Patel", feeStatus: "paid", phone: "+91 98765 43212" },
  { id: "s4", name: "Arjun Reddy", grade: "11", section: "C", rollNumber: "11C-01", attendancePct: 78, guardianName: "Mr. Reddy", feeStatus: "overdue", phone: "+91 98765 43213" },
  { id: "s5", name: "Sneha Gupta", grade: "12", section: "A", rollNumber: "12A-15", attendancePct: 99, guardianName: "Mr. Gupta", feeStatus: "paid", phone: "+91 98765 43214" },
];

export const MOCK_TEACHERS: TeacherProfile[] = [
  { id: "tr1", name: "Ravi Sharma", subject: "Mathematics", assignedClasses: ["10-A", "11-B", "12-C"], attendanceStatus: "present", phone: "+91 99988 77766", email: "ravi.s@schoolsync.demo" },
  { id: "tr2", name: "Anita Desai", subject: "Physics", assignedClasses: ["9-A", "10-A", "11-A"], attendanceStatus: "present", phone: "+91 99988 77767", email: "anita.d@schoolsync.demo" },
  { id: "tr3", name: "Suresh Menon", subject: "English", assignedClasses: ["8-B", "9-C", "10-D"], attendanceStatus: "absent", phone: "+91 99988 77768", email: "suresh.m@schoolsync.demo" },
];

export const MOCK_CLASSES: ClassRecord[] = [
  { id: "c1", grade: "10", section: "A", classTeacher: "Anita Desai", studentCount: 35, attendancePct: 94 },
  { id: "c2", grade: "10", section: "B", classTeacher: "Ravi Sharma", studentCount: 32, attendancePct: 91 },
  { id: "c3", grade: "11", section: "A", classTeacher: "Suresh Menon", studentCount: 40, attendancePct: 88 },
  { id: "c4", grade: "12", section: "C", classTeacher: "Priya Singh", studentCount: 28, attendancePct: 96 },
];

export const MOCK_FEES: FeeRecord[] = [
  { id: "f1", studentId: "s1", studentName: "Aisha Khan", grade: "10-A", amount: 15000, dueDate: "2026-08-01", status: "paid", invoiceNumber: "INV-26001" },
  { id: "f2", studentId: "s2", studentName: "Rahul Sharma", grade: "10-A", amount: 15000, dueDate: "2026-08-01", status: "pending", invoiceNumber: "INV-26002" },
  { id: "f3", studentId: "s4", studentName: "Arjun Reddy", grade: "11-C", amount: 18000, dueDate: "2026-07-01", status: "overdue", invoiceNumber: "INV-26003" },
];

export const STUDENT_RESULTS: ExamResult[] = [
  { id: "r1", subject: "Mathematics", marksObtained: 95, totalMarks: 100, grade: "A+", remarks: "Excellent problem solving" },
  { id: "r2", subject: "Physics", marksObtained: 88, totalMarks: 100, grade: "A", remarks: "Good understanding of concepts" },
  { id: "r3", subject: "Chemistry", marksObtained: 92, totalMarks: 100, grade: "A+", remarks: "Outstanding lab work" },
  { id: "r4", subject: "English", marksObtained: 85, totalMarks: 100, grade: "B+", remarks: "Needs to improve essay structure" },
];



export const FOUNDER_METRICS = {
  totalSchools: 12,
  totalStudents: 18540,
  totalTeachers: 1120,
  monthlyRevenue: 340000,
  activeSubscriptions: 11,
  trialSchools: 1,
};

export const MOCK_SCHOOLS: DemoSchool[] = [
  { id: "sch1", name: "Delhi Public School", plan: "Enterprise", studentCount: 4500, status: "active", renewalDate: "2027-01-15" },
  { id: "sch2", name: "Springfield High", plan: "Pro", studentCount: 1200, status: "active", renewalDate: "2026-11-01" },
  { id: "sch3", name: "St. Xavier's", plan: "Enterprise", studentCount: 3800, status: "active", renewalDate: "2026-09-30" },
  { id: "sch4", name: "Greenwood Academy", plan: "Basic", studentCount: 800, status: "trial", renewalDate: "2026-08-15" },
  { id: "sch5", name: "Modern Vidya Niketan", plan: "Pro", studentCount: 2100, status: "suspended", renewalDate: "2026-06-30" },
];

export const MOCK_SUBSCRIPTIONS: DemoSubscription[] = [
  { id: "sub1", schoolName: "Delhi Public School", plan: "Enterprise", status: "active", mrr: 150000, nextBilling: "2026-08-15" },
  { id: "sub2", schoolName: "Springfield High", plan: "Pro", status: "active", mrr: 45000, nextBilling: "2026-08-01" },
  { id: "sub3", schoolName: "Greenwood Academy", plan: "Basic", status: "trial", mrr: 0, nextBilling: "2026-08-15" },
  { id: "sub4", schoolName: "Modern Vidya Niketan", plan: "Pro", status: "past_due", mrr: 45000, nextBilling: "2026-07-01" },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  { id: "tk1", schoolName: "Springfield High", priority: "high", category: "technical", status: "open", assignedTo: "Dev Team" },
  { id: "tk2", schoolName: "St. Xavier's", priority: "medium", category: "billing", status: "in_progress", assignedTo: "Finance" },
  { id: "tk3", schoolName: "Greenwood Academy", priority: "low", category: "onboarding", status: "open", assignedTo: "Support" },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "al1", action: "Subscription Upgraded", actor: "Admin (DPS)", schoolName: "Delhi Public School", timestamp: "2026-07-25T10:30:00Z", result: "success" },
  { id: "al2", action: "Bulk Student Import", actor: "Admin (Springfield)", schoolName: "Springfield High", timestamp: "2026-07-25T09:15:00Z", result: "success" },
  { id: "al3", action: "Payment Failed", actor: "System", schoolName: "Modern Vidya Niketan", timestamp: "2026-07-24T23:59:00Z", result: "failure" },
  { id: "al4", action: "Feature Toggle: Parent Portal", actor: "Founder", schoolName: "Greenwood Academy", timestamp: "2026-07-24T14:20:00Z", result: "success" },
];
