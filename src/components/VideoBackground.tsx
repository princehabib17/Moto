import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoBackgroundProps {
  src: string;
  key?: string | number;
}

export function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPlay, setCanPlay] = useState(false);
  const currentTarget = useRef(0);
  const seeking = useRef(false);
  const seekPending = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const doSeek = () => {
      if (video.seeking || seeking.current) {
        seekPending.current = true;
        return;
      }
      seeking.current = true;
      requestAnimationFrame(() => {
        video.currentTime = currentTarget.current;
      });
    };

    const handleSeeked = () => {
      seeking.current = false;
      if (seekPending.current) {
        seekPending.current = false;
        doSeek();
      }
    };

    const handleProgress = () => {
      if (video.duration > 0) {
        let bufferedEnd = 0;
        for (let i = 0; i < video.buffered.length; i++) {
          bufferedEnd = Math.max(bufferedEnd, video.buffered.end(i));
        }
        setProgress(Math.round((bufferedEnd / video.duration) * 100));
      }
    };

    const handleCanPlay = () => {
      setCanPlay(true);
    };

    const handleLoadedData = () => {
      // Just in case canplay takes too long on mobile
      setCanPlay(true);
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // Force load for mobile browsers that ignore preload="auto"
    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        video.pause();
      }).catch((e) => {
        // Autoplay was prevented, but it still often forces the metadata to load.
        console.log("Autoplay prevented", e);
      });
    }

    // Fallback: don't block the UI forever on mobile
    const fallbackTimeout = setTimeout(() => {
      setCanPlay(true);
    }, 2000);

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (!video || !video.duration) return;
        const duration = video.duration || 1;
        currentTarget.current = Math.max(0, Math.min(self.progress * duration, duration - 0.1));
        doSeek();
      },
    });

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      clearTimeout(fallbackTimeout);
      st.kill();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const moveX = (e.clientX / window.innerWidth) * 2 - 1;
      const moveY = (e.clientY / window.innerHeight) * 2 - 1;
      
      gsap.to(wrapperRef.current, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {!canPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <p className="text-white text-2xl font-sans">
            Loading... {progress}%
          </p>
        </div>
      )}
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center"
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover scale-[1.35] translate-y-[10vh] md:translate-y-[5vh]"
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
        />
      </div>
    </>
  );
}
