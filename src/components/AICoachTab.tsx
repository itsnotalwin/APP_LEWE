/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Send, 
  RefreshCw, 
  Lock, 
  AlertCircle, 
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import Groq from 'groq-sdk';
import { LifeOSData } from '../types';

interface AICoachTabProps {
  data: LifeOSData;
  updateData: (newData: Partial<LifeOSData>) => void;
  getCurrentDate: () => string;
}

// Robust, simple React parser for markdown output to avoid external parsing bugs
function SimpleMarkdownRenderer({ markdown }: { markdown: string }) {
  if (!markdown) return null;

  const lines = markdown.split('\n');
  return (
    <div className="space-y-4 text-espresso/70 dark:text-alabaster/70 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Catch main header ##
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl font-black text-espresso dark:text-alabaster border-b border-sand dark:border-white/5 pb-3 mt-10 mb-4 tracking-tighter uppercase flex items-center space-x-3">
              <div className="w-2 h-6 bg-accent rounded-full" />
              <span>{trimmed.substring(3)}</span>
            </h2>
          );
        }

        // Catch sub header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-[11px] font-black text-accent uppercase tracking-[0.3em] mt-8 mb-3 font-mono">
              {trimmed.substring(4)}
            </h3>
          );
        }

        // Catch bullet list items - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.substring(2);
          // Highlight bold text inside the format **bold**
          return (
            <li key={idx} className="list-none relative pl-8 py-1.5 text-espresso/60 dark:text-alabaster/60 font-bold group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-accent/30 group-hover:bg-accent group-hover:w-5 transition-all" />
              {renderBoldText(text)}
            </li>
          );
        }

        // Catch blank line
        if (!trimmed) {
          return <div key={idx} className="h-4" />;
        }

        // Standard paragraph
        return (
          <p key={idx} className="font-bold text-espresso/80 dark:text-alabaster/80 leading-relaxed">
            {renderBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Parse **bold** wrappers
function renderBoldText(text: string) {
  const parts = text.split('**');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="text-espresso dark:text-alabaster font-black uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded-lg border border-accent/10 mx-1">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function AICoachTab({ data, updateData, getCurrentDate }: AICoachTabProps) {
  const [markdownOutput, setMarkdownOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadTextIndex, setLoadTextIndex] = useState(0);
  const [errorText, setErrorText] = useState<string>('');

  const loadingPhrases = [
    'Authenticating with Groq Secure API...',
    'Deconstructing habit compliance trends...',
    'Synthesizing task priority metadata...',
    'Checking ledger transaction flow metrics...',
    'Processing active mental mood profiles...',
    'Formulating personalized productivity guidance...',
  ];

  // Rotate loading phrases while waiting for AI API
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadTextIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleTriggerAudit = async () => {
    setIsLoading(true);
    setErrorText('');
    setMarkdownOutput('');
    setLoadTextIndex(0);

    const auditData = {
      habits: data.habits,
      tasks: data.tasks,
      transactions: data.transactions,
      journal: data.journal,
      focus: data.focus,
      userKey: data.apiKeys?.groq,
    };

    try {
      // First attempt: Server-side proxy
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData),
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload.success) {
          setMarkdownOutput(payload.markdown);
          return;
        } else if (payload.error === 'Missing API Key') {
          setMarkdownOutput(payload.markdown || '');
          return;
        }
      }
      
      // Fallback: Client-side direct call (for GitHub Pages / static hosting)
      const activeKey = data.apiKeys?.groq;
      if (!activeKey || activeKey === 'MY_GROQ_API_KEY') {
        throw new Error('Missing API Key and Server Proxy Unavailable');
      }

      const groqClient = new Groq({ apiKey: activeKey, dangerouslyAllowBrowser: true });
      
      const prompt = `You are "Life OS Assistant" — a premium, objective, highly analytical, yet deeply supportive life strategy coach. 
Analyze the user's daily tracker state, habits, tasks, finances, and journal notes.
Provide a professional, concise, and beautifully structured Daily Audit in clean Markdown.

Adhere strictly to these styling constraints:
- Use precise display titles and bullet points.
- Use "RANDS (ZAR)" or "R" for all currency mentions.
- Keep the tone grounded, objective, and deeply motivating.

Data Context:
- Today: ${new Date().toISOString().split('T')[0]}
- Focus: ${data.focus?.text || 'Not set'}
- Habits: ${JSON.stringify(data.habits?.map(h => ({ name: h.name, completed: !!h.history[new Date().toISOString().split('T')[0]] })))}
- Tasks: ${JSON.stringify(data.tasks?.filter(t => !t.completed).map(t => t.title))}
- Finances: Net Balance ${data.transactions?.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)}
- Journal: Latest entry "${data.journal?.[0]?.content?.substring(0, 500) || 'None'}"`;

      const result = await groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
      });
      setMarkdownOutput(result.choices[0]?.message?.content || '');

    } catch (err: any) {
      console.error('Audit failed:', err);
      setErrorText(err.message || 'Network exception occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Visual Coach Card */}
      <div className="clay-card-ambient p-8 relative overflow-hidden group">
        
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-110 group-hover:rotate-12 transition-transform duration-700">
          <BrainCircuit className="w-56 h-56" />
        </div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="flex items-center space-x-3 text-accent">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Groq Llama Suite</span>
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter leading-none text-espresso dark:text-alabaster uppercase">
            Personal Strategy Audit
          </h1>
          
          <p className="text-xs text-espresso/60 dark:text-alabaster/60 leading-relaxed font-bold">
            Leveraging the high-fidelity **Llama 3.3 70B** model via Groq to deconstruct your behavioral patterns. Our audit synthesizes habit adherence, capital velocity, and narrative reflections into structural optimization guidance.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={handleTriggerAudit}
              disabled={isLoading}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer shadow-xl active:scale-95 ${
                isLoading 
                  ? 'bg-sand/20 text-espresso/20 cursor-not-allowed shadow-none' 
                  : 'bg-accent hover:bg-accent-hover text-white shadow-accent/20'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Audit...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  <span>Execute Neural Audit</span>
                </>
              )}
            </button>
            
            <div className="flex items-center space-x-2 text-[9px] font-black text-espresso/30 dark:text-alabaster/30 uppercase tracking-widest font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Data Encrypted & Local</span>
            </div>
          </div>
        </div>

      </div>

      {/* Primary Output Area */}
      <div className="clay-card flex flex-col min-h-[400px] animate-in slide-in-from-bottom-4 duration-500 delay-150">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sand dark:border-white/5 bg-parchment/10 dark:bg-black/10">
          <div className="flex items-center space-x-3">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black text-espresso/40 dark:text-alabaster/40 font-mono uppercase tracking-[0.2em]">Strategy Stream Log</span>
          </div>
          
          {isLoading && (
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="text-[9px] font-black text-accent font-mono uppercase tracking-widest">Running Analysis</span>
            </div>
          )}
        </div>

        {/* Console Container */}
        <div className="p-8 flex-1 flex flex-col justify-center">
          
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <RefreshCw className="w-16 h-16 text-accent/20 animate-spin transition-all duration-1000" />
                <BrainCircuit className="w-8 h-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-espresso dark:text-alabaster font-black text-sm uppercase tracking-widest font-mono animate-pulse">
                  {loadingPhrases[loadTextIndex]}
                </p>
                <p className="text-[9px] text-espresso/30 dark:text-alabaster/30 font-black uppercase tracking-[0.3em] font-mono">
                  Evaluating vector metrics • Neural Link Secure
                </p>
              </div>
            </div>
          ) : errorText ? (
            <div className="bg-rose-500/5 text-rose-600 dark:text-rose-400 p-8 rounded-3xl border border-rose-500/10 flex items-start space-x-5 max-w-2xl mx-auto">
              <div className="p-3 bg-rose-500/10 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest">Audit Interrupt Encountered</h4>
                <p className="text-xs mt-2 font-mono font-bold leading-relaxed">{errorText}</p>
                <p className="text-[10px] mt-4 opacity-70 font-bold uppercase tracking-widest leading-relaxed">
                  Verify network integrity, or initialize personal access token in OS Settings for custom deployment.
                </p>
              </div>
            </div>
          ) : markdownOutput ? (
            <div className="fade-in max-w-3xl mx-auto w-full border border-sand dark:border-white/5 p-10 rounded-[2.5rem] bg-parchment/40 dark:bg-black/20 shadow-2xl backdrop-blur-sm">
              <SimpleMarkdownRenderer markdown={markdownOutput} />
            </div>
          ) : (
            <div className="py-24 text-center max-w-sm mx-auto space-y-6">
              <div className="w-20 h-20 bg-sand/10 dark:bg-black/20 rounded-[2rem] flex items-center justify-center mx-auto border border-sand dark:border-white/5">
                <BrainCircuit className="w-10 h-10 text-espresso/10 dark:text-alabaster/10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-espresso/40 dark:text-alabaster/40 uppercase tracking-[0.2em]">Strategy Advisor Silent</h4>
                <p className="text-[10px] text-espresso/30 dark:text-alabaster/30 leading-relaxed font-bold uppercase tracking-widest px-4">
                  No active audit triggered this session. Click the execute button to initialize the neural advisor.
                </p>
              </div>
              <button 
                onClick={handleTriggerAudit}
                className="text-[10px] font-black text-accent uppercase tracking-[0.3em] hover:bg-accent/5 px-6 py-3 rounded-xl transition-colors"
              >
                Log Entry Required
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
