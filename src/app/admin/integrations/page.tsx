"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ExternalLink,
} from "lucide-react";
import { adminClient, errorMessage } from "@/lib/admin-client";
import { 
  AdminPage, 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  Drawer,
  Skeleton 
} from "@/components/admin/ui";

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  configured: boolean;
  status: "HEALTHY" | "WARNING" | "NOT_CONFIGURED" | "COMING_SOON";
  nonSecretConfig: Record<string, string | number | boolean>;
  lastActivityAt?: string | null;
  lastFailure?: string | null;
  docsUrl?: string;
}

export default function IntegrationsCenterPage() {
  const [items, setItems] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<IntegrationItem | null>(null);

  useEffect(() => {
    adminClient
      .getIntegrations()
      .then((data) => setItems(data as unknown as IntegrationItem[]))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPage maxWidth="default">
      <PageHeader
        title="Connected Services"
        description="Manage connected external services including transactional email, analytics, security, and storage."
        breadcrumbs={[{ label: "Settings", href: "/admin/settings" }, { label: "Integrations" }]}
      />

      {/* Security Note Alert */}
      <div className="bg-white border border-stone-200/80 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-semibold text-stone-900">Credential Secrecy</span>
          <p className="text-stone-500 leading-relaxed">
            Sensitive credentials are encrypted or stored securely and are never shown in full in the Admin interface.
            Only operational health and non-secret configuration are displayed.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {items.map((item) => {
            const isConnected = item.status === "HEALTHY";
            const isWarning = item.status === "WARNING";

            return (
              <Card
                key={item.id}
                className="p-5 flex flex-col justify-between hover:border-stone-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 font-bold text-xs">
                      {item.name[0]}
                    </div>
                    <StatusBadge
                      variant={
                        isConnected
                          ? "success"
                          : isWarning
                          ? "warning"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {isConnected
                        ? "Connected"
                        : isWarning
                        ? "Needs Review"
                        : "Not Configured"}
                    </StatusBadge>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs mt-4">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.id === "resend" ? (
                      <Link href="/admin/settings/email">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Integration Detail Drawer */}
      {selectedItem && (
        <Drawer
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.name}
          subtitle={selectedItem.category}
          actions={
            selectedItem.docsUrl && (
              <a
                href={selectedItem.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )
          }
        >
          <div className="space-y-6 text-xs">
            <div>
              <h4 className="font-semibold text-stone-900 mb-1">Status</h4>
              <StatusBadge
                variant={
                  selectedItem.status === "HEALTHY"
                    ? "success"
                    : selectedItem.status === "WARNING"
                    ? "warning"
                    : "neutral"
                }
              >
                {selectedItem.status === "HEALTHY"
                  ? "Operational"
                  : selectedItem.status === "WARNING"
                  ? "Warning / Action Needed"
                  : "Not Configured"}
              </StatusBadge>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-1">Description</h4>
              <p className="text-stone-600 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-2">Configuration Telemetry</h4>
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-2">
                {Object.entries(selectedItem.nonSecretConfig).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1 border-b border-stone-200/50 last:border-0 font-mono text-[11px]">
                    <span className="text-stone-500">{k}:</span>
                    <span className="font-medium text-stone-800 break-all">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedItem.lastActivityAt && (
              <div>
                <h4 className="font-semibold text-stone-900 mb-1">Last Activity</h4>
                <p className="text-stone-500">
                  {new Date(selectedItem.lastActivityAt).toLocaleString()}
                </p>
              </div>
            )}

            {selectedItem.lastFailure && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800">
                <span className="font-semibold block mb-0.5">Last Delivery Error</span>
                <p>{selectedItem.lastFailure}</p>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </AdminPage>
  );
}
