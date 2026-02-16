import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Simple in-memory storage con persistencia simulada
const themeCache: { [key: string]: string } = {};

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
  };
  isReady: boolean;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
  };
  isReady: boolean;
}

const defaultTheme = {
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
    primary: '#4ECDC4',
    border: '#E0E0E0',
  },
  isReady: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Cargar preferencia de tema al montar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Simulamos persistencia con un cache en memoria
        // En producción, esto se guardaría en AsyncStorage o similar
        const savedTheme = themeCache['mma_theme'] || 'light';
        setIsDarkMode(savedTheme === 'dark');
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try {
      // Guardar en cache
      themeCache['mma_theme'] = newMode ? 'dark' : 'light';
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDarkMode
    ? {
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        primary: '#4ECDC4',
        border: '#2D2D2D',
      }
    : {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: '#2C3E50',
        textSecondary: '#7F8C8D',
        primary: '#4ECDC4',
        border: '#E0E0E0',
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}
