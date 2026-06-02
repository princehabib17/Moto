/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { VideoBackground } from './components/VideoBackground';
import { Navbar } from './components/Navbar';
import { CockpitInstruments } from './components/CockpitInstruments';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ConfiguratorModal } from './components/ConfiguratorModal';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Give elements a tiny bit of time to settle in DOM before refreshing triggers
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return null;
}

function DynamicBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initialize
    window.addEventListener('resize', handleResize);
    
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
    };
  }, []);

  const src = isMobile 
    ? "https://res.cloudinary.com/deulmakpv/video/upload/v1779123003/Motorcycle_camera_move_dark_studio_202605181159_-_Trim_wtzohh.mp4"
    : "https://res.cloudinary.com/deulmakpv/video/upload/v1779122994/Motorcycle_camera_move_dark_studio_202605181155_-_Trim_smoohl.mp4";

  return <VideoBackground key={src} src={src} />;
}

function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      
      {!isHome && <Footer />}
    </>
  );
}

export default function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsConfigOpen(true);
    window.addEventListener('open-configurator', handleOpen);
    return () => window.removeEventListener('open-configurator', handleOpen);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative min-h-screen text-white font-sans overflow-x-hidden bg-black">
        <DynamicBackground />
        
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
          <Navbar />
          <CockpitInstruments />
        </div>

        <div className="relative z-10">
          <Layout />
        </div>

        <ConfiguratorModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
