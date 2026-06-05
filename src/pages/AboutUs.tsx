import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const container = sliderContainerRef.current;
      const slider = sliderRef.current;
      
      if (container && slider) {
        // Calculate how much we need to move based on the slider width vs viewport
        const scrollAmount = slider.scrollWidth - window.innerWidth;
        
        // Only run if the content is wider than viewport
        if (scrollAmount > 0) {
          gsap.to(slider, {
            x: -scrollAmount,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: `+=${scrollAmount}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            }
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  const timelineData = [
    { year: "2018", text: "The first prototype. A stripped-down chassis built in a small garage in California." },
    { year: "2019", text: "Debut of the R-1 prototype at the Custom Show, turning heads with its aggressive posture." },
    { year: "2021", text: "Expanded production facility, introducing aerospace-grade billet aluminum machining in-house." },
    { year: "2023", text: "Launch of the R-2 series, featuring an entirely proprietary suspension and downdraft intake." },
    { year: "2025", text: "Revenant Racing team takes to the track, testing components under extreme motorsport conditions." },
    { year: "2026", text: "Over 500 custom builds on the road worldwide, completely tailored to their riders." },
  ];

  const teamData = [
    { name: "John Revenant", role: "Founder & Master Builder", desc: "Decades of racing pedigree poured into custom motorcycle engineering." },
    { name: "Michael Chang", role: "Lead Designer", desc: "Defining the brutalist aesthetic of every Revenant machine." },
    { name: "Dr. Elena Rossi", role: "Head of Powertrain", desc: "Expert in thermodynamic efficiency and high-output V-Twin performance." },
    { name: "David Alpert", role: "Lead Machinist", desc: "Turning raw blocks of aluminum into functional works of art." },
    { name: "Aisha Patel", role: "Operations Director", desc: "Ensuring precision and quality across our bespoke manufacturing process." },
    { name: "Marcus Johnson", role: "Fabrication Specialist", desc: "Master fabricator handling proprietary exhaust and frame geometry." },
    { name: "Li Wei", role: "Suspension Engineer", desc: "Dialing in track-level handling for street environments." },
    { name: "Jessica Bloom", role: "Client Relations", desc: "Guiding future owners through the custom configuration journey." },
  ];

  return (
    <div className="w-full pointer-events-auto bg-transparent">
      
      {/* Hero + Horizontal timeline slider */}
      <section ref={sliderContainerRef} className="w-full h-screen flex flex-col justify-between pt-32 sm:pt-40 pb-5 overflow-hidden">
        <div className="px-5 sm:px-8 max-w-7xl mx-auto w-full">
          <h1 className="text-display font-bold text-white uppercase tracking-tighter mb-8">
            The Workshop.
          </h1>
          <p className="text-h3 text-gray-400 leading-relaxed max-w-3xl font-medium">
            We are a collective of designers, fabricators, and engineers dedicated to a singular obsession: creating the ultimate bespoke riding experience. This is the story of Revenant.
          </p>
        </div>

        <div className="w-full translate-y-12">
          <div className="px-5 sm:px-8 max-w-7xl mx-auto w-full mb-12">
            <h2 className="text-h3 font-bold text-white uppercase tracking-wide">Our Heritage</h2>
          </div>
          
          <div ref={sliderRef} className="flex gap-12 px-5 sm:px-8 pl-5 sm:pl-8 pr-[50vw]">
            {timelineData.map((item, i) => (
              <div key={i} className="flex flex-col min-w-[300px] w-[300px]">
                <span className="text-display font-bold text-white/10 mb-4 tracking-tighter">{item.year}</span>
                <p className="text-h3 text-gray-300 font-medium border-t-2 border-[#E11D2A] pt-4">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="h-screen py-16 px-5 sm:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {/* Small description below slider */}
        <div className="mb-12">
          <p className="text-body text-gray-400 font-medium leading-relaxed max-w-[20rem]">
            Since our inception, our focus has always been on rider-centric design paired with uncompromising performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex gap-1 mb-4 text-red-500">
              {'★★★★★'}
            </div>
            <p className="text-body text-gray-200 font-medium mb-6">
              "My R-1 is unlike anything I've ever ridden. The torque rips your arms off, yet the cornering is as sharp as a scalpel. True American muscle."
            </p>
            <p className="text-body text-gray-500 font-bold uppercase tracking-widest">— Jason K.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <div className="flex gap-1 mb-4 text-red-500">
              {'★★★★★'}
            </div>
            <p className="text-body text-gray-200 font-medium mb-6">
              "The fit and finish are borderline obsessive. Every piece of billet aluminum feels like a sculpture. It's a heavy machine that dances on the road."
            </p>
            <p className="text-body text-gray-500 font-bold uppercase tracking-widest">— Mark T.</p>
          </div>
        </div>

        <div className="text-center py-8 border-t border-b border-white/10">
          <h3 className="text-h3 font-bold text-white uppercase tracking-tighter mb-4">Ready to ride?</h3>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-configurator'))}
            className="btn-active-scale bg-[#E11D2A] text-white text-body font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-red-700 transition-colors inline-flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
          >
            Configure Your Build
          </button>
        </div>
      </section>

      {/* Team Section */}
      <section className="h-screen py-16 px-5 sm:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center overflow-hidden">
        <h2 className="text-h2 font-bold text-white uppercase tracking-tighter mb-8 text-left">Meet the Builders</h2>
        <div className="w-full max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamData.map((member, i) => (
              <div key={i} className="p-6 rounded-2xl flex flex-col items-start text-left bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 text-[#E11D2A] border border-white/10">
                  <User size={20} />
                </div>
                <h4 className="font-bold text-white text-body mb-1">{member.name}</h4>
                <h6 className="text-micro font-bold text-[#E11D2A] uppercase tracking-widest mb-3">{member.role}</h6>
                <p className="text-body text-gray-400 font-medium leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="h-screen py-16 px-5 sm:px-8 max-w-3xl mx-auto w-full flex flex-col justify-center">
        <h2 className="text-h2 font-bold text-white mb-8 tracking-tighter uppercase text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
          {[
            { q: "What is the lead time for a custom build?", a: "Each Revenant motorcycle is built to order. Current lead times run approximately 6 to 8 months from the initial deposit." },
            { q: "Can I customize the ergonomics?", a: "Absolutely. During the consultation phase, we tailor the bars, seat height, and foot controls exactly to your body geometry." },
            { q: "Do you ship internationally?", a: "We ship our custom motorcycles globally, handling all crating and export logistics securely." },
            { q: "What kind of warranty comes with the bike?", a: "Every new build includes a full 2-year warranty on the powertrain and a lifetime warranty on the machined chassis components." },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-red-500/50 transition-colors">
              <div className="flex justify-between items-center cursor-pointer group">
                <h4 className="font-bold text-white text-h3">{faq.q}</h4>
                <ChevronDown className="text-[#E11D2A] group-hover:text-white transition-colors" size={20} />
              </div>
              <p className="text-body text-gray-400 font-medium mt-4 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
