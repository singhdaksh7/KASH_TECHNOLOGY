import { LaunchpadFormState } from "./types";
import { DUMMY_CONTRACT_ADDRESS } from "./launchpad-data";
import { PartyPopper, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Props {
  state: LaunchpadFormState;
  onViewPresale: () => void;
  onReset: () => void;
}

export function PublishedStep({ state, onViewPresale, onReset }: Props) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const presaleLink = `https://launchpad.kashtechnologies.com/presale/${state.tokenSymbol.toLowerCase()}-demo`;

  const handleCopy = (text: string, type: 'address' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto h-full">
      <div className="w-24 h-24 bg-tertiary/20 rounded-full flex items-center justify-center mb-6">
        <PartyPopper className="w-12 h-12 text-tertiary" />
      </div>

      <h2 className="text-3xl font-black mb-2 text-foreground">Launch Successful!</h2>
      <p className="text-muted text-sm mb-8">
        Your token <strong>{state.tokenName} ({state.tokenSymbol})</strong> has been successfully deployed and your presale is now live on the demo network.
      </p>

      <div className="w-full space-y-4 mb-8 text-left">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Contract Address</p>
            <p className="font-mono text-sm text-primary">{DUMMY_CONTRACT_ADDRESS}</p>
          </div>
          <button 
            onClick={() => handleCopy(DUMMY_CONTRACT_ADDRESS, 'address')}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            title="Copy Address"
          >
            {copiedAddress ? <CheckCircle2 className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4 text-muted group-hover:text-foreground" />}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Presale Link</p>
            <p className="font-mono text-sm text-primary truncate max-wxs md:max-w-sm">{presaleLink}</p>
          </div>
          <button 
            onClick={() => handleCopy(presaleLink, 'link')}
            className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            title="Copy Link"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-tertiary" /> : <Copy className="w-4 h-4 text-muted group-hover:text-foreground" />}
          </button>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={onReset}
          className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          Create Another
        </button>
        <button 
          onClick={onViewPresale}
          className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          View Presale <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
