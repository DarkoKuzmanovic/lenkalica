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
    };
  }
}

export function isAndroidWebview(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if Android interface is available (injected by your Android app)
  const hasAndroidInterface = typeof window.Android !== 'undefined';
  
  // Additional checks for Android webview user agent patterns
  const userAgent = navigator.userAgent;
  const isAndroidUA = /Android/i.test(userAgent);
  const isWebView = /wv|WebView/i.test(userAgent);
  
  return hasAndroidInterface || (isAndroidUA && isWebView);
}

export function isLenkalicaApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check specifically for your Android interface
  return typeof window.Android !== 'undefined';
}

export function getAndroidInterface() {
  if (typeof window === 'undefined') return null;
  return window.Android || null;
}