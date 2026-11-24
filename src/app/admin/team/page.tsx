"use client";

import React, { useState, useEffect } from "react";
import { TeamMember, AdminRole } from "@/lib/admin-client/types";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { UserPlus, Shield, ShieldCheck } from "lucide-react";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("Content Editor");
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminClient.getTeam().then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, []);

  const handleToggleStatus = async (id: string) => {
    const m = team.find((x) => x.id === id);
    if (!m) return;
    try {
      await adminClient.toggleTeamStatus(id, m.status);
      setTeam(await adminClient.getTeam());
      addToast({ title: "User Updated", message: `${m.name} is now ${m.status === "Disabled" ? "Active" : "Disabled"}.` });
    } catch (err) {
      addToast({ title: "Update failed", message: errorMessage(err), type: "error" });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    try {
      const member = await adminClient.inviteTeamMember(newName, newEmail, newRole);
      setTeam((prev) => [...prev, member]);
      setInviteModalOpen(false);
      setNewName("");
      setNewEmail("");
      setCreated({ email: member.email, password: member.temporaryPassword ?? "" });
      addToast({ title: "Member created", message: `${member.email} must set up 2FA at first sign-in.`, type: "success" });
    } catch (err) {
      addToast({ title: "Could not create member", message: errorMessage(err), type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Team & Access Control"
        subtitle="Manage administrative accounts, role permissions, and mandatory 2FA enforcement"
        breadcrumbs={[{ label: "System" }, { label: "Team" }]}
        actions={
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF5A00] to-[#FF8A3D] text-white rounded-lg text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-[#E8E5E2] overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FFF9F4] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#E8E5E2]">
            <tr>
              <th className="py-3 px-4">Member Name & Email</th>
              <th className="py-3 px-4">Role Assignment</th>
              <th className="py-3 px-4">2FA Status</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E5E2]">
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-stone-50/70">
                <td className="py-3.5 px-4">
                  <p className="font-bold text-[#0B0B0F]">{member.name}</p>
                  <p className="text-[11px] text-[#4B5563] font-mono">{member.email}</p>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      member.role === "Super Admin"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : member.role === "Administrator"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {member.role}
                  </span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {member.twoFactorEnabled ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Enforced</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Pending Setup</span>
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : member.status === "Invited"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-[11px]">
                  {member.lastActive}
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  {member.role !== "Super Admin" && (
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                        member.status === "Active"
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {member.status === "Active" ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INVITE MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E5E2] space-y-4">
            <h3 className="text-base font-bold text-[#0B0B0F]">Invite Team Member</h3>
            <p className="text-xs text-[#4B5563]">
              Send an admin invitation link with assigned role capabilities and 2FA onboarding instructions.
            </p>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@kash-technology.com"
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B0B0F] mb-1">Role Permission</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg bg-white"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="SEO Manager">SEO Manager</option>
                  <option value="Content Editor">Content Editor</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E5E2] rounded-lg text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-semibold hover:bg-[#e04f00]"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {created && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold">Temporary password for {created.email}</h3>
            <p className="text-stone-600">Shown once. Share it securely; the member must sign in, change nothing else, and enrol an authenticator app before using the CMS.</p>
            <input readOnly value={created.password} onFocus={(e) => e.currentTarget.select()} className="w-full px-3 py-2 border border-[#E8E5E2] rounded-lg font-mono text-sm" />
            <button onClick={() => setCreated(null)} className="w-full py-2 bg-[#FF5A00] text-white rounded-lg font-semibold">I have saved it</button>
          </div>
        </div>
      )}
    </div>
  );
}
