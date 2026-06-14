import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// High-precision layout framing overlay
const EdgeChrome = () => (
  <>
    <div className="edge-frame"></div>
    {/* Top left crosshair */}
    <div className="crosshair left-[14px] top-[14px]" id="ch-tl"></div>
    {/* Top right crosshair */}
    <div className="crosshair right-[30px] top-[14px]" id="ch-tr"></div>
    {/* Bottom left crosshair */}
    <div className="crosshair left-[14px] bottom-[30px]" id="ch-bl"></div>
    {/* Bottom right crosshair */}
    <div className="crosshair right-[30px] bottom-[30px]" id="ch-br"></div>
  </>
);

// High-performance animated Spec item
const Stat = ({ end, suffix, label, accent = '#E11D2A', delay = 0, align = 'left', size = 80, num = '01' }: {
  end: number;
  suffix: string;
  label: string;
  accent?: string;
  delay?: number;
  align?: 'left' | 'right';
  size?: number;
  num?: string;
}) => {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTriggered(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress * (2 - progress);
      setValue(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [triggered, end]);

  return (
    <div 
      ref={ref} 
      className={`rise flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
      style={{ animationDelay: `${delay}s` }}
      id={`stat-${num}`}
    >
      <h6 className="font-mono text-nano tracking-[0.36em] text-gray-500 mb-2 sm:mb-3 font-bold flex items-center gap-2">
        <span style={{ color: accent }}>—</span>
        <span className="text-gray-600">{num}</span>
        <span>{label.toUpperCase()}</span>
      </h6>

      <h4 className="font-anton flex items-baseline text-white" style={{ fontSize: `${size}px`, lineHeight: 0.85, margin: 0 }}>
        {value}
        <span className="font-mono text-body font-bold text-red-650 ml-2 uppercase tracking-wide" style={{ color: accent }}>
          {suffix}
        </span>
      </h4>

      <div className="bar mt-3 h-[1px] bg-red-600" style={{ width: '48px', backgroundColor: accent, transformOrigin: align === 'right' ? 'right' : 'left' }}></div>
    </div>
  );
};
// High-fidelity heads-up-display (HUD) specs indicator styled like an RPM mechanical gauge
const HUDStat = ({ end, suffix, label, accent = '#E11D2A', delay = 0, num = '01', max = 100, subtext = 'SYS NOMINAL', align = 'left' }: {
  end: number;
  suffix: string;
  label: string;
  accent?: string;
  delay?: number;
  num?: string;
  max: number;
  subtext?: string;
  align?: 'left' | 'right';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTriggered(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    let timeoutId: number;

    const startAnimation = () => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = progress * (2 - progress); // Ease out
        setValue(Math.floor(ease * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    if (delay > 0) {
      timeoutId = window.setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [triggered, end, delay]);

  const progressRatio = Math.min(value, max) / max;

  // Polar to Cartesian coordinate helper for drawing clean gauges (symmetrical 240 degrees sweep)
  const getTickCoords = (percent: number, radius: number) => {
    const startAngle = (7 * Math.PI) / 6; // 210 degrees
    const endAngle = -Math.PI / 6;       // -30 degrees
    const angle = startAngle - percent * (startAngle - endAngle);
    const x = 170 + radius * Math.cos(angle);
    const y = 150 - radius * Math.sin(angle);
    return { x, y };
  };

  // Compile individual digital LED segments (precise high-tech tachometer layout)
  const ticks = [];
  const totalTickCount = 31;
  for (let i = 0; i < totalTickCount; i++) {
    const tRatio = i / (totalTickCount - 1);
    const isActive = tRatio <= progressRatio;
    
    // Distinct heights for major and minor bar notches
    const rInner = i % 5 === 0 ? 98 : 105;
    const rOuter = i % 5 === 0 ? 120 : 116;
    
    const { x: xStart, y: yStart } = getTickCoords(tRatio, rInner);
    const { x: xEnd, y: yEnd } = getTickCoords(tRatio, rOuter);
    
    // Vibrant colors near redline limits (top 15%)
    const isRedline = tRatio > 0.85;
    const strokeColor = isActive
      ? (isRedline ? '#ffffff' : accent)
      : 'rgba(255, 255, 255, 0.05)';
    
    const strokeWidth = i % 5 === 0 ? 2.5 : 1.25;

    ticks.push(
      <line 
        key={`tick-${i}`}
        x1={xStart}
        y1={yStart}
        x2={xEnd}
        y2={yEnd}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={isActive ? 1 : 0.4}
        className="transition-all duration-300"
        style={isActive ? { filter: `drop-shadow(0 0 2px rgba(255,255,255,0.3))` } : {}}
      />
    );
  }

  // Micro scale numerical readouts
  const scaleNumbers = [];
  for (let i = 0; i < totalTickCount; i += 5) {
    const tRatio = i / (totalTickCount - 1);
    const val = Math.round(tRatio * max);
    const { x, y } = getTickCoords(tRatio, 82);
    const isActive = tRatio <= progressRatio;

    scaleNumbers.push(
      <text 
        key={`lbl-${i}`}
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fill={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.25)'}
        fontSize="9"
        fontWeight="bold"
        className="font-mono tracking-tighter transition-all duration-300"
      >
        {val}
      </text>
    );
  }

  // Interactive warning labels based on levels
  const statusLabel = progressRatio > 0.85 
    ? 'REDLINE // CRITICAL' 
    : progressRatio > 0.5 
      ? 'OPTIMAL POWER' 
      : 'STABLE RUNNING';

  const isDialOne = num === '01';
  const displayNumColor = 'text-white drop-shadow-none';

  return (
    <div 
      ref={ref}
      className="relative flex flex-col items-center justify-center select-none pointer-events-auto transition-all duration-300 hover:scale-[1.05]"
      id={`hud-stat-${num}`}
      style={{
        width: '680px',
        height: '560px',
      }}
    >
      {/* Speedometer Gauges System */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 340 280" 
        fill="none"
      >
        {/* Double circular framing ring segment segments */}
        <path 
          d="M 74.74,205 A 110,110 0 1,1 265.26,205" 
          stroke="rgba(255,255,255,0.04)" 
          strokeWidth="1.5"
          strokeDasharray="4 8"
          fill="none"
        />
        <path 
          d="M 61.8,212.5 A 125,125 0 1,1 278.2,212.5" 
          stroke="rgba(255,255,255,0.03)" 
          strokeWidth="1"
          fill="none"
        />

        {/* Active Laser accent arc track */}
        <path 
          d="M 74.74,205 A 110,110 0 1,1 265.26,205" 
          stroke={accent} 
          strokeWidth="1"
          opacity="0.15"
          fill="none"
        />

        {/* Render Generated Ticks */}
        {ticks}

        {/* Render Scale Numbers */}
        {scaleNumbers}
      </svg>

      {/* Cyber ambient core glowing halo */}
      <div 
        className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none transition-all duration-300" 
        style={{
          width: '300px',
          height: '300px',
          backgroundColor: progressRatio > 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)'
        }}
      />

      {/* TOP META-BADGE with clean tech border */}
      <div className="absolute top-[84px] px-2.5 py-0.5 rounded bg-black/60 border border-white/5 flex items-center select-none pointer-events-none z-10 text-[9px] font-mono font-bold">
        <span className="text-gray-500 mr-1.5 uppercase">SYS_MTR_</span>
        <span style={{ color: accent }} className="animate-pulse">[ {num} ]</span>
      </div>

      {/* CENTRAL READOUT PANEL */}
      <div 
        className="absolute left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center"
        style={{
          top: '150px',
          height: '260px'
        }}
      >
        <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-[0.25em] mb-2">
          {label}
        </span>

        {/* Giant Speed Output Readout value */}
        <div className="flex items-baseline justify-center select-none pointer-events-auto">
          <span 
            className={`font-industrial text-[120px] leading-none font-black ${displayNumColor}`}
            style={{
              fontFamily: '"Anton", sans-serif',
              letterSpacing: '1px'
            }}
          >
            {value}
          </span>
          <span className="font-mono text-[16px] font-black text-gray-400 tracking-widest uppercase ml-2 pb-2" style={{ color: progressRatio > 0 ? accent : 'rgba(255,255,255,0.3)' }}>
            {suffix}
          </span>
        </div>

        {/* Digital warning / system message bar */}
        <div className="mt-5 px-3 py-1.5 rounded bg-black/60 border border-white/5 flex items-center gap-1.5 opacity-90 select-none">
          <span className={`w-2 h-2 rounded-full ${progressRatio > 0.85 ? 'bg-red-500 animate-ping' : progressRatio > 0 ? 'bg-[#E11D2A]' : 'bg-gray-600'}`} />
          <span className="font-mono text-[9px] text-gray-400 uppercase tracking-[0.2em]">
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const accent = '#E11D2A';
  const location = useLocation();
  const ethosRef = useRef<HTMLDivElement>(null);
  const topBlockRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const heroExtrasRef = useRef<HTMLDivElement>(null);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  
  const isSmallMobile = windowWidth < 640;
  // Calculate scale to fit exactly inside window viewport boundaries
  const trueBodyWidth = isMobile ? 720 : 1600;
  const trueBodyHeight = isMobile ? 1200 : 900;
  
  // Safe area padding
  const paddingX = isMobile ? 20 : 80;
  const paddingY = isMobile ? 120 : 160; 

  const widthScale = (windowWidth - paddingX) / trueBodyWidth;
  const heightScale = (windowHeight - paddingY) / trueBodyHeight;
  
  // Enforce tight constraints so it never exceeds viewport on desktop, and scales comfortably on mobile
  const scale = isMobile
    ? Math.min(0.65, Math.max(0.25, widthScale))
    : Math.max(0.1, Math.min(1.0, widthScale, heightScale));

  // HUD Coordinates mapped to true body container or mobile-optimized portrait grid
  // Spaced around the central reticle to match user's handdrawn layout perfectly on mobile
  const x1 = isMobile ? 120 : 20; // Dry Weight (Top Left)
  const y1 = isMobile ? 380 : 570;

  const x2 = isMobile ? 600 : 1500; // Rear Wheel Power (Top Right)
  const y2 = isMobile ? 220 : 320;

  const x3 = isMobile ? 600 : 1650; // Max Torque (Bottom Right)
  const y3 = isMobile ? 980 : 750;

  const x4 = isMobile ? 120 : 720; // IQ Score (Bottom Left)
  const y4 = isMobile ? 980 : 850;

  const ctrlLeftX = (x2 + x1) / 2;
  const ctrlRightX = (x4 + x3) / 2;
  const ctrlLeftY1 = isMobile ? y1 - 40 : y1 + (y2 - y1) * 0.4;
  const ctrlRightY1 = isMobile ? y4 - 40 : y1 + (y3 - y1) * 0.4;
  const ctrlLeftY2 = isMobile ? y2 + 20 : y2 + (y4 - y2) * 0.6;
  const ctrlRightY2 = isMobile ? y3 + 20 : y3 + (y4 - y3) * 0.6;
  const [throttle, setThrottle] = useState(2); // Starts at idle 2%
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = window.scrollY / total;
      setScrollRatio(progress);

      // Track scroll velocity for throttle calculation
      const curY = window.scrollY;
      const curTime = Date.now();
      const diffY = Math.abs(curY - lastScrollY.current);
      const diffTime = Math.max(1, curTime - lastScrollTime.current);
      
      const scrollSpeed = diffY / diffTime; // pixels per ms
      const calculatedThrottle = Math.min(100, Math.floor(scrollSpeed * 32));
      
      if (calculatedThrottle > 2) {
        setThrottle((prev) => Math.max(prev, calculatedThrottle));
      }

      lastScrollY.current = curY;
      lastScrollTime.current = curTime;
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    // Throttle Decay Loop back to idle 2%
    const decayInterval = setInterval(() => {
      setThrottle((prev) => {
        if (prev <= 2) return 2;
        return Math.floor(prev * 0.82);
      });
    }, 70);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    handleScroll();
    handleResize();

    return () => {
      clearInterval(decayInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const target = (location.state as any).scrollTo;
      const timer = setTimeout(() => {
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.5 });
        } else {
          document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    // Hero center text curtain scroll effect
    const ctx = gsap.context(() => {
      if (topBlockRef.current) {
        gsap.to(topBlockRef.current, {
          y: -50,
          opacity: 0,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '#section-hero',
            start: 'top top',
            end: '+=450',
            scrub: true,
          }
        });
      }

      if (heroExtrasRef.current) {
        gsap.to(heroExtrasRef.current, {
          opacity: 0,
          y: 50,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '#section-hero',
            start: 'top top',
            end: '+=450',
            scrub: true,
          }
        });
      }

      // 1px vertical red line that grows on scroll
      gsap.to('#growing-scroll-line', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#section-hero',
          start: 'top top',
          end: '+=450',
          scrub: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ethosRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(ethosRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ethosRef.current,
            start: 'top 85%', // Fade in as soon as it enters viewport
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Calculate real-time riding telemetry based on scroll ratio & velocity throttle
  const speedVal = Math.floor(
    scrollRatio === 0 
      ? 0
      : scrollRatio <= 0.20 
        ? (scrollRatio / 0.20) * 52 
        : scrollRatio <= 0.50 
          ? 52 + ((scrollRatio - 0.20) / 0.30) * 18 + (throttle * 0.08)
          : Math.max(0, 70 - ((scrollRatio - 0.50) / 0.28) * 70)
  );

  const rpmVal = Math.floor(
    scrollRatio === 0 
      ? 1050 + Math.floor(Math.random() * 15)
      : scrollRatio <= 0.50 
        ? 1800 + ((scrollRatio * 15) % 1) * 3200 + (throttle * 12)
        : scrollRatio <= 0.80 
          ? Math.max(1050, 3200 - ((scrollRatio - 0.50) / 0.30) * 2150) + (throttle * 5)
          : 1050 + Math.sin(((scrollRatio - 0.80) / 0.20) * Math.PI) * 4400 + (throttle * 10)
  );

  const gearVal = scrollRatio === 0 ? 'N' : (scrollRatio < 0.04 ? '1' : (scrollRatio < 0.12 ? '2' : (scrollRatio < 0.20 ? '3' : (scrollRatio < 0.50 ? '4' : (scrollRatio < 0.65 ? '3' : (scrollRatio < 0.78 ? '2' : 'N'))))));
  const leanAngle = Math.round(mousePos.x * 24);
  const pitchAngle = Math.round(mousePos.y * -8);
  


  return (
    <div className="relative w-full overflow-x-hidden min-h-screen text-white bg-transparent animate-fade-in">
      
      {/* ============ SECTION 01: HERO — Strictly Polarized Layout ============ */}
      <section className="relative w-full h-screen min-h-screen max-h-screen overflow-hidden pointer-events-auto flex flex-col justify-start py-12 max-sm:py-[4rem]" id="section-hero">
        <EdgeChrome />

        {/* Vertical Center Container for industrial vertically stacked H1 */}
        <div 
          ref={topBlockRef}
          className="absolute top-[120px] left-6 sm:left-[80px] z-20 pointer-events-none select-none max-w-[85vw] w-full mix-blend-difference flex flex-col items-start"
        >
          <h1 
            className="font-industrial text-[46px] sm:text-[70px] md:text-[110px] lg:text-[130px] xl:text-[150px] text-white uppercase text-left m-0 drop-shadow-2xl scale-y-[1.1] origin-left opacity-95"
            style={{ 
              lineHeight: '0.85',
              letterSpacing: '-0.04em',
              willChange: 'transform, opacity',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            }}
          >
            OWN THE <span className="text-[#E11D2A]">STREETS</span>
          </h1>
        </div>

        {/* Bottom 15% Container for Explorer CTA & growing vertical scroll indicator */}
        <div 
          ref={heroExtrasRef} 
          className="absolute bottom-[10%] left-0 w-full px-5 sm:px-10 z-20 pointer-events-none"
        >
          <div className="max-w-[1600px] mx-auto w-full flex flex-row items-end justify-between">
            
            {/* Left aligned high-contrast CTA */}
            <div className="pointer-events-auto">
              <div className="px-6 sm:px-8 py-3.5 sm:py-4"></div>
            </div>

            {/* Right aligned minimal scroll indicator with 1px vertical growing red line */}
            <div className="flex flex-col items-end gap-2.5 sm:gap-3 select-none">
              <h6 className="font-mono text-nano tracking-[0.46em] text-gray-500 font-bold uppercase leading-none">SCROLL</h6>
              <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                <div 
                  id="growing-scroll-line"
                  className="absolute top-0 left-0 w-full h-full bg-[#E11D2A] origin-top scale-y-0"
                  style={{ willChange: 'transform' }}
                ></div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ============ SECTION 02: ETHOS — Editorial ============ */}
      <section className="relative w-full h-screen min-h-screen max-h-screen overflow-hidden pointer-events-auto flex flex-col justify-start max-sm:py-[4rem] sm:pt-24 md:pt-32 bg-transparent animate-fade-in" id="section-ethos">
        <EdgeChrome />

        {/* Elevated content container with premium padding alignment */}
        <div className="z-10 px-6 sm:px-12 md:px-16 lg:px-[80px] max-w-[1600px] w-full flex flex-col lg:flex-row items-start justify-start gap-12 lg:gap-24">
          
          {/* Content — left column with vertical rule */}
          <div ref={ethosRef} className="w-full max-w-[800px] flex gap-6 sm:gap-8 opacity-0">
            
            {/* Vertical accent rule */}
            <div className="bar hidden sm:block w-[1px] min-h-[220px]" style={{
               background: `linear-gradient(to bottom, ${accent} 0%, ${accent} 30%, rgba(240,235,226,0.1) 30%, rgba(240,235,226,0.1) 100%)`
            }}></div>

            <div className="flex-1 text-left">
              {/* Cascade Size Heading (H2 - Reverted to Solid Editorial Style) */}
              <h2 className="font-industrial text-[40px] md:text-[64px] lg:text-[80px] font-black text-white uppercase tracking-tight drop-shadow-lg leading-none m-0 mb-6">
                Ethos<span className="text-[#E11D2A]">.</span>
              </h2>

              <p className="font-sans text-body leading-[1.65] text-[#d8d3ca] font-medium max-w-[380px] mt-6 sm:mt-8 tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
                <span className="font-anton float-left text-h2 sm:text-display leading-[0.86] mr-2 mt-1 sm:mr-3" style={{ color: accent }}>W</span>
                e don't assemble bikes. We machine them from solid blocks of billet aluminum. We create uncompromised, performance-driven American V-Twins.
              </p>

              {/* READ THE FULL STORY button and path elements */}
              <div className="flex items-center gap-3 hover:gap-5 transition-all cursor-pointer group mt-8">
                <h6 className="font-mono text-micro tracking-[0.4em] text-white font-bold uppercase transition-colors group-hover:text-red-500">
                  READ THE FULL STORY
                </h6>
                <div className="w-12 h-[1px] transition-all group-hover:w-16" style={{ background: accent }}></div>
                <span style={{ color: accent }}>⟶</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ============ SECTION 03: THE MACHINE — Editorial Specs ============ */}
      <section className="relative w-full h-screen min-h-screen max-h-screen overflow-hidden flex flex-col pointer-events-auto py-12 max-sm:py-[4rem]" id="section-machine">
        <EdgeChrome />

        {/* Content overlaid perfectly matching reference image positions */}
        
        {/* Top Left Liquid Glass Card */}
        <div className="absolute top-[8%] sm:top-[15%] left-[4%] sm:left-[5%] md:top-[12%] md:left-[8%] lg:top-24 lg:left-12 xl:left-24 z-10 flex flex-col items-start text-left pointer-events-auto">
          <div 
            className="relative overflow-hidden bg-white/[0.02] border border-white/[0.1] p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] flex flex-col gap-3 sm:gap-4 max-w-[280px] sm:max-w-[380px] hover:bg-white/[0.06] transition-all duration-500 cursor-pointer group"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4)' }}
          >
            
            {/* Apple Style Top Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none rounded-[24px] sm:rounded-[32px]"></div>

            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-black/30 border border-white/20 shadow-inner mb-2 group-hover:scale-110 transition-transform duration-500 text-[#E11D2A]">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md">
                 <path d="M30 45 L38 20 L62 20 L70 45 Z" />
                 <path d="M15 80 L25 50 L45 50 L55 80 Z" />
                 <path d="M45 80 L55 50 L75 50 L85 80 Z" />
              </svg>
            </div>
            <h4 className="relative font-industrial text-[28px] sm:text-[40px] text-white uppercase tracking-wide leading-none m-0 shadow-sm">
              CHASSIS<span className="text-[#E11D2A]">.</span>
            </h4>
            <p className="relative font-sans text-sm sm:text-base text-[#e0e0e0] font-medium leading-[1.6]">
              Billet aluminum components designed to serve multiple functions are employed to provide a rigid and more dynamic ride.
            </p>
          </div>
        </div>

        {/* Bottom Right Liquid Glass Card */}
        <div className="absolute bottom-[5%] sm:bottom-[10%] right-[4%] sm:right-[5%] md:bottom-[15%] md:right-[8%] lg:bottom-16 lg:right-12 xl:right-24 z-10 flex flex-col items-start sm:items-end text-left sm:text-right pointer-events-auto">
          <div 
            className="relative overflow-hidden bg-white/[0.02] border border-white/[0.1] p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] flex flex-col items-start sm:items-end gap-3 sm:gap-4 max-w-[280px] sm:max-w-[380px] hover:bg-white/[0.06] transition-all duration-500 cursor-pointer group"
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4)' }}
          >
            
            {/* Apple Style Top Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none rounded-[24px] sm:rounded-[32px]"></div>

            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-black/30 border border-white/20 shadow-inner mb-2 group-hover:scale-110 transition-transform duration-500 text-[#E11D2A]">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md">
                 <circle cx="50" cy="65" r="16" />
                 <path d="M36 50 L18 20 L40 10 L52 48" />
                 <path d="M64 50 L82 20 L60 10 L48 48" />
                 <path d="M10 25 L25 15" strokeWidth="8"/>
                 <path d="M90 25 L75 15" strokeWidth="8"/>
              </svg>
            </div>
            <h4 className="relative font-industrial text-[28px] sm:text-[40px] text-white uppercase tracking-wide leading-none m-0 shadow-sm">
              POWERTRAIN<span className="text-[#E11D2A]">.</span>
            </h4>
            <p className="relative font-sans text-sm sm:text-base text-[#e0e0e0] font-medium leading-[1.6]">
              American-made 124ci ARCH / S&S V-Twin is tuned for high torque making the KRGT-1 the ultimate street machine.
            </p>
          </div>
        </div>

      </section>

          {/* ============ SECTION 04: THE NUMBERS — Desktop & Mobile HUD Layout ============ */}
      <section className="relative w-full h-[100vh] min-h-[100vh] max-h-[100vh] overflow-hidden pointer-events-auto flex flex-col justify-center bg-transparent py-12 max-sm:py-[4rem]" id="section-specs">
        <EdgeChrome />

        {/* Custom inline styles for futuristic concentric arc animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-counter {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes pulse-soft {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 0.75; }
          }
          .animate-spin-slow {
            animation: spin-slow 35s linear infinite;
          }
          .animate-spin-counter {
            animation: spin-counter 45s linear infinite;
          }
          .animate-pulse-soft {
            animation: pulse-soft 3s ease-in-out infinite;
          }
        `}} />

        {/* ============ HIGH-FIDELITY HUD DECORATIONS & ALIGNMENT LABELS ============ */}

        {/* Desktop & Mobile Title - Top and Left Aligned */}
        <div className="absolute top-0 left-0 px-6 pt-12 sm:pt-24 sm:px-12 md:px-16 lg:px-[80px] lg:pt-[100px] z-20 text-left flex flex-col items-start justify-start pointer-events-none">
          <div className="relative flex flex-col items-start">
            <h2 className="font-industrial text-[40px] md:text-[64px] lg:text-[80px] text-white uppercase tracking-tight font-black leading-none m-0" style={{ letterSpacing: '-0.02em' }}>
              NUMBERS<span className="text-[#E11D2A]">.</span>
            </h2>
          </div>
        </div>

        {/* ============ HUD CONTENT CONTAINER (FLUID SCALABLE HUD CROWN) ============ */}
        <div className="z-10 h-full px-2 sm:px-4 max-w-[1600px] mx-auto w-full flex flex-col justify-center items-center mt-6 lg:mt-0">
          
          {/* SINGLE HIGH-FIDELITY SCALABLE HUD LAYOUT FOR BOTH MOBILE & DESKTOP */}
          <div 
            className="relative overflow-visible flex items-center justify-center w-full"
            style={{
              height: `${trueBodyHeight * scale}px`,
              width: '100%',
            }}
          >
            {/* The scaled container width is shrunk to 800x540 to match the true body of the gauges */}
            <div 
              className="absolute left-1/2 top-1/2 select-none pointer-events-auto"
              style={{
                width: `${trueBodyWidth}px`,
                height: `${trueBodyHeight}px`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                willChange: 'transform',
              }}
            >
              
              {/* CENTER FUEL TANK TARGET CIRCLE - Mobile Only (Behind numbers) */}
              {isMobile && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[460px] h-[460px] select-none pointer-events-none -z-10"
                  style={{ top: '650px' }}
                >
                  
                  {/* Reticle system */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <svg className="w-full h-full p-2 relative z-0" viewBox="0 0 500 500" fill="none">
                      
                      {/* Outer subtle ticks */}
                      <circle cx="250" cy="250" r="215" stroke="rgba(225,29,42,0.15)" strokeWidth="0.8" strokeDasharray="4 8" />
                      
                      {/* Interactive spinning concentric tech rings */}
                      <circle cx="250" cy="250" r="195" stroke="#E11D2A" strokeWidth="1" strokeDasharray="2 12" className="origin-center animate-spin-slow" opacity="0.65" />
                      <circle cx="250" cy="250" r="190" stroke="#E11D2A" strokeWidth="1.5" strokeDasharray="150 40 20 40" className="origin-center animate-spin-counter" opacity="0.45" />
                      <circle cx="250" cy="250" r="180" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                      
                      {/* Corner alignment crosshairs inside the reticle */}
                      <path d="M 250,20 L 250,45" stroke="#E11D2A" strokeWidth="1.5" />
                      <path d="M 250,480 L 250,455" stroke="#E11D2A" strokeWidth="1.5" />
                      <path d="M 20,250 L 45,250" stroke="#E11D2A" strokeWidth="1.5" />
                      <path d="M 480,250 L 455,250" stroke="#E11D2A" strokeWidth="1.5" />

                      {/* Target notches / Triangles */}
                      <polygon points="250,56 245,64 255,64" fill="#E11D2A" opacity="0.8" />
                      <polygon points="250,444 245,436 255,436" fill="#E11D2A" opacity="0.8" />

                    </svg>
                  </div>
                </div>
              )}

              {/* ============ SVG ARCHED CONNECTING LINES ============ */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-40">
                <svg className="w-full h-full" viewBox={`0 0 ${trueBodyWidth} ${trueBodyHeight}`} fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hud-connecting-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(225,29,42,0.02)" />
                      <stop offset="30%" stopColor="rgba(225,29,42,0.45)" />
                      <stop offset="50%" stopColor="#E11D2A" />
                      <stop offset="70%" stopColor="rgba(225,29,42,0.45)" />
                      <stop offset="100%" stopColor="rgba(225,29,42,0.02)" />
                    </linearGradient>
                  </defs>
                  {isMobile ? (
                    <>
                      {/* Symmetrical HUD paths connecting centers */}
                      <path d={`M ${x1},${y1} L ${x4},${y4} L ${x3},${y3} L ${x2},${y2}`} stroke="url(#hud-connecting-gradient)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5" />
                      <path d={`M ${x1},${y1} Q 360,600 ${x2},${y2}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 3" />
                    </>
                  ) : (
                    <>
                      {/* Symmetrical HUD connecting lines for desktop */}
                      <path d={`M ${x1},${y1} L ${x4},${y4} L ${x3},${y3} L ${x2},${y2}`} stroke="url(#hud-connecting-gradient)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.6" />
                      <path d={`M ${x1},${y1} Q 800,450 ${x2},${y2}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 3" />
                    </>
                  )}

                  {/* Core indicator intersection dots */}
                  <circle cx={x1} cy={y1} r="2.8" fill="#E11D2A" />
                  <circle cx={x2} cy={y2} r="2.8" fill="#E11D2A" />
                  <circle cx={x3} cy={y3} r="2.8" fill="#E11D2A" />
                  <circle cx={x4} cy={y4} r="2.8" fill="#E11D2A" />
                </svg>
              </div>
              
              {/* Dial 01: DRY WEIGHT (Centered at the absolute apex, styled perfectly) */}
              <div className="absolute transition-transform" style={{ left: `${x1}px`, top: `${y1}px`, transform: `translate(-50%, -50%) ${isMobile ? 'scale(0.65)' : 'scale(1)'}` }}>
                <HUDStat 
                  end={436} 
                  suffix="LBS" 
                  label="DRY WEIGHT" 
                  num="01" 
                  accent={accent} 
                  delay={0.1} 
                  max={600} 
                />
              </div>

              {/* Dial 02: REAR-WHEEL POWER (Upper Left Wing flanking 01, lower depth) */}
              <div className="absolute transition-transform" style={{ left: `${x2}px`, top: `${y2}px`, transform: `translate(-50%, -50%) ${isMobile ? 'scale(0.65)' : 'scale(1)'}` }}>
                <HUDStat 
                  end={122} 
                  suffix="HP" 
                  label="REAR-WHEEL POWER" 
                  num="02" 
                  accent={accent} 
                  delay={0.25} 
                  max={488} 
                />
              </div>

              {/* Dial 03: MAX TORQUE (Upper Right Wing flanking 01, lower depth) */}
              <div className="absolute transition-transform" style={{ left: `${x3}px`, top: `${y3}px`, transform: `translate(-50%, -50%) ${isMobile ? 'scale(0.65)' : 'scale(1)'}` }}>
                <HUDStat 
                  end={115} 
                  suffix="LB·FT" 
                  label="MAX TORQUE" 
                  num="03" 
                  accent={accent} 
                  delay={0.4} 
                  max={460} 
                />
              </div>

              {/* Dial 04: IQ SCORE (Lower center relative console, creates perfect depth arch under 01) */}
              <div className="absolute transition-transform" style={{ left: `${x4}px`, top: `${y4}px`, transform: `translate(-50%, -50%) ${isMobile ? 'scale(0.65)' : 'scale(1)'}` }}>
                <HUDStat 
                  end={85} 
                  suffix="IQ" 
                  label="IQ SCORE" 
                  num="04" 
                  accent={accent} 
                  delay={0.55} 
                  max={340} 
                />
              </div>
          </div>
        </div>
        </div>

      </section>

    </div>
  );
}
