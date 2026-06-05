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
  const totalLength = 267; // Precise semi-circle arc length of radius 85 (pi * R = 3.14159 * 85 = 267)
  const strokeDashoffset = totalLength - (progressRatio * totalLength);

  const isDialOne = num === '01';
  const displayNumColor = isDialOne ? 'text-[#E11D2A] drop-shadow-[0_0_12px_rgba(225,29,42,0.45)]' : 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]';
  const displaySuffixColor = 'text-[#E11D2A]';

  return (
    <div 
      ref={ref}
      className="relative flex flex-col items-center justify-center select-none pointer-events-auto transition-transform duration-300 hover:scale-[1.03]"
      id={`hud-stat-${num}`}
      style={{
        width: '200px',
        height: '160px',
      }}
    >
      {/* SVG Arc Dome - Fits the 200x160 container natively */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 200 160" 
        fill="none"
      >
        <defs>
          <mask id={`sweep-mask-${num}`}>
            <path 
              d="M 15,147 A 85,85 0 0,1 185,147" 
              stroke="white" 
              strokeWidth="7" 
              strokeLinecap="butt" 
              fill="none"
              strokeDasharray="267 267"
              strokeDashoffset={strokeDashoffset}
            />
          </mask>
        </defs>
        
        {/* subtle ticks next to numbers */}
        <path d="M 11,149 L 11,153 L 19,153" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
        <path d="M 189,149 L 189,153 L 181,153" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
        
        {/* Extreme Outer Accent Bezel */}
        <path 
          d="M 11,148 A 89,89 0 0,1 189,148" 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1.2" 
        />

        {/* Underlay base track circle (segmented inactive ticks) */}
        <path 
          d="M 15,147 A 85,85 0 0,1 185,147" 
          stroke="rgba(255, 255, 255, 0.12)" 
          strokeWidth="4.5" 
          strokeLinecap="butt"
          strokeDasharray="1.5 2.5" 
        />

        {/* Dynamic LED bar sweep (segmented active red ticks overlay) */}
        <path 
          d="M 15,147 A 85,85 0 0,1 185,147" 
          stroke={accent} 
          strokeWidth="5.5" 
          strokeLinecap="butt"
          strokeDasharray="1.5 2.5"
          mask={`url(#sweep-mask-${num})`}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(225, 29, 42, 0.9)) drop-shadow(0 0 1px rgba(255,80,80,0.5))'
          }}
        />

        {/* Left / Right Start/End Cap Labels */}
        <line x1="11" y1="147" x2="19" y2="147" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.2" />
        <line x1="181" y1="147" x2="189" y2="147" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.2" />
      </svg>

      {/* Ambient background glow inside the arch */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-20 bg-[#E11D2A]/[0.02] rounded-full blur-2xl pointer-events-none" />

      {/* Top Badge (e.g. [ 01 ]) centered above the dome apex */}
      <div className="absolute top-[38px] left-0 right-0 flex justify-center pointer-events-none z-10 select-none">
        <h6 className="font-mono text-nano font-bold text-gray-500 tracking-[0.25em] uppercase">
          [ <span style={{ color: num === '01' ? accent : '#fff' }}>{num}</span> ]
        </h6>
      </div>

      {/* Text Container - Nestled inside the dome */}
      <div 
        className="absolute left-0 right-0 flex flex-col items-center justify-center pointer-events-none z-10"
        style={{
          top: '85px',
          height: '65px',
        }}
      >
        
        {/* Big numeric data display */}
        <div className="flex items-baseline justify-center gap-1 select-none pointer-events-auto">
          <span className={`font-industrial text-[32px] leading-[0.75] font-black ${displayNumColor}`}>
            {value}
          </span>
          <h6 className={`font-mono text-nano font-black tracking-widest ${displaySuffixColor} uppercase pb-[2px] inline-block`}>
            {suffix}
          </h6>
        </div>

        {/* Precise human metric label */}
        <div className="flex flex-col items-center justify-center px-4 mt-2 select-none pointer-events-auto">
          <h6 className="font-sans text-nano text-[#8e8d88] font-bold tracking-[0.2em] text-center uppercase mr-[-0.2em]">
            {label}
          </h6>
          
          {/* Tech horizontal bracket structure */}
          <div className="relative w-[50px] h-[4px] mt-1 flex items-center justify-center opacity-80">
            <div className="absolute left-0 right-0 h-[1px] bg-white/10"></div>
            <div className="absolute left-0 top-0 w-[1px] h-[3px] bg-white/20"></div>
            <div className="absolute right-0 top-0 w-[1px] h-[3px] bg-white/20"></div>
            <div className="absolute w-[3px] h-[3px] bg-[#E11D2A] rounded-full"></div>
          </div>
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
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  
  const isSmallMobile = windowWidth < 640;
  // Calculate scale to fit either width or 100vh height (minus some padding)
  const trueBodyWidth = isMobile ? 800 : 1400;
  const trueBodyHeight = isMobile ? 540 : 540;
  const widthScale = (windowWidth - 40) / trueBodyWidth;
  const heightScale = (windowHeight - 80) / trueBodyHeight;
  const scale = isSmallMobile 
    ? Math.min((windowWidth - 16) / trueBodyWidth, heightScale * 2.0)
    : Math.min(2.0, widthScale, heightScale);

  // HUD Coordinates mapped to true body container
  const x1 = isMobile ? 400 : 1100; // Dry Weight
  const y1 = isMobile ? 110 : 80;

  const x2 = isMobile ? 140 : 1250; // Rear Wheel Power
  const y2 = isMobile ? 310 : 190;

  const x3 = isMobile ? 660 : 1250; // Max Torque
  const y3 = isMobile ? 310 : 350;

  const x4 = isMobile ? 400 : 1100; // IQ Score
  const y4 = isMobile ? 430 : 460;

  const ctrlLeftX = (x2 + x1) / 2;
  const ctrlRightX = isMobile ? (x1 + x3) / 2 : (x4 + x3) / 2;
  const ctrlLeftY1 = y1 + (y2 - y1) * 0.4;
  const ctrlRightY1 = y1 + (y3 - y1) * 0.4;
  const ctrlLeftY2 = y2 + (y4 - y2) * 0.6;
  const ctrlRightY2 = y3 + (y4 - y3) * 0.6;
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
      <section className="relative w-full h-screen min-h-screen max-h-screen overflow-hidden pointer-events-auto flex flex-col justify-start" id="section-hero">
        <EdgeChrome />

        {/* Vertical Center Container for industrial vertically stacked H1 */}
        <div 
          ref={topBlockRef}
          className="absolute top-[120px] left-6 sm:left-[80px] z-20 pointer-events-none select-none max-w-[85vw] w-full mix-blend-difference"
        >
          <h1 
            className="text-h2 sm:text-display lg:text-hero text-white uppercase text-left"
            style={{ 
              lineHeight: '0.9',
              letterSpacing: '-0.06em',
              willChange: 'transform, opacity',
              textShadow: '0 4px 24px rgba(0,0,0,0.4)',
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
              <button 
                onClick={() => {
                  const lenis = (window as any).lenis;
                  if (lenis) {
                    lenis.scrollTo('#section-machine', { duration: 1.5 });
                  } else {
                    document.querySelector('#section-machine')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-active-scale bg-[#E11D2A] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-body font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(225,29,42,0.3)] hover:shadow-none cursor-pointer"
              >
                EXPLORE MACHINE ⟶
              </button>
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
      <section className="relative w-full h-screen min-h-screen max-h-screen overflow-hidden pointer-events-auto flex flex-col justify-center bg-transparent animate-fade-in" id="section-ethos">
        <EdgeChrome />

        {/* Elevated content container with premium padding alignment */}
        <div className="z-10 px-6 sm:px-12 md:px-16 lg:px-[80px] max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-24">
          
          {/* Content — left column with vertical rule */}
          <div ref={ethosRef} className="w-full lg:max-w-[500px] flex gap-6 sm:gap-8 opacity-0">
            
            {/* Vertical accent rule */}
            <div className="bar hidden sm:block w-[1px] min-h-[220px]" style={{
               background: `linear-gradient(to bottom, ${accent} 0%, ${accent} 30%, rgba(240,235,226,0.1) 30%, rgba(240,235,226,0.1) 100%)`
            }}></div>

            <div className="flex-1 text-left">
              {/* Cascade Size Heading (H2 - Reverted to Solid Editorial Style) */}
              <h2 className="font-anton text-h2 font-normal text-white uppercase tracking-wide drop-shadow-lg m-0 mb-6">
                The Ethos.
              </h2>

              <p className="font-sans text-body leading-[1.65] text-[#d8d3ca] font-medium max-w-[380px] mt-6 sm:mt-8 tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]">
                <span className="font-anton float-left text-h2 sm:text-display leading-[0.86] mr-2 mt-1 sm:mr-3" style={{ color: accent }}>W</span>
                e don't assemble bikes. We machine them from solid blocks of billet aluminum. We create uncompromised, performance-driven American V-Twins.
              </p>

              {/* READ THE FULL STORY button */}
              <div className="flex items-center gap-3 hover:gap-5 transition-all cursor-pointer group mt-8">
                <h6 className="font-mono text-micro tracking-[0.4em] text-white font-bold uppercase transition-colors group-hover:text-red-500">
                  READ THE FULL STORY
                </h6>
                <div className="w-12 h-[1px] transition-all group-hover:w-16" style={{ background: accent }}></div>
                <span style={{ color: accent }}>⟶</span>
              </div>
            </div>

          </div>

          {/* Content — right column: creative technical telemetry specs list */}
          <div className="hidden lg:flex flex-col items-start text-left w-full max-w-[260px] relative select-none pointer-events-none">
            {/* Left accent vertical gradient line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E11D2A] via-[#E11D2A]/40 to-transparent"></div>
            
            <div className="pl-6 space-y-6">
              <div>
                <h6 className="text-[#E11D2A] mb-1 font-bold">// WHEELBASE</h6>
                <span className="font-heading text-h3 text-white uppercase block leading-none">68.0 IN</span>
                <span className="font-sans text-body text-gray-400 block mt-1">1727 MM LENGTH</span>
              </div>
              <div>
                <h6 className="text-[#E11D2A] mb-1 font-bold">// GEOMETRY</h6>
                <span className="font-heading text-h3 text-white uppercase block leading-none">30° RAKE</span>
                <span className="font-sans text-body text-gray-400 block mt-1">5.0 IN TRAIL</span>
              </div>
              <div>
                <h6 className="text-[#E11D2A] mb-1 font-bold">// SUSPENSION</h6>
                <span className="font-heading text-h3 text-white uppercase block leading-none">ÖHLINS FGRT</span>
                <span className="font-sans text-body text-gray-400 block mt-1">48MM FORK TUBES</span>
              </div>
              <div>
                <h6 className="text-[#E11D2A] mb-1 font-bold">// POWERPLANT</h6>
                <span className="font-heading text-h3 text-white uppercase block leading-none">124 CI</span>
                <span className="font-sans text-body text-gray-400 block mt-1">2032 CC ENGINE</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ============ SECTION 03: THE MACHINE — Editorial Specs ============ */}
      <section className="relative w-full min-h-screen py-24 sm:py-32 px-6 sm:px-12 md:px-16 lg:px-[80px] max-w-[1600px] mx-auto flex flex-col justify-center pointer-events-auto" id="section-machine">
        <EdgeChrome />

        {/* Content grid aligned cleanly at the top */}
        <div className="z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A] animate-pulse"></span>
              <h6 className="text-[#E11D2A] font-bold">[ SYSTEM_REVENANT // SEC_03 ]</h6>
            </div>
            
            <h2 className="font-anton text-display sm:text-hero text-white uppercase tracking-tighter leading-none m-0 mb-8">
              THE<br />MACHINE.
            </h2>
            
            <p className="font-sans text-body text-gray-300 leading-relaxed max-w-[480px]">
              Every mounting point, load path, and structural rib is machined from solid blocks of aerospace-grade 6061-T6 aluminum. Engineered to absorb high torsional stress, our chassis delivers absolute high-speed tracking stability and uncompromising feedback from the front fork to the rear contact patch. This is metal, refined to perform.
            </p>
          </div>

          {/* Right Column: Static structured telemetry specs */}
          <div className="lg:col-span-6 w-full flex flex-col gap-6 sm:gap-8">
            <div className="border border-white/5 bg-black/45 backdrop-blur-md p-6 sm:p-8 relative select-none">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#E11D2A]"></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#E11D2A]"></div>
              
              <h3 className="font-anton text-h3 text-white uppercase tracking-wider mb-6 pb-2 border-b border-white/10">
                TECHNICAL SPECIFICATIONS
              </h3>

              <div className="flex flex-col gap-5">
                {[
                  { id: "01", label: "POWERPLANT", val: "124CI DOWNDRAFT V-TWIN" },
                  { id: "02", label: "CHASSIS", val: "CNC MACH 6061-T6 BILLET" },
                  { id: "03", label: "FRONT FORKS", val: "ÖHLINS FGRT SERIES 48MM" },
                  { id: "04", label: "REAR SUSPENSION", val: "PRO-LINK ÖHLINS MONOSHOCK" },
                  { id: "05", label: "EXHAUST", val: "PROPRIETARY TITANIUM 2-IN-1" },
                ].map((spec) => (
                  <div key={spec.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline border-b border-white/5 pb-3">
                    <div className="flex items-baseline gap-2 mb-1 sm:mb-0">
                      <h6 className="text-[#E11D2A] font-bold">// {spec.id}</h6>
                      <span className="font-sans text-body font-bold text-gray-400 tracking-wide uppercase">
                        {spec.label}
                      </span>
                    </div>
                    <span className="font-anton text-h3 text-white">
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

          {/* ============ SECTION 04: THE NUMBERS — Desktop & Mobile HUD Layout ============ */}
      <section className="relative w-full h-[100vh] min-h-[100vh] max-h-[100vh] overflow-hidden pointer-events-auto flex flex-col justify-center bg-transparent" id="section-specs">
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
        {/* Top Header stats overlay ribbon (faithfully matching screenshot) */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-25 pointer-events-none text-white/30 select-none font-mono uppercase tracking-[0.35em] border-b border-white/[0.04] pb-4">
          <div className="flex flex-col gap-1 text-left">
            <h6 className="text-white font-black text-nano">KROT-1 // SYSTEM INTERFACE</h6>
            <h6 className="text-white/20 text-nano tracking-widest">CALIBRATION: STABLE</h6>
          </div>
          <div className="flex flex-col items-end text-right">
            <h6 className="text-white/40 font-bold text-nano">V.01.25</h6>
          </div>
        </div>

        {/* Desktop Title - Top and Left Aligned (same size and design) */}
        {!isMobile && (
          <div className="absolute top-28 left-8 sm:left-[80px] z-20 text-left flex flex-col items-start justify-start p-4">
            <h6 className="font-mono text-nano text-[#E11D2A] tracking-[0.45em] font-black select-none uppercase block mb-3">
              BILLET SPEC SHEET
            </h6>
            <div className="relative flex flex-col items-start">
              <div className="flex items-start justify-start mb-0.5">
                <span className="font-industrial text-h3 sm:text-h2 text-white leading-none tracking-wide font-black uppercase">
                  THE
                </span>
              </div>
              <h2 className="font-industrial text-h2 sm:text-display text-white uppercase tracking-tight font-black leading-none m-0" style={{ letterSpacing: '-0.02em' }}>
                NUMBERS<span className="text-[#E11D2A]">.</span>
              </h2>
            </div>
            <div className="w-10 h-[2.5px] bg-[#E11D2A] mt-5 shadow-[0_0_8px_#E11D2A]"></div>
          </div>
        )}

        {/* ============ HUD CONTENT CONTAINER (FLUID SCALABLE HUD CROWN) ============ */}
        <div className="z-10 h-full px-2 sm:px-4 max-w-[1600px] mx-auto w-full flex flex-col justify-center items-center mt-6 lg:mt-0">
          
          {/* SINGLE HIGH-FIDELITY SCALABLE HUD LAYOUT FOR BOTH MOBILE & DESKTOP */}
          <div 
            className="relative overflow-visible flex items-center justify-center w-full"
            style={{
              height: `${700 * scale}px`,
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
                      {/* Symmetrical Parabolic HUD curves linking the dials exactly like in reference screenshot */}
                      {/* 01 is top center, 02 is left wing, 03 is right wing, 04 is center lower */}
                      {/* Left group connecting line */}
                      <path d={`M ${x2},${y2} Q ${ctrlLeftX},${ctrlLeftY1} ${x1},${y1}`} stroke="url(#hud-connecting-gradient)" strokeWidth="0.85" strokeDasharray="3 4" />
                      
                      {/* Right group connecting line */}
                      <path d={`M ${x4},${y4} Q ${ctrlRightX},${ctrlRightY2} ${x3},${y3}`} stroke="url(#hud-connecting-gradient)" strokeWidth="0.85" strokeDasharray="3 4" />

                      {/* Symmetrical connecting lines across center */}
                      <path d={`M ${x1},${y1} Q ${ctrlRightX},${ctrlRightY1} ${x3},${y3}`} stroke="url(#hud-connecting-gradient)" strokeWidth="0.85" strokeDasharray="3 4" />
                      <path d={`M ${x2},${y2} Q ${ctrlLeftX},${ctrlLeftY2} ${x4},${y4}`} stroke="url(#hud-connecting-gradient)" strokeWidth="0.85" strokeDasharray="3 4" />
                      
                      {/* Symmetrical central axis divider lines */}
                      <line x1="400" y1="10" x2="400" y2="530" stroke="rgba(225, 29, 42, 0.2)" strokeWidth="0.75" strokeDasharray="5 12" />

                      {/* Symmetrical angled leader lines dropping from dials into the physical bike coordinates */}
                      <path d={`M ${x2},${y2} L ${x2 + 25},${y2 + 50} L ${x2 + 90},${y2 + 140}`} stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.7" strokeDasharray="2 3" />
                      <circle cx={x2 + 90} cy={y2 + 140} r="2.2" fill="#E11D2A" />

                      <path d={`M ${x3},${y3} L ${x3 - 25},${y3 + 50} L ${x3 - 90},${y3 + 140}`} stroke="rgba(255, 255, 255, 0.22)" strokeWidth="0.7" strokeDasharray="2 3" />
                      <circle cx={x3 - 90} cy={y3 + 140} r="2.2" fill="#E11D2A" />
                    </>
                  ) : (
                    <>
                      {/* Single curve matching the desktop HUD arc */}
                      <path d={`M ${x1},${y1} C 1320,150 1320,390 ${x4},${y4}`} stroke="url(#hud-connecting-gradient)" strokeWidth="0.85" strokeDasharray="3 4" />
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
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x1}px`, top: `${y1}px` }}>
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
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x2}px`, top: `${y2}px` }}>
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
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x3}px`, top: `${y3}px` }}>
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
              <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x4}px`, top: `${y4}px` }}>
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

              {/* CENTER FUEL TANK TARGET CIRCLE - Mobile Only */}
              {isMobile && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-[460px] h-[460px] select-none pointer-events-none z-10"
                  style={{ top: '360px' }}
                >
                  
                  {/* Reticle system */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <svg className="w-full h-full p-2 relative z-5" viewBox="0 0 500 500" fill="none">
                      
                      {/* Outer subtle ticks */}
                      <circle cx="250" cy="250" r="215" stroke="rgba(225,29,42,0.15)" strokeWidth="0.8" strokeDasharray="4 8" />
                      
                      {/* Interactive spinning concentric tech rings */}
                      <circle cx="250" cy="250" r="195" stroke="#E11D2A" strokeWidth="1" strokeDasharray="2 12" className="origin-center" opacity="0.65" />
                      <circle cx="250" cy="250" r="190" stroke="#E11D2A" strokeWidth="1.5" strokeDasharray="150 40 20 40" className="origin-center" opacity="0.45" />
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

                  {/* Typography perfectly aligned in the center of the transparent target reticle */}
                  <div className="relative z-10 text-center flex flex-col items-center justify-center p-4">
                    
                    <h6 className="font-mono text-nano text-[#E11D2A] tracking-[0.45em] font-black select-none uppercase block mb-3">
                      BILLET SPEC SHEET
                    </h6>

                    <div className="relative flex flex-col items-center">
                      
                      <div className="flex items-center justify-center mb-0.5">
                        {/* Large "THE" */}
                        <span className="font-industrial text-h3 sm:text-h2 text-white leading-none tracking-wide font-black uppercase">
                          THE
                        </span>
                      </div>

                      {/* Giant "NUMBERS." */}
                      <h2 className="font-industrial text-h2 sm:text-display text-white uppercase tracking-tight font-black leading-none m-0" style={{ letterSpacing: '-0.02em' }}>
                        NUMBERS<span className="text-[#E11D2A]">.</span>
                      </h2>

                    </div>

                    {/* Bottom Red dash separator line */}
                    <div className="w-10 h-[2.5px] bg-[#E11D2A] mt-5 shadow-[0_0_8px_#E11D2A]"></div>

                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
