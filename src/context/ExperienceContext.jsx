import React, { createContext, useContext, useState, useEffect } from 'react';

const ExperienceContext = createContext({
  atmosphereMode: 'paperDust',
  setAtmosphereMode: () => {},
  isImmersionMode: false,
  setIsImmersionMode: () => {},
  activeScene: 'hero',
  setActiveScene: () => {},
  isAudioMuted: false,
  setIsAudioMuted: () => {},
});

export function ExperienceProvider({ children }) {
  const [atmosphereMode, setAtmosphereMode] = useState('paperDust');
  const [isImmersionMode, setIsImmersionMode] = useState(false);
  const [activeScene, setActiveScene] = useState('hero');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    return typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        atmosphereMode,
        setAtmosphereMode,
        isImmersionMode,
        setIsImmersionMode,
        activeScene,
        setActiveScene,
        isAudioMuted,
        setIsAudioMuted,
        prefersReducedMotion,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  return useContext(ExperienceContext);
}
