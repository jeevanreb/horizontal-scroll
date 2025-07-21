import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollWithThankYou() {
  const containerRef = useRef(null);
  const galleries = useRef([]);
  const gallerySections = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gallerySections.current.forEach((gallerySection, i) => {
        const gallery = galleries.current[i];
        if (!gallery || !gallerySection) return;

        const scrollDistance = gallery.scrollWidth - window.innerWidth;

        gsap.to(gallery, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: gallerySection,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cardSections = [
    { start: 1, end: 7, title: "First Card Section", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { start: 10, end: 17, title: "Second Card Section", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { start: 20, end: 27, title: "Third Card Section", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi." },
  ];

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Header and horizontal scroll per section */}
      {cardSections.map((range, idx) => (
        <React.Fragment key={idx}>
          {/* Static Header and Description */}
          <section className="w-screen bg-black px-10 py-16 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{range.title}</h2>
            <p className="text-white text-lg max-w-2xl mx-auto">{range.description}</p>
          </section>

          {/* Horizontal Scroll Section */}
          <section
            ref={(el) => (gallerySections.current[idx] = el)}
            className="relative h-screen w-screen overflow-hidden bg-black p-10"
          >
            <div
              ref={(el) => (galleries.current[idx] = el)}
              className="flex h-full gap-20 rounded-lg"
            >
              {Array.from({ length: range.end - range.start + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="card flex-shrink-0 w-1/4 h-full bg-[#800020] flex flex-col items-center justify-center text-white text-center p-4 rounded-lg"
                >
                  <h2 className="text-3xl font-bold mb-2">Card {range.start + i}</h2>
                  <p className="text-base">Description for card {range.start + i}</p>
                </div>
              ))}
            </div>
          </section>
        </React.Fragment>
      ))}

      {/* Full-page “Thank You” */}
      <section className="h-screen w-screen flex items-center justify-center bg-black">
        <h1 className="text-white text-6xl font-extrabold">Thank&nbsp;You</h1>
      </section>
    </div>
  );
} 
