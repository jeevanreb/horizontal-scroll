// pages/index.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Sticky() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = portfolioRef.current;
    const container = containerRef.current;

    if (!el || !container) return;

    // Pin portfolio until the end of container scroll
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',          // when container hits top
      end: 'bottom bottom',      // until bottom of container
      pin: el,
      pinSpacing: false,         // remove extra spacing if you want
      scrub: true,               // smooth scrub
    });
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Portfolio (Pinned) */}
      <div
        ref={portfolioRef}
        className="w-full h-screen flex items-center justify-center bg-gray-900 text-white"
      >
        <h1 className="text-4xl">My Portfolio</h1>
      </div>

      {/* Other Sections */}
      <section className="h-screen bg-red-400 flex items-center justify-center">Section 1</section>
      <section className="h-screen bg-blue-400 flex items-center justify-center">Section 2</section>
      <section className="h-screen bg-green-400 flex items-center justify-center">Section 3</section>

      {/* Last Section – portfolio scrolls away with this */}
      <section className="h-screen bg-yellow-400 flex items-center justify-center">
        Last Section
      </section>
    </div>
  );
}
