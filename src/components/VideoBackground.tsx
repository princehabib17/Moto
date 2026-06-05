import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  key?: string | number;
}

export function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
      // Play slightly to ensure a frame is loaded, then pause
      video.play().then(() => {
        video.pause();
      }).catch((e) => {
        console.log("Autoplay check:", e);
      });
    };

    const handleLoadedData = () => {
      setCanPlay(true);
    };

    video.addEventListener('progress', handleProgress);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    video.load();

    const fallbackTimeout = setTimeout(() => {
      setCanPlay(true);
    }, 2000);

    return () => {
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <>
      {!canPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <p className="text-white text-h3 font-sans">
            Loading... {progress}%
          </p>
        </div>
      )}
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
        />
      </div>
    </>
  );
}
