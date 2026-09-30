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
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  return useContext(ExperienceContext);
}
