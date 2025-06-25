"use client";

import { useEffect } from "react";
import { useAndroidDetection } from "@/hooks/useAndroidDetection";

// Extend the Window interface for Android media callbacks
declare global {
  interface Window {
    handleAndroidMediaPlay?: () => void;
    handleAndroidMediaPause?: () => void;
    handleAndroidMediaSeek?: (position: number) => void;
  }
}

// Global callback setup component
export default function AndroidMediaSetup() {
  const { isAndroid } = useAndroidDetection();

  useEffect(() => {
    if (isAndroid) {
      console.log('Setting up Android media callbacks at app level');
      // Ensure callbacks exist even if AudioPlayer hasn't mounted yet
      if (!window.handleAndroidMediaPlay) {
        window.handleAndroidMediaPlay = () => {
          console.log('Android media play - callback not yet connected');
        };
      }
      if (!window.handleAndroidMediaPause) {
        window.handleAndroidMediaPause = () => {
          console.log('Android media pause - callback not yet connected');
        };
      }
      if (!window.handleAndroidMediaSeek) {
        window.handleAndroidMediaSeek = (position: number) => {
          console.log('Android media seek - callback not yet connected, position:', position);
        };
      }
    }
  }, [isAndroid]);

  return null; // This component renders nothing
}