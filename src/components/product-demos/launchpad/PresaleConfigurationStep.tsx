import { LaunchpadFormState } from "./types";
import { formatNumber } from "./launchpad-data";
import { Rocket, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldProps {
  label: string;
  field: keyof LaunchpadFormState;
  placeholder: string;
  type?: string;
  suffix?: string;
  state: LaunchpadFormState;
  errors: Record<string, string>;
  onChange: (field: keyof LaunchpadFormState, value: string) => void;
}

const InputField = ({ label, field, placeholder, type = "number", suffix, state, errors, onChange }: InputFieldProps) => (
  <div>
    <label className="block text-xs font-bold text-muted mb-1 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        placeholder={placeholder} 
        className={cn("w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm focus:outline-none focus:border-primary transition-colors", suffix ? "pl-4 pr-16" : "px-4")}
        value={state[field]}
        onChange={(e) => onChange(field, e.target.value)}
      />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted pointer-events-none">{suffix}</span>}
    </div>
    {errors[field] && <p className="text-error text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</p>}
  </div>
);

interface Props {
  state: LaunchpadFormState;
  errors: Record<string, string>;
  onChange: (field: keyof LaunchpadFormState, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PresaleConfigurationStep({ state, errors, onChange, onNext, onBack }: Props) {
  const isValid = Object.keys(errors).length === 0 && 
    state.presaleAllocation && state.tokenPrice && 
    state.minimumContribution && state.maximumContribution && 
    state.softCap && state.hardCap && 
    state.startDate && state.endDate;

  const inputProps = { state, errors, onChange };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full overflow-y-auto scrollbar-hide">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
          <Rocket className="text-primary w-6 h-6" />
          Configure Presale
        </h2>
        <p className="text-muted text-sm">Set your token economics, pricing, and campaign schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-4">
          <InputField label="Presale Allocation" field="presaleAllocation" placeholder="Amount of tokens" suffix={state.tokenSymbol || "TKN"} {...inputProps} />
          <InputField label="Token Price" field="tokenPrice" placeholder="0.1" suffix="USDT" {...inputProps} />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Min Buy" field="minimumContribution" placeholder="10" suffix="USDT" {...inputProps} />
            <InputField label="Max Buy" field="maximumContribution" placeholder="1000" suffix="USDT" {...inputProps} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Soft Cap" field="softCap" placeholder="50000" suffix="USDT" {...inputProps} />
            <InputField label="Hard Cap" field="hardCap" placeholder="100000" suffix="USDT" {...inputProps} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Start Date" field="startDate" placeholder="" type="datetime-local" {...inputProps} />
            <InputField label="End Date" field="endDate" placeholder="" type="datetime-local" {...inputProps} />
          </div>
        </div>

        {/* Summary Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
          <h3 className="font-bold text-sm mb-4 text-muted uppercase tracking-wider">Campaign Summary</h3>
          <div className="space-y-4">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-xs text-muted mb-1">Target Raise (Hard Cap)</p>
              <p className="text-xl font-black text-tertiary">{state.hardCap ? formatNumber(state.hardCap) : "0"} USDT</p>
            </div>
            
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between">
                <span className="text-muted">Total Supply</span>
                <span className="font-bold">{state.totalSupply ? formatNumber(state.totalSupply) : "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Presale Allocation</span>
                <span className="font-bold">{state.presaleAllocation ? formatNumber(state.presaleAllocation) : "0"}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                <span className="text-muted">Tokens Remaining</span>
                <span className="font-bold text-primary">
                  {(parseFloat(state.totalSupply || "0") - parseFloat(state.presaleAllocation || "0")) > 0 
                    ? formatNumber((parseFloat(state.totalSupply || "0") - parseFloat(state.presaleAllocation || "0")).toString())
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-white/5 shrink-0">
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors">
          Back
        </button>
        <button 
          onClick={onNext} 
          disabled={!isValid}
          className="px-8 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Review & Publish
        </button>
      </div>
    </div>
  );
}
