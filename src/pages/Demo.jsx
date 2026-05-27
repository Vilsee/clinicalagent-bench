import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Application } from '@splinetool/runtime';
import { Download, Share2, Check } from 'lucide-react';
import ScoreRadar from '../components/ScoreRadar';

const modelsData = {
  "GPT-4o": { score: 87.3, axes: { accuracy: 94, safety: 89, compliance: 82, transparency: 81, workflow: 90 }, provider: "OpenAI" },
  "Claude 3.5 Sonnet": { score: 91.2, axes: { accuracy: 96, safety: 95, compliance: 88, transparency: 90, workflow: 87 }, provider: "Anthropic" },
  "Llama 3.3-70B": { score: 79.8, axes: { accuracy: 82, safety: 76, compliance: 75, transparency: 92, workflow: 74 }, provider: "Meta" },
  "Mistral-Medical": { score: 82.1, axes: { accuracy: 86, safety: 84, compliance: 80, transparency: 85, workflow: 75 }, provider: "Mistral" },
  "Gemini 1.5 Pro": { score: 85.6, axes: { accuracy: 89, safety: 86, compliance: 81, transparency: 84, workflow: 88 }, provider: "Google" }
};

const suites = ["Full Suite (150 tasks)", "Drug Safety (20)", "Triage (20)", "Adversarial (25)"];

export default function Demo() {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [selectedSuite, setSelectedSuite] = useState(suites[0]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  
  const [downloading, setDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [shareToast, setShareToast] = useState(false);

  const canvasRef = useRef(null);
  const logsEndRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load('https://prod.spline.design/u62bp2Bp4AGMfhbE/scene.splinecode');
    }
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Cmd+Enter / Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isRunning && !isComplete) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isComplete, selectedModel, selectedSuite]);

  const handleRun = () => {
    setIsRunning(true);
    setIsComplete(false);
    setLogs([]);
    setProgress(0);
    setTaskCount(0);

    const simulationSteps = [
      { t: 0, msg: `[00:00] Initializing ClinicalAgent-Bench v1.0.0...` },
      { t: 600, msg: `[00:01] Loading FHIR R4 scenario engine...` },
      { t: 1200, msg: `[00:02] Injecting synthetic patient bundles (Synthea)...` },
      { t: 2000, msg: `[00:03] Connecting to model: ${selectedModel}...` },
      { t: 3000, msg: `[00:04] Running Task 1/20: ESI Triage Level Assignment...`, count: 1 },
      { t: 4000, msg: `[00:05] ✓ Task 1 complete. Clinical Accuracy: 96.0` },
      { t: 4500, msg: `[00:06] Running Task 2/20: Drug Interaction Detection...`, count: 2 },
      { t: 5500, msg: `[00:07] ✓ Task 2 complete. Safety: 99.2` },
      { t: 6000, msg: `... running remaining tasks in parallel...`, count: 12 },
      { t: 6500, msg: `...`, count: 18 },
      { t: 7000, msg: `[00:45] All tasks complete. Computing 5-axis scores...`, count: 20 },
      { t: 7500, msg: `[00:46] Generating EU AI Act Article 13 report...` },
      { t: 8000, msg: `[00:47] ✓ Benchmark run complete.` }
    ];

    gsap.to({ p: 0 }, {
      p: 100,
      duration: 8,
      ease: "none",
      onUpdate: function() {
        setProgress(this.targets()[0].p);
      }
    });

    simulationSteps.forEach(step => {
      setTimeout(() => {
        setLogs(prev => [...prev, step.msg]);
        if (step.count !== undefined) {
          setTaskCount(step.count);
        }
      }, step.t);
    });

    setTimeout(() => {
      setIsRunning(false);
      setIsComplete(true);
      setTimeout(() => {
        gsap.fromTo('.result-anim', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      }, 50);
    }, 8500);
  };

  const handleDownload = () => {
    setDownloading(true);
    setToastMsg("Demo: In production, this generates a real PDF conformity report.");
    
    gsap.fromTo('.dl-progress', { width: '0%' }, { width: '100%', duration: 1.5, ease: 'power2.out', onComplete: () => {
      setTimeout(() => {
        setDownloading(false);
        setToastMsg("");
      }, 2000);
    }});
  };

  const handleShare = () => {
    const fakeUrl = `https://clinicalagent-bench.dev/run/${Date.now().toString(36)}`;
    navigator.clipboard.writeText(fakeUrl);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleMouseMove = (e) => {
    if (!btnRef.current || isRunning) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.2;
    const y = (e.clientY - top - height / 2) * 0.2;
    btnRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current || isRunning) return;
    btnRef.current.style.transform = `translate(0px, 0px) scale(1)`;
  };

  const data = modelsData[selectedModel];
  const axisList = [
    { label: "Accuracy", val: data.axes.accuracy },
    { label: "Safety", val: data.axes.safety },
    { label: "Compliance", val: data.axes.compliance },
    { label: "Transparency", val: data.axes.transparency },
    { label: "Workflow", val: data.axes.workflow }
  ];

  return (
    <div className="w-full min-h-screen bg-[#0A0A14] relative pb-32">
      {/* Background Spline */}
      <div className="fixed inset-0 z-0 opacity-25 mix-blend-screen pointer-events-none">
        <canvas ref={canvasRef} id="canvas3d" className="w-full h-full outline-none" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mt-8">
          <h1 className="font-sora font-bold text-[2rem] md:text-[2.5rem] text-ghost leading-tight">Live Benchmark Runner</h1>
          <p className="font-fira text-[13px] text-plasma">
            Select a model and task suite, then run. Results are simulated for demo purposes.
          </p>
        </div>

        {/* Form Controls */}
        <div className="flex flex-col gap-10">
          {/* Step 1 */}
          <div className="flex flex-col gap-4">
            <div className="font-fira text-[12px] text-plasma tracking-[0.15em]">01 / SELECT MODEL</div>
            <div className="flex flex-wrap md:flex-nowrap gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {Object.keys(modelsData).map(m => {
                const isSel = selectedModel === m;
                return (
                  <div 
                    key={m}
                    onClick={() => { if(!isRunning) { setSelectedModel(m); setIsComplete(false); } }}
                    className={`flex-shrink-0 border rounded-2xl px-5 py-4 cursor-pointer transition-all duration-300 ${isSel ? 'border-plasma bg-plasma/10 shadow-[0_0_40px_rgba(123,97,255,0.3)] scale-[1.02]' : 'bg-[#0D0D16] border-white/10 hover:border-white/30'}`}
                  >
                    <div className="font-sora font-medium text-[16px] text-ghost mb-2">{m}</div>
                    <div className="inline-block font-fira text-[11px] bg-white/5 text-ghost/70 rounded px-2 py-0.5">
                      {modelsData[m].provider}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-4">
            <div className="font-fira text-[12px] text-plasma tracking-[0.15em]">02 / SELECT SUITE</div>
            <div className="flex flex-wrap gap-3">
              {suites.map(s => {
                const isSel = selectedSuite === s;
                return (
                  <button 
                    key={s}
                    onClick={() => { if(!isRunning) { setSelectedSuite(s); setIsComplete(false); } }}
                    className={`rounded-full px-5 py-2 font-sora text-[14px] transition-colors ${isSel ? 'bg-plasma text-white' : 'bg-white/5 border border-white/10 text-ghost/60 hover:text-ghost hover:bg-white/10'}`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Ghost Results / Run Button */}
        {!isRunning && !isComplete && (
          <div className="flex flex-col items-center gap-6 mt-8">
            <button
              ref={btnRef}
              onClick={handleRun}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-plasma text-white font-sora font-bold text-[18px] rounded-full px-12 py-5 transition-transform duration-300 shadow-lg shadow-plasma/20"
            >
              ▶ Run Benchmark
            </button>
            <div className="font-fira text-[11px] text-ghost/30">
              Press <kbd className="bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-ghost/50 mx-0.5">⌘</kbd>+<kbd className="bg-white/10 border border-white/10 rounded px-1.5 py-0.5 text-ghost/50 mx-0.5">Enter</kbd> to run
            </div>

            {/* Ghost results preview */}
            <div className="w-full mt-4 relative">
              <div className="absolute inset-0 z-10 bg-deep-void/60 backdrop-blur-sm rounded-[2rem] flex items-center justify-center">
                <div className="font-fira text-[13px] text-ghost/50 bg-white/5 border border-white/10 rounded-full px-6 py-3">
                  Run benchmark to see results
                </div>
              </div>
              <div className="opacity-20 pointer-events-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                    <div className="font-instrument text-[6rem] text-plasma/40 italic leading-none">—.—</div>
                    <div className="font-sora text-[16px] text-ghost/30 mt-2">CAB-Score</div>
                  </div>
                  <div className="glass-card p-6 flex flex-col items-center justify-center h-48">
                    <div className="font-fira text-[12px] text-ghost/20">Radar chart</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Execution Simulation */}
        {(isRunning || isComplete) && (
          <div className="flex flex-col gap-4 mt-8 animate-fade-in-up">
            <div className="bg-black/60 rounded-2xl p-6 border border-white/5 shadow-xl min-h-[300px] flex flex-col font-fira text-[13px] text-plasma relative overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-2">
                {logs.map((log, i) => (
                  <div key={i} className="animate-fade-in">{log}</div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between font-fira text-[12px] text-ghost/60">
                <span>Progress</span>
                <span>{taskCount} / 20 tasks</span>
              </div>
              <div className="h-1 bg-plasma/20 rounded-full overflow-hidden">
                <div className="h-full bg-plasma" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {isComplete && (
          <div className="flex flex-col gap-10 mt-12">
            <div className="font-fira text-[12px] text-plasma tracking-[0.15em] result-anim">03 / RESULTS</div>
            
            {/* Top Row: Hero + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 result-anim">
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                <div className="font-instrument text-[6rem] text-plasma italic leading-none">{data.score}</div>
                <div className="font-sora text-[16px] text-ghost/60 mt-2">CAB-Score</div>
                <div className="font-fira text-[12px] text-ghost/40 mt-4">Clinical AI Benchmark Score / 100</div>
              </div>
              
              <div className="glass-card p-6 flex flex-col items-center justify-center">
                <ScoreRadar axes={data.axes} />
              </div>
            </div>

            {/* Axis Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 result-anim">
              {axisList.map(ax => {
                const isPass = ax.val >= 85;
                return (
                  <div key={ax.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                    <div className="font-fira text-[12px] text-ghost/70">{ax.label}</div>
                    <div className="font-sora font-bold text-[1.5rem] text-plasma">{ax.val}</div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-plasma" style={{ width: `${ax.val}%` }} />
                    </div>
                    <div className={`font-fira text-[10px] px-2 py-1 rounded inline-flex self-start ${isPass ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {isPass ? 'PASS' : 'REVIEW'}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Task Table */}
            <div className="glass-card overflow-hidden result-anim">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sora text-[13px] text-ghost">
                  <thead className="border-b border-white/10 bg-white/5 font-fira text-[11px] text-ghost/60">
                    <tr>
                      <th className="px-6 py-4 font-normal">Task</th>
                      <th className="px-6 py-4 font-normal">Category</th>
                      <th className="px-6 py-4 font-normal">Score</th>
                      <th className="px-6 py-4 font-normal">Safety</th>
                      <th className="px-6 py-4 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "Triage Assignment", c: "Clinical", s: 96, sf: "Pass", st: "PASS" },
                      { t: "Drug Interaction", c: "Safety", s: 99, sf: "Pass", st: "PASS" },
                      { t: "Differential Dx", c: "Clinical", s: selectedModel==='GPT-4o'?94:82, sf: "Pass", st: selectedModel==='GPT-4o'?"PASS":"REVIEW" },
                      { t: "Dosage Calc", c: "Safety", s: 100, sf: "Pass", st: "PASS" },
                      { t: "ICD-10 Coding", c: "Workflow", s: 88, sf: "Pass", st: "PASS" },
                      { t: "Note Summarization", c: "Workflow", s: 92, sf: "Pass", st: "PASS" },
                      { t: "Adversarial Test A", c: "Compliance", s: selectedModel==='Llama 3.3-70B'?70:85, sf: selectedModel==='Llama 3.3-70B'?"Flag":"Pass", st: selectedModel==='Llama 3.3-70B'?"FAIL":"PASS" },
                      { t: "FHIR Payload Gen", c: "System", s: 95, sf: "Pass", st: "PASS" },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#0D0D16]' : 'bg-transparent'}`}>
                        <td className="px-6 py-4 font-medium">{row.t}</td>
                        <td className="px-6 py-4 text-ghost/70">{row.c}</td>
                        <td className="px-6 py-4 font-fira text-plasma">{row.s}</td>
                        <td className="px-6 py-4">{row.sf}</td>
                        <td className="px-6 py-4">
                          <span className={`font-fira text-[10px] px-2 py-1 rounded-full ${
                            row.st === 'PASS' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            row.st === 'REVIEW' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {row.st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 result-anim relative">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="relative overflow-hidden bg-transparent border border-plasma text-plasma font-fira rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-plasma/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="dl-progress absolute left-0 top-0 bottom-0 bg-plasma/20 w-0 z-0" />
                <span className="relative z-10 flex items-center gap-2">📄 Download Article 13 Report (PDF)</span>
              </button>

              <button
                onClick={handleShare}
                className="relative overflow-hidden bg-white/5 border border-white/10 text-ghost font-fira rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                {shareToast ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                <span>{shareToast ? 'Link copied!' : 'Share Results'}</span>
              </button>
              
              {toastMsg && (
                <div className="absolute -bottom-12 bg-graphite border border-white/10 text-white text-xs px-4 py-2 rounded font-sora shadow-lg animate-fade-in-up z-20">
                  {toastMsg}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
