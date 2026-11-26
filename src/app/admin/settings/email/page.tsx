"use client";

import { useSearchParams } from "next/navigation";
import EmailHubView from "./EmailHubView";

export default function EmailPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  return <EmailHubView initialTab={initialTab} />;
}
