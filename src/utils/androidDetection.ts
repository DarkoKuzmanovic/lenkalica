/**
 * Utility functions for detecting Android webview environment
 */

declare global {
  interface Window {
    Android?: {
      startMediaNotification: (title: string) => void;
      pauseMediaNotification: () => void;
      stopMediaNotification: () => void;
      updateMediaPosition: (position: number, duration: number) => void;
      // Optional methods (version-dependent)
      loadAndPlayAudio?: (url: string, title: string) => void;
      seekToPosition?: (position: number) => void;
    };
  }
}

export function isLenkalicaApp(): boolean {
  if (typeof window === "undefined") return false;

  // Check specifically for your Android interface
  return typeof window.Android !== "undefined";
}

export function getAndroidInterface() {
  if (typeof window === "undefined") return null;
  return window.Android || null;
}
