"use client";

import { useState, useEffect } from 'react';
import { isLenkalicaApp } from '@/utils/androidDetection';

export function useAndroidDetection() {
  const [isAndroid, setIsAndroid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsAndroid(isLenkalicaApp());
    setMounted(true);
  }, []);

  return {
    isAndroid,
    mounted
  };
}