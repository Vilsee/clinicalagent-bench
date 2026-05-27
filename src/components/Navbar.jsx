import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';

const navLinks = [
  { to: '/demo', label: 'Benchmark' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/docs', label: 'Docs' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sentinelRef = useRef(null);
  const btnRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Magnetic hover effect
  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    btnRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = `translate(0px, 0px) scale(1)`;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sentinel div for IntersectionObserver */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-[80px] pointer-events-none z-[-1]" />

      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl rounded-full px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isScrolled
            ? 'bg-[#0A0A14]/70 backdrop-blur-xl border border-white/10 shadow-lg'
            : 'bg-transparent text-ghost border-transparent'
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-fira font-bold text-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-plasma animate-pulse" />
            CAB
          </Link>
          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />
          <div className="font-sora font-medium text-[14px] hidden sm:block">
            ClinicalAgent-Bench
          </div>
        </div>

        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 font-sora text-[14px] text-ghost">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex flex-col items-center transition-colors ${
                isActive(link.to) ? 'text-plasma' : 'hover:text-plasma'
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute -bottom-2.5 w-1.5 h-1.5 rounded-full bg-plasma" />
              )}
            </Link>
          ))}
          <a
            href="https://github.com/vilsee/clinicalagent-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-plasma transition-colors"
          >
            GitHub <ExternalLink size={14} />
          </a>
        </div>

        {/* Right: CTA & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            to="/demo"
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hidden md:flex relative overflow-hidden bg-plasma text-white rounded-full px-5 py-2 font-sora font-medium text-[14px] transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] items-center group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="relative z-10 flex items-center gap-1">Run Benchmark &rarr;</span>
            <span className="absolute inset-0 bg-[#8f79ff] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0 rounded-full" />
          </Link>

          <button
            className="md:hidden text-ghost focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-deep-void/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileMenuOpen(false)}
            className={`font-sora text-2xl transition-colors ${
              isActive(link.to) ? 'text-plasma' : 'hover:text-plasma'
            }`}
          >
            {link.label}
            {isActive(link.to) && (
              <span className="ml-2 text-plasma">●</span>
            )}
          </Link>
        ))}
        <a
          href="https://github.com/vilsee/clinicalagent-bench"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sora text-2xl flex items-center gap-2 hover:text-plasma transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          GitHub <ExternalLink size={20} />
        </a>
        <Link
          to="/demo"
          onClick={() => setMobileMenuOpen(false)}
          className="mt-4 bg-plasma text-white rounded-full px-8 py-3 font-sora font-bold text-lg hover:bg-plasma/80 transition-colors"
        >
          Run Benchmark &rarr;
        </Link>
      </div>
    </>
  );
}
