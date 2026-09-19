import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAudioLipSync
 * Real-time Web Audio API amplitude analyzer for driving 3D character mouth lip-sync
 * 
 * @param {string} audioUrl Path to the audio file (e.g., '/audio/krishna_birthday_kn.mp3')
 */
export function useAudioLipSync(audioUrl) {
  const [amplitude, setAmplitude] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setIsEnded(true);
      };
    }

    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [audioUrl]);

  // Real-time amplitude analysis loop (frequencies focused on human speech vowels ~200Hz - 2kHz)
  const updateAmplitude = useCallback(() => {
    if (analyserRef.current && isPlaying) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      const startBin = 2;
      const endBin = Math.min(32, bufferLength);
      for (let i = startBin; i < endBin; i++) {
        sum += dataArray[i];
      }
      const avg = sum / (endBin - startBin);
      const normalized = Math.min(Math.max((avg - 15) / 120, 0), 1); // 0.0 to 1.0

      setAmplitude(normalized);
      animFrameRef.current = requestAnimationFrame(updateAmplitude);
    }
  }, [isPlaying]);

  const play = useCallback(async () => {
    try {
      initAudio();
      await audioRef.current.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
    } catch (err) {
      console.warn('Audio autoplay blocked by browser policy:', err);
      setNeedsInteraction(true);
    }
  }, [initAudio]);

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(updateAmplitude);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      setAmplitude(0);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, updateAmplitude]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return {
    amplitude,
    isPlaying,
    isEnded,
    needsInteraction,
    play,
    audioElement: audioRef.current
  };
}
