import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('HERO');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [utcTime, setUtcTime] = useState('00:00:00');
  
  // Tactical telemetry inputs
  const [throttle, setThrottle] = useState(2); // Starts at idle 2%
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'MACHINE', id: 'HERO', path: '#section-hero', isScroll: true },
    { name: 'STORIES', id: 'ETHOS', path: '#section-ethos', isScroll: true },
    { name: 'PARTS', id: 'MACHINE', path: '#section-machine', isScroll: true },
    { name: 'SPECS', id: 'SPECS', path: '#section-specs', isScroll: true },
    { name: 'CRAFT', id: 'CRAFT', path: '/about', isScroll: false }
  ];

  // Dynamic Telemetry, Clock, and Mouse Tilt Event Listeners
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().split('T')[1].slice(0, 8);
      setUtcTime(timeStr);
    }, 1000);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate system from -1.0 to 1.0 (with dampening)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = height > 0 ? (winScroll / height) : 0;
      setScrollProgress(Math.round(scrolled * 100));

      // Calculate scroll speed for dynamic THROTTLE throttle percent
      const curY = winScroll;
      const curTime = Date.now();
      const diffY = Math.abs(curY - lastScrollY.current);
      const diffTime = Math.max(1, curTime - lastScrollTime.current);
      
      const scrollSpeed = diffY / diffTime; // pixels per ms
      const calculatedThrottle = Math.min(100, Math.floor(scrollSpeed * 32)); // convert speed to throttle percentage
      
      if (calculatedThrottle > 2) {
        setThrottle((prev) => Math.max(prev, calculatedThrottle));
      }

      lastScrollY.current = curY;
      lastScrollTime.current = curTime;

      // Simple Section Tracker
      if (location.pathname === '/') {
        const sections = ['section-hero', 'section-ethos', 'section-machine', 'section-specs'];
        let current = 'HERO';
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 300 && rect.bottom >= 300) {
              if (sectionId === 'section-hero') current = 'HERO';
              if (sectionId === 'section-ethos') current = 'STORIES';
              if (sectionId === 'section-machine') current = 'PARTS';
              if (sectionId === 'section-specs') current = 'SPECS';
              break;
            }
          }
        }
        setActiveSection(current);
      } else {
        setActiveSection('CRAFT');
      }
    };

    // Smooth Throttle Decay back to idle 2%
    const decayInterval = setInterval(() => {
      setThrottle((prev) => {
        if (prev <= 2) return 2;
        return Math.floor(prev * 0.82); // exponential damping
      });
    }, 70);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();
    
    return () => {
      clearInterval(timer);
      clearInterval(decayInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [location.pathname]);

  // Derived Performance Metrics mathematically synchronized with page layout & scrubbing progress
  const r = scrollProgress / 100;
  
  // 1. Dynamic Speed curve matching the scrubbing movement of background motorcycle video
  let speedValue = 0;
  if (r > 0) {
    if (r <= 0.22) {
      speedValue = Math.floor((r / 0.22) * 52); // Accelerate from 0 -> 52 MPH
    } else if (r <= 0.50) {
      const t = (r - 0.22) / 0.28;
      speedValue = Math.floor(52 + t * 18 + (throttle * 0.08)); // Cruise section at 52 -> 70 MPH
    } else if (r <= 0.78) {
      const t = (r - 0.50) / 0.28;
      speedValue = Math.floor(Math.max(0, 70 - t * 70)); // Slow down and halt at Machine section (0 MPH)
    } else {
      speedValue = 0; // Dyno Static specs testing stage
    }
  }

  // 2. Dynamic motorcycle transmission Gear indicator
  let gearValue = 'N';
  if (r > 0) {
    if (r < 0.04) gearValue = '1';
    else if (r < 0.12) gearValue = '2';
    else if (r < 0.22) gearValue = '3';
    else if (r < 0.50) gearValue = '4'; // Top cruising gear
    else if (r < 0.65) gearValue = '3';
    else if (r < 0.78) gearValue = '2';
    else gearValue = 'N'; // Dyno Neutral
  }

  // 3. Lean Angle responding dynamically to client horizontal mouse hover
  const leanAngleValue = Math.round(mousePos.x * 24); // max -24 to +24 deg lean
  
  const handleNav = (name: string, path: string, isScroll: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (isScroll) {
      if (location.pathname === '/') {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(path, { duration: 1.5 });
        } else {
          document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/', { state: { scrollTo: path } });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* High-Performance Tactical HUD Navbar */}
      <nav id="main-navbar" className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-6 sm:px-12 bg-transparent backdrop-blur-sm pointer-events-auto transition-all duration-300 h-[50px]">
        
        {/* Left Wing Cockpit: Dynamic speed & Gear box telemetry */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="relative px-3 sm:px-4 bg-black/55 backdrop-blur-md border border-white/10 rounded flex flex-col items-start justify-center leading-[1.0] select-none hover:border-[#E11D2A]/30 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.6)] h-[40px]"
          >
            {/* Red LED focus status */}
            <span className="absolute top-0 left-0 w-2 h-[1px] bg-[#E11D2A]"></span>
            <span className="absolute top-0 left-0 w-[1px] h-2 bg-[#E11D2A]"></span>
            
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-white tracking-[0.14em] text-lg sm:text-xl font-black">KRGT-1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A] animate-pulse shadow-[0_0_6px_#E11D2A]"></span>
            </div>
          </Link>

          {/* SENSOR READING widget 1: Speedometer & Gear Box */}
          <div className="hidden sm:flex items-center gap-3 border border-white/5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col">
              <span className="font-mono text-[6.5px] text-gray-500 tracking-wider">SPEED_MPH</span>
              <span className="font-anton text-[16px] text-white tracking-widest leading-none mt-0.5">
                {String(speedValue).padStart(3, '0')}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-[6.5px] text-gray-500 tracking-wider">GEAR</span>
              <span className={`font-anton text-[16px] leading-none mt-0.5 px-1.5 rounded text-center ${
                gearValue === 'N' ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30' : 'text-[#E11D2A] bg-red-950/20'
              }`}>
                {gearValue}
              </span>
            </div>
          </div>
        </div>

        {/* Center Floating Dock: Tactical Grid Navigation */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center bg-black/60 backdrop-blur-md border border-white/10 rounded px-5 py-2 shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
          {/* Active section context tracker */}
          <div className="font-mono text-[8px] font-extrabold tracking-[0.15em] text-[#E11D2A] border-r border-white/10 pr-4 mr-4 flex flex-col items-start">
            <span className="text-gray-500 font-sans text-[7px] tracking-wider mb-0.5">SYS_FOCUS</span>
            <span className="bg-red-950/40 px-1.5 py-0.5 border border-red-900/40 uppercase font-anton text-[#E11D2A] leading-none">
              {activeSection}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => handleNav(item.name, item.path, item.isScroll, e)}
                  className={`relative px-4 py-1.5 text-[9px] tracking-[0.28em] uppercase font-bold transition-all select-none group flex items-center ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className={`absolute left-0 w-1 h-full border-l transition-all ${
                    isActive ? 'border-[#E11D2A]' : 'border-transparent group-hover:border-white/30'
                  }`}></span>
                  <span className="relative z-10 px-0.5">{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Dynamic Scroll Ticker Meter */}
          <div className="font-mono text-[8px] font-extrabold tracking-[0.15em] text-white/90 border-l border-white/10 pl-4 ml-4 flex flex-col items-start">
            <span className="text-gray-500 font-sans text-[7px] tracking-wider mb-0.5">MILEAGE_PCT</span>
            <span className="text-gray-300 font-mono font-bold leading-none mt-0.5">
              {String(scrollProgress).padStart(3, '0')}%
            </span>
          </div>
        </div>

        {/* Right Wing Cockpit: Lean Angle and Dynamic Intaking THROTTLE gauge */}
        <div className="flex items-center gap-2.5">
          
          {/* SENSOR READING widget 2: Lean angle based on mouse posture */}
          <div className="hidden sm:flex items-center gap-3 border border-white/5 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col text-right">
              <span className="font-mono text-[6.5px] text-gray-500 tracking-wider">LEAN_POSTURE</span>
              <span className="font-anton text-[16px] text-white leading-none mt-0.5 flex items-center gap-1 justify-end">
                {Math.abs(leanAngleValue)}° 
                <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                  {leanAngleValue < 0 ? 'L' : leanAngleValue > 0 ? 'R' : 'C'}
                </span>
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/10"></div>
            
            {/* Real-time intaking throttle indicator (Animates size on wheel scrolling) */}
            <div className="flex flex-col text-left">
              <span className="font-mono text-[6.5px] text-gray-500 tracking-wider">THROTTLE_OPEN</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-anton text-[16px] text-[#E11D2A] leading-none tracking-tight">
                  {throttle}%
                </span>
                
                {/* Micro visual meter */}
                <span className="w-12 h-1 bg-white/10 rounded-full relative overflow-hidden block">
                  <span 
                    className="absolute top-0 left-0 h-full bg-[#E11D2A] transition-all duration-75 shadow-[0_0_8px_#E11D2A]"
                    style={{ width: `${throttle}%` }}
                  />
                </span>
              </div>
            </div>
          </div>

          <button 
            id="hud-arm-configure"
            onClick={() => window.dispatchEvent(new CustomEvent('open-configurator'))}
            className="hidden md:flex relative items-center justify-center gap-2 bg-black/60 hover:bg-[#E11D2A] border border-white/10 hover:border-[#E11D2A]/60 px-5 py-2.5 rounded shadow-[0_10px_35px_rgba(0,0,0,0.6)] cursor-pointer group select-none transition-all duration-300 pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-[#E11D2A] group-hover:bg-white animate-pulse shadow-[0_0_8px_#E11D2A] group-hover:shadow-[0_0_8px_#fff] transition-all duration-300"></span>
            
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white leading-none">
              CONFIGURE KRGT-1
            </span>
          </button>

          {/* Hamburger menu for Mobile */}
          <button 
            onClick={() => {
              // Lightweight toggle (this drawer matches mobile layouts)
              const toggleEl = document.getElementById('mobile-drawer');
              if (toggleEl) toggleEl.classList.toggle('hidden');
            }}
            className="flex md:hidden relative items-center justify-center bg-black/55 p-3 rounded border border-white/10 hover:border-white/20 transition-all cursor-pointer pointer-events-auto shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col gap-[5px] items-end w-5">
              <span className="h-[1.5px] bg-white rounded w-5"></span>
              <span className="h-[1.5px] bg-white rounded w-3"></span>
              <span className="h-[1.5px] bg-white rounded w-4"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Futuristic Drawer Panel Overlay on Mobile Selection (Hidden by default, toggled via simple style hook) */}
      <div id="mobile-drawer" className="hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl px-6 pt-24 pb-12 flex flex-col justify-between md:hidden pointer-events-auto border-b border-white/10">
        <div className="absolute top-20 left-6 right-6 flex justify-between font-mono text-[8.5px] text-gray-400">
          <span>[ HUD MATRIX DIRECT ]</span>
          <span>SPEED: {speedValue} MPH</span>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => {
                  document.getElementById('mobile-drawer')?.classList.add('hidden');
                  handleNav(item.name, item.path, item.isScroll, e);
                }}
                className={`text-white text-lg font-bold tracking-[0.2em] py-4 border-b border-white/5 text-left flex items-center justify-between ${
                  isActive ? 'text-[#E11D2A]' : 'text-gray-200'
                }`}
              >
                <span>{item.name}</span>
                <span className="font-mono text-[9px] text-[#E11D2A] opacity-80">
                  {isActive ? '[ ACTIVE ]' : ''}
                </span>
              </a>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              document.getElementById('mobile-drawer')?.classList.add('hidden');
              window.dispatchEvent(new CustomEvent('open-configurator'));
            }}
            className="bg-[#E11D2A] text-white text-xs font-black uppercase tracking-[0.25em] py-4 rounded shadow-[0_8px_25px_rgba(225,29,42,0.4)] flex items-center justify-center gap-2"
          >
            CONFIGURE VEHICLE
          </button>
          <div className="text-center font-mono text-[7px] text-gray-500 tracking-[0.1em] uppercase">
            KRGT-1 BIKE COCKPIT
          </div>
        </div>
      </div>
    </>
  );
}
