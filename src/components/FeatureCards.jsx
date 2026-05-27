import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <DiagnosticShuffler />
      <TelemetryTypewriter />
      <CursorScheduler />
    </div>
  );
}

function DiagnosticShuffler() {
  const [items, setItems] = useState([
    { id: 1, text: "Triage Accuracy: 94.2%" },
    { id: 2, text: "Drug Safety: 91.8%" },
    { id: 3, text: "ICD Coding: 88.7%" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const last = newItems.pop();
        newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0D0D16] border border-white/10 rounded-[2rem] p-8 h-auto min-h-[20rem] md:h-80 flex flex-col relative overflow-hidden group hover:border-plasma/30 transition-colors">
      <h3 className="font-sora font-bold text-[20px] text-white mb-2">Clinical Accuracy</h3>
      <p className="font-sora text-sm text-ghost/70 leading-relaxed mb-6">
        Gold-standard reference scoring using BERTScore + GPT-4o judge rubric
      </p>
      
      <div className="relative flex-1 mt-4">
        {items.map((item, index) => {
          let y = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 30 - index * 10;
          
          if (index === 1) {
            y = 40;
            scale = 0.95;
            opacity = 0.5;
          } else if (index === 2) {
            y = 70;
            scale = 0.9;
            opacity = 0.25;
          }

          return (
            <div 
              key={item.id}
              className="absolute left-0 right-0 mx-auto w-full max-w-[240px] bg-plasma/15 border border-plasma/30 rounded-xl px-4 py-3 flex items-center justify-center font-fira text-[13px] text-plasma backdrop-blur-md"
              style={{
                transform: `translateY(${y}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transition: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TelemetryTypewriter() {
  const messages = [
    "> Checking drug interaction: Warfarin + Aspirin...",
    "> ⚠ Interaction detected. Severity: MODERATE",
    "> Dosage validation: Metformin 500mg ✓",
    "> Hallucination scan: 0 fabricated citations",
    "> Safety Score: 91.2 / 100",
    "> Adversarial resistance: PASSED (48/48)"
  ];
  
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let currentMsgIndex = 0;
    let currentCharIndex = 0;
    let isPaused = false;
    let timeout;

    const typeChar = () => {
      if (isPaused) return;

      const currentMsg = messages[currentMsgIndex];
      
      if (currentCharIndex < currentMsg.length) {
        setDisplayText(prev => {
          const lines = prev.split('\n');
          if (lines.length > currentMsgIndex) {
            lines[currentMsgIndex] = currentMsg.substring(0, currentCharIndex + 1);
            return lines.join('\n');
          } else {
            return prev + (prev ? '\n' : '') + currentMsg.substring(0, currentCharIndex + 1);
          }
        });
        currentCharIndex++;
        timeout = setTimeout(typeChar, 60);
      } else {
        isPaused = true;
        timeout = setTimeout(() => {
          isPaused = false;
          currentMsgIndex++;
          currentCharIndex = 0;
          if (currentMsgIndex >= messages.length) {
            // Reset
            setDisplayText("");
            currentMsgIndex = 0;
          }
          typeChar();
        }, 2000);
      }
    };

    timeout = setTimeout(typeChar, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#0D0D16] border border-white/10 rounded-[2rem] p-8 h-auto min-h-[20rem] md:h-80 flex flex-col relative overflow-hidden group hover:border-plasma/30 transition-colors">
      <h3 className="font-sora font-bold text-[20px] text-white mb-2">Safety Scoring</h3>
      <p className="font-sora text-sm text-ghost/70 leading-relaxed mb-6">
        RxNorm drug validator + dosage rule engine + hallucination detector
      </p>
      
      <div className="bg-black/50 rounded-xl p-4 flex-1 overflow-hidden relative flex flex-col border border-white/5 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-plasma animate-pulse" />
          <span className="font-fira text-[10px] text-plasma tracking-wider">LIVE FEED</span>
        </div>
        <div className="font-fira text-[11px] sm:text-[12px] text-plasma whitespace-pre-wrap leading-relaxed overflow-hidden">
          {displayText}
          <span className="inline-block w-1.5 h-3 bg-plasma ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CursorScheduler() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);
  const wedRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      
      // Reset state
      tl.set(wedRef.current, { backgroundColor: 'rgba(255, 255, 255, 0.05)' })
        .set(btnRef.current, { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' })
        .set(cursorRef.current, { x: -50, y: 50, opacity: 0 })
        .set(rippleRef.current, { scale: 0, opacity: 0 });

      // Enter from left to hover Wed
      tl.to(cursorRef.current, { x: 90, y: 30, opacity: 1, duration: 1, ease: 'power2.out' })
        // Click Wed
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(rippleRef.current, { scale: 2, opacity: 0.5, duration: 0.2 }, "<")
        .to(wedRef.current, { backgroundColor: '#7B61FF', duration: 0.2 }, "<")
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(rippleRef.current, { opacity: 0, duration: 0.2 }, "<")
        // Move to Export button
        .to(cursorRef.current, { x: 140, y: 90, duration: 0.8, ease: 'power2.inOut', delay: 0.2 })
        // Click Export
        .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
        .to(btnRef.current, { scale: 0.95, backgroundColor: 'rgba(123, 97, 255, 0.4)', duration: 0.1 }, "<")
        .to(cursorRef.current, { scale: 1, duration: 0.1 })
        .to(btnRef.current, { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: 0.1 }, "<")
        // Fade out
        .to(cursorRef.current, { opacity: 0, duration: 0.3, delay: 0.2 })
        .to({}, { duration: 2 }); // pause 2s

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div ref={containerRef} className="bg-[#0D0D16] border border-white/10 rounded-[2rem] p-8 h-auto min-h-[20rem] md:h-80 flex flex-col relative overflow-hidden group hover:border-plasma/30 transition-colors">
      <h3 className="font-sora font-bold text-[20px] text-white mb-2">EU AI Act Reports</h3>
      <p className="font-sora text-sm text-ghost/70 leading-relaxed mb-6">
        Article 13 conformity assessment generated automatically from every run
      </p>
      
      <div className="flex-1 flex flex-col items-center justify-center relative mt-2">
        <div className="flex gap-2 mb-6 relative">
          {days.map((day, i) => (
            <div 
              key={i} 
              ref={i === 3 ? wedRef : null}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-fira text-[12px] text-white transition-colors"
            >
              {day}
            </div>
          ))}
        </div>

        <button 
          ref={btnRef}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 font-fira text-xs text-white transition-colors relative z-10"
        >
          Export PDF
        </button>

        {/* Animated Cursor */}
        <div ref={cursorRef} className="absolute left-0 top-0 w-3 h-3 rounded-full bg-plasma z-20 pointer-events-none" style={{ transform: 'translate(-50px, 50px)' }}>
          <div ref={rippleRef} className="absolute inset-0 rounded-full bg-plasma opacity-0" style={{ transform: 'scale(0)' }} />
          {/* Pointer tail for visual */}
          <svg className="absolute top-1 left-1 w-4 h-4 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}
