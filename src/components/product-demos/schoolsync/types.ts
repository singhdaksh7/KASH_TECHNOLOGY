export type SchoolSyncRole = "founder" | "admin" | "teacher" | "parent";

export interface Announcement {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  audience: "all" | "teachers" | "parents" | "students";
  read?: boolean;
}

export interface TimetableClass {
  id: string;
  time: string;
  subject: string;
  grade: string;
  room: string;
  teacher?: string;
  day?: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  teacher?: string;
  class?: string;
  assignedDate?: string;
  submissionCount?: number;
  totalStudents?: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  attendancePct: number;
  guardianName?: string;
  feeStatus?: "paid" | "pending" | "overdue";
  phone?: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  assignedClasses: string[];
  attendanceStatus: "present" | "absent" | "leave";
  phone: string;
  email: string;
}

export interface ClassRecord {
  id: string;
  grade: string;
  section: string;
  classTeacher: string;
  studentCount: number;
  attendancePct: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  invoiceNumber: string;
}

export interface ExamResult {
  id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks: string;
}

export interface DemoSchool {
  id: string;
  name: string;
  plan: string;
  studentCount: number;
  status: "active" | "trial" | "suspended";
  renewalDate: string;
}

export interface DemoSubscription {
  id: string;
  schoolName: string;
  plan: string;
  status: "active" | "past_due" | "canceled" | "trial";
  mrr: number;
  nextBilling: string;
}

export interface SupportTicket {
  id: string;
  schoolName: string;
  priority: "high" | "medium" | "low";
  category: "billing" | "technical" | "onboarding";
  status: "open" | "in_progress" | "resolved";
  assignedTo: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  schoolName: string;
  timestamp: string;
  result: "success" | "failure";
}
