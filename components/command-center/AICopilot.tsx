'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  ChevronDown,
  Minimize2,
  Maximize2,
  HelpCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { TrustSafetyBadge } from '../common/TrustSafetyBadge';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  structuredData?: {
    type: 'ALERT' | 'HOSPITAL_LIST' | 'DEPLOY_RECOMMENDATION' | 'INCIDENT_LIST';
    items?: string[];
    actionLabel?: string;
  };
}

export const AICopilot: React.FC = () => {
  const { incidents, hospitals, units, setSelectedIncident } = useEmergency();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'ResQAI Tactical Copilot online. I have analyzed all current telemetry across active national sectors. How can I assist Command operations?'
    }
  ]);

  const quickPrompts = [
    'Which incidents need immediate medical support?',
    'Which hospitals currently have ICU capacity?',
    'Where should the next rescue team be deployed?',
    'Which areas have increasing incident activity?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Process intelligence query
    setTimeout(() => {
      let botResponse: Message;

      const q = query.toLowerCase();
      if (q.includes('medical') || q.includes('trapped')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: '2 active incidents have urgent critical medical requirements:',
          structuredData: {
            type: 'INCIDENT_LIST',
            items: [
              'RQ-204891: Madhapur High-Rise (3 trapped, inhalation burns, Unit-EMS-02 on route)',
              'RQ-204892: Musi River Inundation (6 trapped on roof, hypothermia risk, boat squad dispatched)'
            ],
            actionLabel: 'Prioritize Apollo Medic 2'
          }
        };
      } else if (q.includes('icu') || q.includes('hospital')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Current hospital ICU telemetry across command sector:',
          structuredData: {
            type: 'HOSPITAL_LIST',
            items: [
              'NIMS Punjagutta: 19 ICU beds open (Level 1 Trauma) — OPTIMAL',
              'Continental Hospitals Gachibowli: 12 ICU beds open (Level 1 Trauma)',
              'Osmania General: 4 ICU beds open (CRITICAL ONLY)',
              'Gandhi Hospital: 0 ICU beds available (DIVERTING)'
            ],
            actionLabel: 'Route incoming trauma to NIMS / Continental'
          }
        };
      } else if (q.includes('rescue team') || q.includes('deploy')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Recommendation: Deploy Standby Unit SDRF Rapid Zodiac 7 to Nayapul Musi Corridor.',
          structuredData: {
            type: 'DEPLOY_RECOMMENDATION',
            items: [
              'Rationale: Cluster #108 water level rising +0.4m in last 15 mins',
              'Fastest ingress route: Via Afzal Gunj elevated flyover (detour avoids submerged underpass)',
              'Available crew: 8 rescue specialists with inflatable flood rafts'
            ],
            actionLabel: 'Approve Deployment Order'
          }
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Incident report velocity is currently concentrated in Sector 4 (Nayapul / Musi Corridor: 14 reports/hr) and Sector 1 (Madhapur / HITEC: 19 reports/hr). All other sectors operating within normal baseline threshold.'
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Launcher Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-2xl shadow-blue-900/60 border border-blue-400/40 transition transform active:scale-95"
          aria-label="Open ResQAI AI Copilot"
        >
          <Sparkles className="w-4 h-4 text-blue-200 animate-spin" />
          <span>ASK RESQAI COPILOT</span>
        </button>
      ) : (
        <div className="w-[380px] sm:w-[420px] h-[520px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">RESQAI EOC COPILOT</h4>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time Triage Model Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.structuredData && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5 font-mono text-[11px]">
                      {msg.structuredData.items?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-800 transition shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about hospital ICU, units, or incidents..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Safety Disclaimer Footer */}
          <div className="px-3 py-1 bg-slate-950 text-[9px] text-slate-500 font-mono text-center border-t border-slate-900">
            ResQAI AI Copilot is an operational decision support tool. Confirm orders via EOC protocol.
          </div>

        </div>
      )}
    </div>
  );
};
