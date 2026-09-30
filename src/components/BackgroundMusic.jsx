import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, Volume1, VolumeX, Play, Pause, RotateCcw, Star } from 'lucide-react';

const YT_VIDEO_ID = 'NSnkb1IAjbE';
const DEFAULT_VOLUME = 30;

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [useFallbackAudio, setUseFallbackAudio] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(true);
  const [widgetPosition, setWidgetPosition] = useState({ x: 16, y: 112 });

  const playerRef = useRef(null);
  const fallbackAudioRef = useRef(null);
  const initTimeoutRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const triggerPlayRef = useRef(null);
  const removeUserGestureListenersRef = useRef(null);
  isPlayingRef.current = isPlaying;

  const startWidgetDrag = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: widgetPosition.x,
      originY: widgetPosition.y,
    };
    draggedRef.current = false;
  };

  const moveWidget = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) draggedRef.current = true;
    if (!draggedRef.current) return;
    const widgetWidth = isExpanded ? 320 : 48;
    const widgetHeight = isExpanded ? 56 : 48;
    setWidgetPosition({
      x: Math.max(0, Math.min(window.innerWidth - widgetWidth, drag.originX + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - widgetHeight, drag.originY + deltaY)),
    });
  };

  const stopWidgetDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  // 1. Initialize YouTube Iframe Player
  useEffect(() => {
    let isCancelled = false;

    // Load YouTube IFrame API script if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.body.appendChild(tag);
    }

    const initPlayer = () => {
      if (isCancelled || playerRef.current) return;
      if (!window.YT || !window.YT.Player) {
        initTimeoutRef.current = setTimeout(initPlayer, 200);
        return;
      }

      try {
        playerRef.current = new window.YT.Player('yt-bg-audio-container', {
          height: '2',
          width: '2',
          videoId: YT_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: YT_VIDEO_ID, // Required for loop in single YT video
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (isCancelled) return;
              setPlayerReady(true);
              event.target.setVolume(DEFAULT_VOLUME);
              // Try autoplay
              try {
                event.target.playVideo();
              } catch (e) {
                console.log('Browser blocked initial autoplay, waiting for interaction:', e);
              }
            },
            onStateChange: (event) => {
              if (isCancelled) return;
              // YT.PlayerState: -1 (UNSTARTED), 0 (ENDED), 1 (PLAYING), 2 (PAUSED), 3 (BUFFERING)
              if (event.data === 1) {
                setIsPlaying(true);
                setAutoplayBlocked(false);
                removeUserGestureListenersRef.current?.();
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Loop: replay immediately
                event.target.seekTo(0);
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onError: (err) => {
              console.warn('YouTube audio player error, fallback to HTML5 audio:', err);
              setUseFallbackAudio(true);
            },
          },
        });
      } catch (err) {
        console.warn('Failed to initialize YouTube player:', err);
        setUseFallbackAudio(true);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      initTimeoutRef.current = setTimeout(initPlayer, 500);
    }

    // Safety timeout: if YouTube API doesn't initialize within 6s, prepare fallback
    const safetyFallbackTimer = setTimeout(() => {
      if (!playerRef.current && !playerReady) {
        setUseFallbackAudio(true);
      }
    }, 6000);

    return () => {
      isCancelled = true;
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
      clearTimeout(safetyFallbackTimer);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (_) {}
      }
    };
  }, []);

  // 2. Playback trigger helper
  const triggerPlay = () => {
    if (useFallbackAudio) {
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.volume = isMuted ? 0 : volume / 100;
        fallbackAudioRef.current.play().then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
          removeUserGestureListenersRef.current?.();
        }).catch((err) => {
          console.log('Audio fallback play error:', err);
        });
      }
    } else if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
        }
        playerRef.current.playVideo();
      } catch (e) {
        console.log('YouTube play error:', e);
      }
    }
  };

  triggerPlayRef.current = triggerPlay;

  const triggerPause = () => {
    if (useFallbackAudio) {
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.log('YouTube pause error:', e);
      }
    }
  };

  // Retry only on genuine user gestures. Pointer movement and scrolling do not
  // grant autoplay permission, and must not consume the first valid interaction.
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (isPlayingRef.current) {
        removeUserGestureListenersRef.current?.();
        return;
      }
      triggerPlayRef.current?.();
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      removeUserGestureListenersRef.current = null;
    };
    removeUserGestureListenersRef.current = removeListeners;

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return removeListeners;
  }, []);

  // Retry startup as soon as the fallback source is mounted. If the browser
  // still blocks it, the genuine-gesture listeners above remain available.
  useEffect(() => {
    if (useFallbackAudio) triggerPlay();
  }, [useFallbackAudio]);

  // Broadcast state changes globally
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bg-music-state', { 
      detail: { isPlaying, volume, isMuted } 
    }));
  }, [isPlaying, volume, isMuted]);

  // Listen to remote toggle / volume events
  useEffect(() => {
    const onToggle = () => togglePlayPause();
    const onSetVol = (e) => {
      if (typeof e.detail?.volume === 'number') {
        handleVolumeChange(e.detail.volume);
      }
    };

    window.addEventListener('toggle-bg-music', onToggle);
    window.addEventListener('set-bg-volume', onSetVol);
    return () => {
      window.removeEventListener('toggle-bg-music', onToggle);
      window.removeEventListener('set-bg-volume', onSetVol);
    };
  }, [isPlaying, useFallbackAudio, playerReady, volume, isMuted]);

  // 4. Volume and Mute updates
  const handleVolumeChange = (newVal) => {
    const val = Math.max(0, Math.min(100, newVal));
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }

    if (useFallbackAudio) {
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.volume = isMuted ? 0 : val / 100;
      }
    } else if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(val);
        if (val === 0) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (_) {}
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (useFallbackAudio) {
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.volume = nextMuted ? 0 : volume / 100;
      }
    } else if (playerRef.current) {
      try {
        if (nextMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
        }
      } catch (_) {}
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      triggerPause();
    } else {
      triggerPlay();
    }
  };

  return (
    <>
      {/* Hidden YouTube Player Iframe (must be rendered in DOM with minimal size for browser audio processing) */}
      <div
        id="yt-bg-audio-container"
        className="fixed bottom-0 left-0 -z-50 pointer-events-none opacity-[0.001] w-[2px] h-[2px] overflow-hidden"
        aria-hidden="true"
      />

      {/* Fallback HTML5 Audio Tag */}
      {useFallbackAudio && (
        <audio
          ref={fallbackAudioRef}
          src="/audio/vietnam-my-home.m4a"
          loop
          preload="auto"
          onEnded={() => {
            if (fallbackAudioRef.current) {
              fallbackAudioRef.current.currentTime = 0;
              fallbackAudioRef.current.play().catch(() => {});
            }
          }}
        />
      )}
    </>
  );
}
