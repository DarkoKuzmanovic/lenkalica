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
      // Ensure callbacks exist even if AudioPlayer hasn't mounted yet
      if (!window.handleAndroidMediaPlay) {
        window.handleAndroidMediaPlay = () => {
        };
      }
      if (!window.handleAndroidMediaPause) {
        window.handleAndroidMediaPause = () => {
        };
      }
      if (!window.handleAndroidMediaSeek) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        window.handleAndroidMediaSeek = (_position: number) => {
        };
      }
    }
  }, [isAndroid]);

  return null; // This component renders nothing
}