import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturesModule() {
  const [features, setFeatures] = useState([
    { id: "ai_grading", name: "AI Assisted Grading", description: "Use AI to help grade objective homework assignments.", status: "beta", enabled: true },
    { id: "parent_app", name: "Parent Mobile App", description: "Enable access to the native iOS and Android parent apps.", status: "stable", enabled: true },
    { id: "payment_gateway", name: "Integrated Payment Gateway", description: "Allow parents to pay fees directly through the portal.", status: "stable", enabled: true },
    { id: "sso", name: "Enterprise SSO", description: "Allow login via Google Workspace or Microsoft Entra.", status: "enterprise", enabled: false },
    { id: "analytics_plus", name: "Advanced Analytics", description: "Deep dive reporting and custom dashboards.", status: "stable", enabled: true },
    { id: "sms_alerts", name: "SMS / WhatsApp Alerts", description: "Send immediate notifications for critical events.", status: "stable", enabled: true },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1">Feature Flags & Control</h2>
        <p className="text-muted text-sm">Manage global feature rollouts and tenant availability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {features.map(feature => (
          <div key={feature.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold flex items-center gap-2">
                  {feature.name}
                  {feature.status === "beta" && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase tracking-wider font-bold flex items-center gap-1"><Sparkles className="w-3 h-3"/> Beta</span>}
                  {feature.status === "enterprise" && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-wider font-bold">Enterprise</span>}
                </h3>
                <button 
                  onClick={() => toggleFeature(feature.id)}
                  className={cn("w-12 h-6 rounded-full transition-colors relative", feature.enabled ? "bg-primary" : "bg-white/10")}
                >
                  <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", feature.enabled ? "right-1" : "left-1")}></span>
                </button>
              </div>
              <p className="text-sm text-muted">{feature.description}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
               <span className="text-muted">Enabled for: <strong className="text-foreground">{feature.status === 'enterprise' ? '4 Tenants' : 'All Tenants'}</strong></span>
               <button className="text-primary hover:underline font-bold">Configure Rules</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
