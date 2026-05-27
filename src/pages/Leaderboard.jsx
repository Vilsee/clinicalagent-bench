import React, { useState, useRef, useEffect } from 'react';
import { Crown, Copy, Check, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Application } from '@splinetool/runtime';
import ScoreRadar from '../components/ScoreRadar';

const Github = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


gsap.registerPlugin(ScrollTrigger);

const leaderboardData = [
  { rank: 1, model: "Claude 3.5 Sonnet", provider: "Anthropic", cab: 91.2, acc: 93.1, saf: 94.7, comp: 89.2, eff: 87.8, trans: 90, tasks: 150 },
  { rank: 2, model: "GPT-4o", provider: "OpenAI", cab: 87.3, acc: 89.4, saf: 88.2, comp: 86.1, eff: 85.0, trans: 81, tasks: 150 },
  { rank: 3, model: "Gemini 1.5 Pro", provider: "Google", cab: 85.6, acc: 86.9, saf: 84.3, comp: 87.4, eff: 83.2, trans: 84, tasks: 150 },
  { rank: 4, model: "Mistral-Medical", provider: "Mistral AI", cab: 82.1, acc: 83.7, saf: 86.4, comp: 78.2, eff: 79.9, trans: 85, tasks: 100 },
  { rank: 5, model: "Llama 3.3-70B", provider: "Meta", cab: 79.8, acc: 81.2, saf: 80.1, comp: 74.3, eff: 82.0, trans: 92, tasks: 150 },
  { rank: 6, model: "Meditron-70B", provider: "EPFL", cab: 78.4, acc: 82.6, saf: 79.8, comp: 69.1, eff: 77.3, trans: 80, tasks: 80 },
  { rank: 7, model: "BioMedLM-7B", provider: "Stanford", cab: 71.2, acc: 75.3, saf: 73.4, comp: 61.8, eff: 69.9, trans: 72, tasks: 50 },
  { rank: 8, model: "GPT-4o-mini", provider: "OpenAI", cab: 69.8, acc: 70.2, saf: 72.1, comp: 65.4, eff: 71.6, trans: 68, tasks: 150 },
  { rank: 9, model: "Llama 3.1-8B", provider: "Meta", cab: 61.3, acc: 63.8, saf: 64.2, comp: 55.2, eff: 60.9, trans: 65, tasks: 50 },
  { rank: 10, model: "Mistral-7B", provider: "Mistral AI", cab: 58.7, acc: 60.1, saf: 61.3, comp: 51.4, eff: 59.2, trans: 55, tasks: 50 }
];

const filters = ["All Suites", "Drug Safety", "Triage", "Adversarial"];

const getScoreColor = (val) => {
  if (val >= 85) return 'text-green-400';
  if (val >= 75) return 'text-amber-400';
  return 'text-red-400 opacity-80';
};

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState("All Suites");
  const [sortOpt, setSortOpt] = useState("CAB-Score ↓");

  const [compareA, setCompareA] = useState("Claude 3.5 Sonnet");
  const [compareB, setCompareB] = useState("GPT-4o");
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load('https://prod.spline.design/2G0eiL4kJEqw506S/scene.splinecode');
    }
  }, []);

  const modelA = leaderboardData.find(m => m.model === compareA);
  const modelB = leaderboardData.find(m => m.model === compareB);

  const handleCopy = () => {
    navigator.clipboard.writeText('cabench run --submit');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(() => {
    // Count-up animation for score cells
    if (tableRef.current) {
      ScrollTrigger.create({
        trigger: tableRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const scoreCells = tableRef.current.querySelectorAll('.score-cell');
          scoreCells.forEach(cell => {
            const finalVal = parseFloat(cell.dataset.value);
            if (isNaN(finalVal)) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: finalVal,
              duration: 1,
              ease: 'power2.out',
              onUpdate: () => {
                cell.textContent = obj.val.toFixed(1);
              }
            });
          });
        }
      });
    }

    // Scroll fade-ups
    gsap.utils.toArray('.lb-fade-up').forEach(el => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-deep-void relative pt-32 pb-24">
      {/* Background Spline */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.2, mixBlendMode: 'screen' }}>
        <canvas ref={canvasRef} id="leaderboard-canvas3d" style={{ width: '100vw', height: '100vh', display: 'block' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 lb-fade-up">
          <div className="flex flex-col gap-2">
            <h1 className="font-sora font-bold text-[2rem] md:text-[2.5rem] text-ghost leading-tight">Model Leaderboard</h1>
            <p className="font-fira text-[13px] text-plasma max-w-xl">
              Community benchmark results across clinical AI models. Updated in real-time.
            </p>
          </div>
          <div className="font-fira text-[11px] text-ghost/40">
            Last updated: 28 May 2026 &middot; 14:32 UTC
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 lb-fade-up">
          <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 font-sora text-sm rounded-full whitespace-nowrap transition-colors ${
                  activeFilter === f ? 'bg-plasma text-white' : 'text-ghost/60 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-[#0D0D16] border border-white/10 rounded-full pl-5 pr-10 py-2.5 font-fira text-xs text-ghost/80 focus:outline-none focus:border-plasma transition-colors"
              value={sortOpt}
              onChange={(e) => setSortOpt(e.target.value)}
            >
              <option>CAB-Score ↓</option>
              <option>Safety ↓</option>
              <option>Accuracy ↓</option>
              <option>Efficiency ↓</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost/40 pointer-events-none" />
          </div>
        </div>

        {/* TABLE */}
        <div ref={tableRef} className="w-full bg-[#0D0D16] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[800px]">
              <thead className="border-b border-white/10 bg-white/5 font-fira text-[12px] text-ghost/40 tracking-[0.1em]">
                <tr>
                  <th className="px-6 py-5 font-normal sticky left-0 bg-[#0D0D16] z-10">RANK</th>
                  <th className="px-6 py-5 font-normal sticky left-[88px] bg-[#0D0D16] z-10">MODEL</th>
                  <th className="px-6 py-5 font-normal">PROVIDER</th>
                  <th className="px-6 py-5 font-normal text-plasma font-semibold">CAB-SCORE</th>
                  <th className="px-6 py-5 font-normal">ACCURACY</th>
                  <th className="px-6 py-5 font-normal">SAFETY</th>
                  <th className="px-6 py-5 font-normal">COMPLIANCE</th>
                  <th className="px-6 py-5 font-normal">EFFICIENCY</th>
                  <th className="px-6 py-5 font-normal">TASKS RUN</th>
                </tr>
              </thead>
              <tbody className="font-sora text-[13px] text-ghost">
                {leaderboardData.map((row) => (
                  <tr 
                    key={row.model} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${
                      row.rank === 1 ? 'bg-plasma/15 border-l-2 border-l-plasma' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    <td className="px-6 py-4 sticky left-0 bg-[#0D0D16] z-10">
                      {row.rank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-plasma text-white flex items-center justify-center font-fira shadow-[0_0_15px_rgba(123,97,255,0.4)]">
                          <Crown size={14} />
                        </div>
                      ) : row.rank <= 3 ? (
                        <div className="flex items-center gap-2 font-fira text-ghost/80">
                          <span className={`w-2 h-2 rounded-full ${row.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}`} />
                          {row.rank}
                        </div>
                      ) : (
                        <div className="font-fira text-ghost/40 ml-4">{row.rank}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-ghost group-hover:text-plasma transition-colors sticky left-[88px] bg-[#0D0D16] z-10">{row.model}</td>
                    <td className="px-6 py-4 text-ghost/60">{row.provider}</td>
                    
                    <td className="px-6 py-4 font-sora font-bold text-[16px] text-plasma">
                      <span className="score-cell" data-value={row.cab}>0.0</span>
                    </td>
                    
                    <td className={`px-6 py-4 font-fira ${getScoreColor(row.acc)}`}>
                      <span className="score-cell" data-value={row.acc}>0.0</span>
                    </td>
                    <td className={`px-6 py-4 font-fira ${getScoreColor(row.saf)}`}>
                      <span className="score-cell" data-value={row.saf}>0.0</span>
                    </td>
                    <td className={`px-6 py-4 font-fira ${getScoreColor(row.comp)}`}>
                      <span className="score-cell" data-value={row.comp}>0.0</span>
                    </td>
                    <td className={`px-6 py-4 font-fira ${getScoreColor(row.eff)}`}>
                      <span className="score-cell" data-value={row.eff}>0.0</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-fira text-[11px] text-ghost/60">{row.tasks}</span>
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-plasma" style={{ width: `${(row.tasks / 150) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPARISON WIDGET */}
        <div className="w-full flex flex-col gap-6 mt-12 lb-fade-up">
          <h3 className="font-sora font-semibold text-[1.25rem] text-ghost">Compare Two Models Side by Side</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Model A */}
            <div className="bg-[#0D0D16] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 relative">
              <div className="relative w-full max-w-sm">
                <select 
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 font-sora text-sm text-white focus:outline-none focus:border-plasma transition-colors"
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                >
                  {leaderboardData.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost/40 pointer-events-none" />
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <div className="font-instrument italic text-[3rem] text-plasma leading-none mb-2">{modelA.cab.toFixed(1)}</div>
                <div className="font-fira text-xs text-ghost/40">CAB-SCORE</div>
                
                <div className="w-full max-w-sm aspect-square mt-4">
                  <ScoreRadar axes={{ accuracy: modelA.acc, safety: modelA.saf, compliance: modelA.comp, transparency: modelA.trans, workflow: modelA.eff }} />
                </div>
              </div>
            </div>

            {/* Model B */}
            <div className="bg-[#0D0D16] border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 relative">
              <div className="relative w-full max-w-sm">
                <select 
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 font-sora text-sm text-white focus:outline-none focus:border-plasma transition-colors"
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                >
                  {leaderboardData.map(m => <option key={m.model} value={m.model}>{m.model}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost/40 pointer-events-none" />
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <div className="font-instrument italic text-[3rem] text-plasma leading-none mb-2">{modelB.cab.toFixed(1)}</div>
                <div className="font-fira text-xs text-ghost/40">CAB-SCORE</div>
                
                <div className="w-full max-w-sm aspect-square mt-4">
                  <ScoreRadar axes={{ accuracy: modelB.acc, safety: modelB.saf, compliance: modelB.comp, transparency: modelB.trans, workflow: modelB.eff }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SUBMIT BANNER */}
        <div className="mt-16 w-full bg-plasma/10 border border-plasma/30 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden lb-fade-up">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(123,97,255,0.2)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="flex flex-col gap-3 relative z-10">
            <h3 className="font-sora font-bold text-2xl text-white">Benchmarked a model not listed here?</h3>
            <p className="font-sora text-ghost/60">Submit results to the community leaderboard.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <div className="relative group">
              <button 
                onClick={handleCopy}
                className="bg-black/40 border border-white/10 rounded-full px-6 py-3 font-fira text-sm text-ghost flex items-center gap-2 hover:bg-black/60 transition-colors"
              >
                $ cabench run --submit
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="opacity-50" />}
              </button>
              {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-xs px-3 py-1.5 rounded shadow-lg animate-fade-in-up">
                  Copied!
                </div>
              )}
            </div>
            
            <a 
              href="https://github.com/vilsee/clinicalagent-bench"
              target="_blank"
              rel="noreferrer"
              className="bg-plasma text-white rounded-full px-6 py-3 font-sora font-medium text-sm flex items-center gap-2 hover:bg-plasma/90 transition-colors"
            >
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
