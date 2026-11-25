import { redirect } from "next/navigation";

/** Deep link used in notification emails: /admin/leads/<id> opens that lead in the leads workspace. */
export default async function LeadDeepLink({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/leads?lead=${encodeURIComponent(id)}`);
}
