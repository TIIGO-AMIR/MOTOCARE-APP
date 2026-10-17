import React, { useState, useEffect } from 'react';
import { 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Globe, 
  CheckCircle2, 
  RotateCcw
} from 'lucide-react';
import { getStoredGitHubLiveUrl, saveStoredGitHubLiveUrl } from '../utils/storage';

interface GitHubLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUrlUpdated?: (newUrl: string) => void;
}

export const GitHubLiveModal: React.FC<GitHubLiveModalProps> = ({ 
  isOpen, 
  onClose,
  onUrlUpdated 
}) => {
  const [liveUrl, setLiveUrl] = useState<string>(() => getStoredGitHubLiveUrl());
  const [copied, setCopied] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLiveUrl(getStoredGitHubLiveUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = (url: string) => {
    const trimmed = url.trim();
    setLiveUrl(trimmed);
    saveStoredGitHubLiveUrl(trimmed);
    if (onUrlUpdated) onUrlUpdated(trimmed);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToCurrent = () => {
    if (typeof window !== 'undefined') {
      handleSaveUrl(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Plain solid colors */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-sm">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  GitHub Live Link
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live &amp; Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                View, test, and host the live app directly from GitHub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Active Live Link Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                Active GitHub Live URL
              </span>
              {savedBadge && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={liveUrl}
                onChange={(e) => handleSaveUrl(e.target.value)}
                placeholder="https://<username>.github.io/<repo>/"
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none transition"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition active:scale-95 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live App in Browser</span>
              </a>

              <button
                onClick={handleResetToCurrent}
                title="Reset to current browser URL"
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Current URL</span>
              </button>
            </div>
          </div>

          {/* GitHub Pages Deployment Guide */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
              How to Deploy &amp; View on GitHub Pages
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <p>
                A GitHub Actions deployment workflow is pre-configured in <code className="text-orange-400 font-mono">.github/workflows/deploy.yml</code>.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>
                  Push this repository to GitHub:
                  <div className="mt-1 p-2 bg-slate-900 rounded font-mono text-[11px] text-orange-300 overflow-x-auto">
                    git add . &amp;&amp; git commit -m &quot;feat: motorcycle service log&quot; &amp;&amp; git push
                  </div>
                </li>
                <li>
                  Go to your repository on GitHub &rarr; <strong>Settings</strong> &rarr; <strong>Pages</strong>.
                </li>
                <li>
                  Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.
                </li>
              </ol>
              <p className="text-[11px] text-slate-400 pt-1">
                Your live link will be: <code className="text-emerald-400 font-mono">https://&lt;username&gt;.github.io/&lt;repository&gt;/</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            PWA Ready &bull; Offline Persistent
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
