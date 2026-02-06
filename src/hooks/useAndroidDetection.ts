"use client";

import { useState, useEffect } from "react";
import { isLenkalicaApp } from "@/utils/androidDetection";

export function useAndroidDetection() {
  // Initialize synchronously on client to prevent flash of wrong component
  const [isAndroid] = useState(() => (typeof window !== "undefined" ? isLenkalicaApp() : false));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isAndroid,
    mounted,
  };
}
