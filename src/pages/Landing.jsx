import React, { useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import FeatureCards from '../components/FeatureCards';

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

export default function Landing() {
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [bottomCopied, setBottomCopied] = useState(false);

  const statRef150 = useRef(null);
  const statRef5 = useRef(null);
  
  const manifestoRef = useRef(null);
  const bgParallaxRef = useRef(null);

  const handleCopy = (setter) => {
    navigator.clipboard.writeText('pip install clinicalagent-bench');
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  useGSAP(() => {
    // 1. Hero entrance animation
    gsap.fromTo(
      '.hero-anim',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3
      }
    );

    // 2. Stats count-up on scroll
    ScrollTrigger.create({
      trigger: '.stats-container',
      start: 'top 85%',
      onEnter: () => {
        const obj150 = { val: 0 };
        gsap.to(obj150, {
          val: 150,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (statRef150.current) {
              statRef150.current.innerText = Math.round(obj150.val) + '+';
            }
          }
        });

        const obj5 = { val: 0 };
        gsap.to(obj5, {
          val: 5,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            if (statRef5.current) {
              statRef5.current.innerText = Math.round(obj5.val) + '-Axis';
            }
          }
        });
      }
    });

    // 3. Parallax background in manifesto
    if (bgParallaxRef.current && manifestoRef.current) {
      gsap.fromTo(bgParallaxRef.current,
        { yPercent: -5 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top bottom', 
            end: 'bottom top',   
            scrub: true
          }
        }
      );
    }

    // 4. Word-by-word reveal for contrast statement
    gsap.fromTo(
      '.reveal-word',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.manifesto-text',
          start: 'top 80%',
        }
      }
    );

    // 5. Stacking Protocol Panels — desktop only
    ScrollTrigger.matchMedia({
      "(min-width: 768px)": () => {
        const panels = gsap.utils.toArray('.protocol-panel');
        panels.forEach((panel, i) => {
          if (i === 0) return;
          
          gsap.to(panels[i - 1], {
            scale: 0.92,
            opacity: 0.4,
            y: -30,
            filter: 'blur(8px)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top top',
              scrub: true
            }
          });
        });
      }
    });

    // EKG SVG Animation
    gsap.to('.ekg-path', {
      strokeDashoffset: 0,
      duration: 2,
      repeat: -1,
      ease: 'none'
    });

    // 6. Scroll fade-ups for sections
    gsap.utils.toArray('.scroll-fade-up').forEach(el => {
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

  const manifestoText = "We built the evaluation layer the industry was missing.";
  const manifestoWords = manifestoText.split(' ');

  return (
    <div ref={containerRef} className="w-full relative bg-deep-void">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[100dvh] flex items-end pb-12 md:pb-20 pl-6 md:pl-12 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/70 to-transparent" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(123,97,255,0.2)_0%,transparent_50%)]" />

        {/* Drifting particles */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute left-[15%] bottom-0 w-1.5 h-1.5 rounded-full bg-plasma/60 animate-particle-drift" style={{ animationDuration: '12s', animationDelay: '0s' }} />
          <div className="absolute left-[55%] bottom-0 w-1 h-1 rounded-full bg-plasma/40 animate-particle-drift" style={{ animationDuration: '16s', animationDelay: '3s' }} />
          <div className="absolute left-[80%] bottom-0 w-2 h-2 rounded-full bg-plasma/30 animate-particle-drift" style={{ animationDuration: '20s', animationDelay: '7s' }} />
        </div>

        <div className="absolute top-28 right-6 md:right-12 z-20 flex items-center gap-2 bg-plasma/20 border border-plasma/40 rounded-full px-4 py-2 font-fira text-[11px] text-white">
          <span className="w-2 h-2 rounded-full bg-plasma animate-pulse" />
          HACKATHON LIVE
        </div>

        <div className="relative z-10 max-w-5xl flex flex-col gap-4 pb-4">
          <div className="hero-anim font-sora font-bold text-ghost leading-none text-[clamp(2rem,6vw,5rem)] md:text-[clamp(3rem,6vw,5rem)]">
            Evaluate clinical AI
          </div>
          <div className="hero-anim font-instrument text-plasma leading-none text-[clamp(2.5rem,9vw,8rem)] md:text-[clamp(4rem,9vw,8rem)]">
            beyond guesswork.
          </div>
          <div className="hero-anim font-sora font-normal text-[16px] md:text-[18px] text-ghost/70 mt-4 max-w-2xl">
            150+ benchmark tasks. 5-axis scoring. EU AI Act reports. One open-source SDK.
          </div>

          <div className="hero-anim flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            <button className="bg-plasma text-white rounded-full px-6 md:px-8 py-3 md:py-4 font-sora font-semibold text-base md:text-lg hover:bg-plasma/90 transition-colors flex items-center justify-center group">
              Run Your First Benchmark 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
            <button 
              onClick={() => handleCopy(setCopied)}
              className="relative group bg-white/10 border border-white/20 text-ghost font-fira rounded-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-center gap-3 hover:bg-white/20 transition-colors text-sm md:text-base"
            >
              pip install clinicalagent-bench
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-graphite border border-white/10 text-white text-xs px-3 py-1.5 rounded font-sora transition-all duration-300 shadow-lg ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                Copied!
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="stats-container w-full bg-[#0D0D16] border-y border-white/10 py-10 relative z-20">
        {/* Shimmer border */}
        <div className="absolute bottom-0 left-0 w-full h-px animate-shimmer" />
        
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-12">
          
          <div className="flex flex-col items-center text-center">
            <div ref={statRef150} className="font-instrument text-[3rem] text-plasma leading-none mb-1">0+</div>
            <div className="font-sora text-[14px] text-ghost/60">Benchmark Tasks</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center text-center">
            <div ref={statRef5} className="font-instrument text-[3rem] text-plasma leading-none mb-1">0-Axis</div>
            <div className="font-sora text-[14px] text-ghost/60">Scoring Engine</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center text-center">
            <div className="font-instrument text-[3rem] text-plasma leading-none mb-1">EU AI Act</div>
            <div className="font-sora text-[14px] text-ghost/60">Compliant Reports</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center text-center">
            <div className="font-instrument text-[3rem] text-plasma leading-none mb-1">MIT</div>
            <div className="font-sora text-[14px] text-ghost/60">Open Source</div>
          </div>

        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section ref={manifestoRef} className="relative w-full py-32 px-6 md:px-8 bg-[#0A0A14] overflow-hidden">
        <div 
          ref={bgParallaxRef}
          className="absolute inset-0 z-0 opacity-10 bg-cover bg-center pointer-events-none scale-110"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1920&q=80')`,
            backgroundAttachment: 'fixed'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="font-fira text-[12px] text-plasma tracking-[0.2em] mb-12 uppercase">
            Our Approach
          </div>

          <div className="manifesto-text flex flex-col gap-6 mb-20 w-full">
            <p className="font-sora font-normal text-[1.5rem] text-ghost/50">
              Most clinical AI ships without systematic evaluation.
            </p>
            <h2 className="font-instrument leading-tight text-ghost" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              {manifestoWords.map((word, i) => {
                const isLast = i === manifestoWords.length - 1;
                return (
                  <span key={i} className={`reveal-word inline-block mr-[0.3em] ${isLast ? 'text-plasma' : ''}`}>
                    {word}
                  </span>
                )
              })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left scroll-fade-up">
            <div className="glass-card p-8 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <h3 className="font-sora font-semibold text-lg text-white group-hover:text-plasma transition-colors">Open Standard</h3>
              <p className="font-sora text-sm text-ghost/70 leading-relaxed">
                Like pytest for your ML pipeline — composable, CI/CD native, no vendor lock-in.
              </p>
            </div>
            
            <div className="glass-card p-8 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <h3 className="font-sora font-semibold text-lg text-white group-hover:text-plasma transition-colors">Clinically Grounded</h3>
              <p className="font-sora text-sm text-ghost/70 leading-relaxed">
                Tasks derived from MIMIC-III, PhysioNet, and FHIR R4 real-world scenarios.
              </p>
            </div>

            <div className="glass-card p-8 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 group">
              <h3 className="font-sora font-semibold text-lg text-white group-hover:text-plasma transition-colors">Regulation-Ready</h3>
              <p className="font-sora text-sm text-ghost/70 leading-relaxed">
                Auto-generates EU AI Act Article 13 conformity reports from every run.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="relative w-full py-32 px-6 md:px-8 bg-[#0D0D16] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col">
          <div className="font-fira text-[11px] text-plasma tracking-[0.2em] mb-4 uppercase scroll-fade-up">HOW IT WORKS</div>
          <h2 className="font-sora font-bold text-[2.5rem] text-ghost mb-2 scroll-fade-up">What it measures</h2>
          <p className="font-sora font-normal text-ghost/50 mb-16 scroll-fade-up">Three dimensions. One benchmark run.</p>
          <div className="scroll-fade-up">
            <FeatureCards />
          </div>
        </div>
      </section>

      {/* --- PROTOCOL SECTION (Sticky Stacking — Desktop Only) --- */}
      <section className="relative w-full">
        {/* Panel 1 */}
        <div className="protocol-panel md:sticky top-0 min-h-screen md:h-screen w-full bg-[#0D0D16] flex items-center px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/10 will-change-transform">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-16 md:py-0">
            <div className="flex flex-col gap-6">
              <div className="font-fira text-plasma">01</div>
              <h2 className="font-sora font-bold text-[2rem] md:text-[2.5rem] text-ghost leading-tight">Configure Your Agent</h2>
              <p className="font-sora text-base md:text-lg text-ghost/70 leading-relaxed max-w-lg">
                Point ClinicalAgent-Bench at any LLM endpoint. Supports GPT-4o, Claude 3.5, Llama 3.3, Mistral-Medical, and any OpenAI-compatible API via LiteLLM.
              </p>
            </div>
            <div className="hidden md:flex justify-end opacity-60">
              <svg className="w-80 h-80 animate-[spin_8s_linear_infinite]" viewBox="0 0 200 200">
                <path d="M20,100 Q60,20 100,100 T180,100" fill="none" stroke="#7B61FF" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M20,100 Q60,180 100,100 T180,100" fill="none" stroke="#7B61FF" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="20" cy="100" r="4" fill="#7B61FF" />
                <circle cx="100" cy="100" r="4" fill="#7B61FF" />
                <circle cx="180" cy="100" r="4" fill="#7B61FF" />
              </svg>
            </div>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="protocol-panel md:sticky top-0 min-h-screen md:h-screen w-full bg-[#100F1A] flex items-center px-6 md:px-12 lg:px-24 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)] will-change-transform">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-16 md:py-0">
            <div className="flex flex-col gap-6">
              <div className="font-fira text-plasma">02</div>
              <h2 className="font-sora font-bold text-[2rem] md:text-[2.5rem] text-ghost leading-tight">Run the Suite</h2>
              <p className="font-sora text-base md:text-lg text-ghost/70 leading-relaxed max-w-lg">
                Execute 150+ benchmark tasks with FHIR R4 patient context injected automatically. Full run completes in under 4 minutes. Deterministic — seeded for reproducibility.
              </p>
            </div>
            <div className="hidden md:flex justify-end relative w-80 h-80">
              {/* 8x8 dot grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-4 p-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-plasma/30 m-auto" />
                ))}
              </div>
              {/* Scanning laser line */}
              <style>{`
                @keyframes scanLine {
                  0% { top: 0; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
                .laser-line {
                  animation: scanLine 2s linear infinite;
                }
              `}</style>
              <div className="laser-line absolute left-0 right-0 h-1 bg-plasma shadow-[0_0_15px_#7B61FF] z-10" />
            </div>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="protocol-panel md:sticky top-0 min-h-screen md:h-screen w-full bg-[#0A0A14] flex items-center px-6 md:px-12 lg:px-24 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)] will-change-transform border-b border-white/5">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 py-16 md:py-0">
            <div className="flex flex-col gap-6">
              <div className="font-fira text-plasma">03</div>
              <h2 className="font-sora font-bold text-[2rem] md:text-[2.5rem] text-ghost leading-tight">Ship With Confidence</h2>
              <p className="font-sora text-base md:text-lg text-ghost/70 leading-relaxed max-w-lg">
                Receive your 5-axis CAB-Score and auto-generated EU AI Act Article 13 report. GitHub Actions badge updates on every PR. One command: <code className="font-fira text-plasma bg-plasma/10 px-2 py-1 rounded">cabench run</code>.
              </p>
            </div>
            <div className="hidden md:flex justify-end">
              <svg className="w-80 h-40" viewBox="0 0 400 100">
                {/* Flat background line */}
                <path d="M0,50 L400,50" stroke="#7B61FF" strokeWidth="2" strokeOpacity="0.3" />
                {/* Animated EKG stroke */}
                <path 
                  className="ekg-path"
                  d="M0,50 L150,50 L160,20 L180,90 L190,50 L400,50" 
                  fill="none" 
                  stroke="#7B61FF" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="relative w-full py-40 px-6 bg-[#0A0A14] flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(123,97,255,0.2)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6 scroll-fade-up">
          <h2 className="font-sora font-bold text-[2.5rem] md:text-[3rem] text-ghost leading-tight">
            Ready to benchmark your clinical AI?
          </h2>
          <p className="font-sora font-normal text-[1.25rem] text-ghost/60 mb-8">
            Join the engineers building safer healthcare AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={() => handleCopy(setBottomCopied)}
              className="relative group bg-transparent border border-plasma text-plasma font-fira rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-3 hover:bg-plasma/10 transition-colors text-sm md:text-base"
            >
              pip install clinicalagent-bench
              {bottomCopied ? <Check size={18} /> : <Copy size={18} />}
              
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-graphite border border-white/10 text-white text-xs px-3 py-1.5 rounded font-sora transition-all duration-300 shadow-lg ${bottomCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                Copied!
              </div>
            </button>
            <a 
              href="https://github.com/vilsee/clinicalagent-bench" 
              target="_blank" 
              rel="noreferrer"
              className="bg-plasma text-white font-sora font-semibold rounded-full px-6 md:px-8 py-3 md:py-4 flex items-center justify-center gap-2 hover:bg-plasma/90 transition-colors"
            >
              <Github size={20} /> View on GitHub
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 font-fira text-[13px] text-ghost/40">
            <div className="flex items-center gap-2">⭐ MIT Licensed</div>
            <div className="flex items-center gap-2">🔒 HIPAA-aware</div>
            <div className="flex items-center gap-2">🇪🇺 EU AI Act Aligned</div>
          </div>
        </div>
      </section>

    </div>
  );
}
