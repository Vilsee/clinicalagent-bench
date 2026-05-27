import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      footerRef.current.querySelectorAll('.footer-animate'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-[#0D0D16] rounded-t-[4rem] mt-32 pt-16 pb-10 px-8 text-ghost">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1 */}
          <div className="footer-animate flex flex-col gap-4">
            <div className="flex items-center gap-2 font-fira font-bold text-2xl">
              <span className="w-3 h-3 rounded-full bg-plasma" />
              CAB
            </div>
            <p className="font-sora text-ghost/70 text-sm max-w-xs leading-relaxed">
              The open standard for clinical AI evaluation.
            </p>
            <div className="mt-2 font-fira text-[12px] text-plasma">
              MIT Licensed &middot; github.com/vilsee
            </div>
          </div>

          {/* Column 2 */}
          <div className="footer-animate grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-sora font-semibold text-white mb-2">Product</h4>
              <Link to="/demo" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">Benchmark</Link>
              <Link to="/leaderboard" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">Leaderboard</Link>
              <Link to="/docs" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">Docs</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-sora font-semibold text-white mb-2">Community</h4>
              <a href="https://github.com/vilsee/clinicalagent-bench" target="_blank" rel="noreferrer" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">GitHub</a>
              <a href="#" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">Discord</a>
              <a href="#" className="font-sora text-sm text-ghost/60 hover:text-plasma transition-colors">Twitter</a>
            </div>
          </div>

          {/* Column 3: System Status Block */}
          <div className="footer-animate bg-[#14141d] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col">
            <div className="flex items-center gap-2 mb-6 font-fira text-[13px] font-medium tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
              SYSTEM OPERATIONAL
            </div>
            
            <div className="flex flex-col gap-3 font-fira text-[11px] text-ghost/60">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>BENCHMARK ENGINE</span>
                <span className="text-ghost/40">v1.0.0</span>
                <span className="text-[#22c55e]">✓ LIVE</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>FHIR SCENARIO GEN</span>
                <span className="text-ghost/40">v1.0.0</span>
                <span className="text-[#22c55e]">✓ LIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>EU AI ACT REPORTER</span>
                <span className="text-ghost/40">v1.0.0</span>
                <span className="text-[#22c55e]">✓ LIVE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-animate border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-sora text-xs text-ghost/40">
            &copy; 2026 Vilsee Kumar Shandilya &middot; Built for the International AI Agents Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
