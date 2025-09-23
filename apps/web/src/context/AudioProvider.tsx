"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback, ReactNode } from 'react';

interface AudioContextType {
    playSoundEffect: (type: 'click' | 'bingo' | 'number' | 'win' | 'lose' | "start") => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
    children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
    const soundEffectRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        soundEffectRef.current = new Audio('/sound.wav');
        soundEffectRef.current.preload = 'auto';
        soundEffectRef.current.volume = 0.5;

        return () => {
            if (soundEffectRef.current) {
                soundEffectRef.current.pause();
                soundEffectRef.current = null;
            }
        };
    }, []);

    const playSoundEffect = useCallback((type: 'click' | 'bingo' | 'number' | 'win' | 'lose' | "start") => {
        if (!soundEffectRef.current) {
            console.log('Sound effect ref not available, skipping');
            return;
        }

        try {
            soundEffectRef.current.currentTime = 0;
            soundEffectRef.current.play().catch((error) => {
                console.warn('Failed to play sound effect:', error);
            });
        } catch (error) {
            console.warn('Error playing sound effect:', error);
        }
    }, []);

    const value: AudioContextType = {
        playSoundEffect,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = (): AudioContextType => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
