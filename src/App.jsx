import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import Demo from './pages/Demo';
import Leaderboard from './pages/Leaderboard';
import Docs from './pages/Docs';

gsap.registerPlugin(ScrollTrigger);

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress((scrollTop / docHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[60] bg-plasma/20">
      <div
        className="h-full bg-plasma transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function RouteTransition() {
  const location = useLocation();
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(nodeRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Debounced ScrollTrigger refresh on resize
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main ref={nodeRef} className="flex-grow flex flex-col pt-20">
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ScrollProgressBar />
        <Navbar />
        <RouteTransition />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
