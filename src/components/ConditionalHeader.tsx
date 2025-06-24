"use client";

import { useAndroidDetection } from '@/hooks/useAndroidDetection';
import Header from './Header';

export default function ConditionalHeader() {
  const { isAndroid, mounted } = useAndroidDetection();

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return <Header />;
  }

  // Hide header when running in Android webview
  if (isAndroid) {
    return null;
  }

  return <Header />;
}