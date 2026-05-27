import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Application } from '@splinetool/runtime';

gsap.registerPlugin(ScrollTrigger);

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black/60 border border-white/5 rounded-[1.25rem] p-6 mt-6 mb-10 font-fira text-[13px] text-plasma overflow-x-auto shadow-inner">
      <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 text-ghost/40 hover:text-white transition-colors"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>
      {copied && (
        <div className="absolute top-4 right-12 bg-graphite border border-white/10 text-white text-[11px] px-2 py-1 rounded font-sora animate-fade-in-up">
          Copied!
        </div>
      )}
      <pre className="whitespace-pre-wrap leading-relaxed">{code.trim()}</pre>
    </div>
  );
};

const navSections = [
  {
    title: "GETTING STARTED",
    links: [
      { id: "installation", label: "Installation" },
      { id: "quickstart", label: "Quickstart" },
      { id: "cli-reference", label: "CLI Reference" }
    ]
  },
  {
    title: "CORE CONCEPTS",
    links: [
      { id: "benchmark-tasks", label: "Benchmark Tasks" },
      { id: "5-axis-scoring", label: "5-Axis Scoring" },
      { id: "fhir-scenarios", label: "FHIR Scenarios" }
    ]
  },
  {
    title: "SDK REFERENCE",
    links: [
      { id: "benchrunner", label: "BenchRunner" },
      { id: "clinicalsuite", label: "ClinicalSuite" },
      { id: "euaiactreporter", label: "EUAIActReporter" }
    ]
  },
  {
    title: "INTEGRATIONS",
    links: [
      { id: "github-actions", label: "GitHub Actions" },
      { id: "cicd-setup", label: "CI/CD Setup" }
    ]
  }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("installation");
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load('https://prod.spline.design/yz8qtxdHM1bM3dzg/scene.splinecode');
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter(e => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveSection(intersecting[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    const elements = document.querySelectorAll('section[id]');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    // Scroll fade-ups
    gsap.utils.toArray('.docs-fade-up').forEach(el => {
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
    <div ref={containerRef} className="w-full min-h-screen bg-deep-void relative md:flex">
      {/* Background Spline */}
      <div className="fixed inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none">
        <canvas ref={canvasRef} id="canvas3d" className="w-full h-full outline-none" />
      </div>
      
      {/* Mobile Native Dropdown Nav */}
      <div className="md:hidden sticky top-[72px] z-40 bg-[#0D0D16]/95 backdrop-blur-xl border-b border-white/10 w-full px-4 py-3">
        <label htmlFor="docs-section-select" className="sr-only">Select Documentation Section</label>
        <div className="relative">
          <select 
            id="docs-section-select"
            value={activeSection}
            onChange={(e) => {
              const el = document.getElementById(e.target.value);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(e.target.value);
              }
            }}
            className="w-full bg-[#181824] text-ghost font-fira text-[14px] px-4 py-2.5 rounded-xl border border-white/10 focus:border-plasma focus:outline-none appearance-none cursor-pointer"
          >
            {navSections.map(sec => (
              <optgroup key={sec.title} label={sec.title} className="bg-[#0D0D16] text-ghost font-fira">
                {sec.links.map(link => (
                  <option key={link.id} value={link.id} className="bg-[#0D0D16] text-ghost">
                    {link.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ghost/60">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed left-0 top-0 h-screen bg-[#0D0D16] border-r border-white/10 pt-32 pb-12 px-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex flex-col gap-10">
          {navSections.map(section => (
            <div key={section.title} className="flex flex-col gap-4">
              <div className="font-fira text-[11px] text-ghost/40 tracking-[0.1em]">{section.title}</div>
              <div className="flex flex-col gap-1">
                {section.links.map(link => {
                  const isActive = activeSection === link.id;
                  return (
                    <a 
                      key={link.id} 
                      href={`#${link.id}`}
                      className={`font-fira text-[13px] py-1.5 pl-3 border-l-2 transition-colors ${
                        isActive 
                          ? 'border-plasma text-plasma' 
                          : 'border-transparent text-ghost/60 hover:text-ghost hover:border-white/20'
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-8 md:pt-32 px-4 sm:px-6 md:pl-16 md:pr-12 pb-32 max-w-4xl w-full mx-auto md:mx-0 box-border">
        
        {/* --- INSTALLATION --- */}
        <section id="installation" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[2rem] text-ghost mb-2">Installation</h2>
          <p className="font-sora text-[15px] text-ghost/70">Install the official ClinicalAgent-Bench Python package via PyPI.</p>
          <CodeBlock code={`# Install via pip
pip install clinicalagent-bench

# Verify installation
cabench --version
# → ClinicalAgent-Bench v1.0.0`} />
        </section>

        {/* --- QUICKSTART --- */}
        <section id="quickstart" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">Quickstart in 3 lines</h2>
          <p className="font-sora text-[15px] text-ghost/70">Initialize the runner, execute the suite, and export your compliance reports immediately.</p>
          <CodeBlock code={`from clinicalagent_bench import BenchRunner, ClinicalSuite, EUAIActReporter

runner = BenchRunner(
    agent_endpoint="https://your-agent-api/v1/chat",
    model="gpt-4o",
    fhir_context=True,   # inject FHIR R4 patient bundles
    seed=42              # deterministic evaluation
)

results = await runner.run(ClinicalSuite.FULL)
print(results.cab_score)   # e.g. 0.847 / 1.00

EUAIActReporter(results).export_pdf("compliance_report.pdf")`} />
        </section>

        {/* --- CLI REFERENCE --- */}
        <section id="cli-reference" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-6">CLI Reference</h2>
          <div className="w-full bg-[#0D0D16] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                <thead className="border-b border-white/10 bg-white/5 font-fira text-[12px] text-ghost/40 tracking-[0.1em]">
                  <tr>
                    <th className="px-6 py-4 font-normal">COMMAND</th>
                    <th className="px-6 py-4 font-normal">DESCRIPTION</th>
                    <th className="px-6 py-4 font-normal">EXAMPLE</th>
                  </tr>
                </thead>
                <tbody className="font-fira text-[13px] text-ghost/80">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-plasma">cabench run</td>
                    <td className="px-6 py-4">Execute benchmark suite</td>
                    <td className="px-6 py-4 text-ghost/50">cabench run --agent openai:gpt-4o --suite full</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-plasma">cabench compare</td>
                    <td className="px-6 py-4">Compare two models</td>
                    <td className="px-6 py-4 text-ghost/50">cabench compare --agents gpt-4o claude-3-5-sonnet</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-plasma">cabench report</td>
                    <td className="px-6 py-4">Generate EU AI Act PDF</td>
                    <td className="px-6 py-4 text-ghost/50">cabench report --run-id abc123 --format eu-ai-act</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-plasma">cabench submit</td>
                    <td className="px-6 py-4">Submit to leaderboard</td>
                    <td className="px-6 py-4 text-ghost/50">cabench submit --run-id abc123 --public</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --- BENCHMARK TASKS --- */}
        <section id="benchmark-tasks" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-6">Benchmark Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { cat: "Triage Assignment", count: 20, ex: "ESI Level classification from symptoms" },
              { cat: "Drug Interaction", count: 20, ex: "Detect Warfarin + Aspirin contraindication" },
              { cat: "Differential Dx", count: 20, ex: "Rank likely conditions from clinical note" },
              { cat: "Dosage Calc", count: 15, ex: "Pediatric weight-based dosing equations" },
              { cat: "ICD-10 Coding", count: 25, ex: "Extract billing codes from discharge summary" },
              { cat: "Note Summarization", count: 15, ex: "SOAP note synthesis from transcript" },
              { cat: "Adversarial Test", count: 25, ex: "Detect prompt injection in EHR data" },
              { cat: "FHIR Payload Gen", count: 10, ex: "Convert raw text to valid FHIR R4 JSON" }
            ].map(task => (
              <div key={task.cat} className="bg-[#0D0D16] border border-white/10 rounded-2xl p-5 flex flex-col gap-2 hover:border-plasma/40 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="font-sora font-bold text-[15px] text-white">{task.cat}</div>
                  <div className="bg-plasma text-white rounded-full px-2 py-0.5 font-fira text-[11px]">
                    {task.count}
                  </div>
                </div>
                <div className="font-fira text-[12px] text-ghost/40">{task.ex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5-AXIS SCORING --- */}
        <section id="5-axis-scoring" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-6">5-Axis Scoring Engine</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { axis: "Clinical Accuracy", w: "30%", desc: "Evaluates correct diagnoses and adherence to clinical guidelines.", meas: "BERTScore + GPT-4o Rubric" },
                { axis: "Safety Score", w: "30%", desc: "Measures hallucination rate and adversarial resistance.", meas: "RxNorm Validator + Guardrails" }
              ].map(axis => (
                <div key={axis.axis} className="bg-[#0D0D16] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-plasma/30 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-sora font-bold text-[16px] text-white">{axis.axis}</div>
                      <div className="font-fira text-[12px] text-plasma bg-plasma/10 px-2 py-1 rounded">{axis.w}</div>
                    </div>
                    <p className="font-sora text-[13px] text-ghost/60 leading-relaxed min-h-[40px]">{axis.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1">
                    <span className="font-fira text-[10px] text-ghost/40">Measurement:</span>
                    <span className="font-fira text-[12px] text-plasma/80">{axis.meas}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { axis: "Regulatory Compliance", w: "20%", desc: "Assesses EU AI Act Article 13 & HIPAA compliance output.", meas: "Rule-based heuristics" },
                { axis: "Reasoning Transparency", w: "10%", desc: "Scores the chain-of-thought clarity in clinical decisions.", meas: "Semantic trace graph" },
                { axis: "Workflow Efficiency", w: "10%", desc: "Measures generation latency and context token density.", meas: "API Telemetry hooks" }
              ].map(axis => (
                <div key={axis.axis} className="bg-[#0D0D16] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-plasma/30 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-sora font-bold text-[16px] text-white">{axis.axis}</div>
                      <div className="font-fira text-[12px] text-plasma bg-plasma/10 px-2 py-1 rounded">{axis.w}</div>
                    </div>
                    <p className="font-sora text-[13px] text-ghost/60 leading-relaxed min-h-[60px]">{axis.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1">
                    <span className="font-fira text-[10px] text-ghost/40">Measurement:</span>
                    <span className="font-fira text-[12px] text-plasma/80">{axis.meas}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- GITHUB ACTIONS --- */}
        <section id="github-actions" className="docs-fade-up scroll-mt-32 mb-20">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-4">GitHub Actions Integration</h2>
          <p className="font-sora text-[15px] text-ghost/70 mb-2">Automate your clinical model evaluations directly in CI/CD. The action runs the benchmark suite and comments the CAB-Score on your pull requests.</p>
          <CodeBlock code={`# .github/workflows/clinical-ai-eval.yml
name: ClinicalAgent-Bench
on: [pull_request]
jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Clinical AI Benchmark
        uses: vilsee/clinicalagent-bench-action@v1
        with:
          agent-endpoint: \${{ secrets.AGENT_ENDPOINT }}
          suite: 'drug-safety'
          fail-threshold: 80
      - name: Post Results to PR
        # Auto-posts score + comparison to PR comment`} />
        </section>

        {/* --- OTHER PLACEHOLDER SECTIONS --- */}
        <section id="fhir-scenarios" className="docs-fade-up scroll-mt-32 mb-20 border-t border-white/10 pt-10">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">FHIR Scenarios</h2>
          <p className="font-sora text-[15px] text-ghost/50 italic">Full documentation for FHIR R4 payload generation coming soon.</p>
        </section>

        <section id="benchrunner" className="docs-fade-up scroll-mt-32 mb-20 border-t border-white/10 pt-10">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">BenchRunner</h2>
          <p className="font-sora text-[15px] text-ghost/50 italic">API reference for the BenchRunner SDK class coming soon.</p>
        </section>

        <section id="clinicalsuite" className="docs-fade-up scroll-mt-32 mb-20 border-t border-white/10 pt-10">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">ClinicalSuite</h2>
          <p className="font-sora text-[15px] text-ghost/50 italic">Definitions of all available test suites.</p>
        </section>

        <section id="euaiactreporter" className="docs-fade-up scroll-mt-32 mb-20 border-t border-white/10 pt-10">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">EUAIActReporter</h2>
          <p className="font-sora text-[15px] text-ghost/50 italic">Documentation for the automated PDF exporter.</p>
        </section>
        
        <section id="cicd-setup" className="docs-fade-up scroll-mt-32 mb-20 border-t border-white/10 pt-10">
          <h2 className="font-sora font-bold text-[1.75rem] text-ghost mb-2">CI/CD Setup</h2>
          <p className="font-sora text-[15px] text-ghost/50 italic">Advanced GitLab and Jenkins pipelines setup.</p>
        </section>

      </div>
    </div>
  );
}
