import { DUMMY_STUDENT } from "../../schoolsync-data";
import { formatPercent } from "../../../exora/exora-data";
import { User, Phone, MapPin, Calendar, HeartPulse } from "lucide-react";

export function ChildProfileModule() {
  return (
    <div className="p-8 h-full flex flex-col relative overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">Student Profile</h2>
        <p className="text-muted text-sm">Detailed information for {DUMMY_STUDENT.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-4xl font-black mb-4">
            {DUMMY_STUDENT.name.charAt(0)}
          </div>
          <h3 className="text-2xl font-bold">{DUMMY_STUDENT.name}</h3>
          <p className="text-muted mb-4">{DUMMY_STUDENT.rollNumber} • Grade {DUMMY_STUDENT.grade}-{DUMMY_STUDENT.section}</p>
          <div className="flex gap-2">
            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 uppercase tracking-wider">Active Status</span>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-muted">
              <Calendar className="w-5 h-5" />
              <h4 className="font-bold">Academic Overview</h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Class Teacher</p>
                <p className="font-bold">Mrs. Anita Desai</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Overall Attendance</p>
                <p className="font-bold text-xl text-primary">{formatPercent(DUMMY_STUDENT.attendancePct)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-muted">
              <User className="w-5 h-5" />
              <h4 className="font-bold">Guardian Details</h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Primary Guardian</p>
                <p className="font-bold">{DUMMY_STUDENT.guardianName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted" />
                <p className="font-bold text-sm">{DUMMY_STUDENT.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 text-muted">
            <MapPin className="w-5 h-5" />
            <h4 className="font-bold">Transport Details</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Mode</span>
              <span className="font-bold text-sm">School Bus</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Route</span>
              <span className="font-bold text-sm">Route 14 (North)</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-muted text-sm">Pickup Point</span>
              <span className="font-bold text-sm">Sector 4, Main Gate</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 text-muted">
            <HeartPulse className="w-5 h-5" />
            <h4 className="font-bold">Medical Information</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Blood Group</span>
              <span className="font-bold text-sm text-red-500">O+</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-muted text-sm">Allergies</span>
              <span className="font-bold text-sm">Peanuts</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-muted text-sm">Emergency Contact</span>
              <span className="font-bold text-sm">{DUMMY_STUDENT.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
