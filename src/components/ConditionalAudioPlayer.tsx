"use client";

import { useAndroidDetection } from "@/hooks/useAndroidDetection";
import AudioPlayer from "./AudioPlayer";
import AndroidAudioPlayer from "./AndroidAudioPlayer";

// Component that conditionally renders the appropriate audio player
export default function ConditionalAudioPlayer() {
  const { isAndroid } = useAndroidDetection();

  // Use Android-native audio player when running in Android app
  if (isAndroid) {
    return <AndroidAudioPlayer />;
  }

  // Use web audio player for browsers and other platforms
  return <AudioPlayer />;
}