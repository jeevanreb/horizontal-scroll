import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollWithThankYou() {
  const containerRef = useRef(null);

  /* ---------- refs for card sections ---------- */
  const galleries = useRef([]);
  const gallerySections = useRef([]);

  /* ---------- refs for animated “thank-you” text ---------- */
  const charsRef = useRef([]); // nested [line][char] array
  const thankYouRef = useRef(null);
  const lineRefs   = useRef([]);

  /* ---------- refs for review section ---------- */
  const reviewRef       = useRef(null);   // section wrapper
  const reviewTrackRef  = useRef(null);   // flex track that slides
  const reviewItemsRef  = useRef([]);     // actual review cards (no placeholder)

  /* ------------------------------------------------------------------
   * CONFIG DATA
   * ----------------------------------------------------------------*/
  const cardSections = [
    { start: 1,  end: 7,  title: "First Card Section",  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { start: 10, end: 17, title: "Second Card Section", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { start: 20, end: 27, title: "Third Card Section",  description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi." },
  ];

  const reviews = [
    { name: "Alice",   text: "Amazing experience! Highly recommended.Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { name: "Bob",     text: "The team was professional and supportive.Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { name: "Charlie", text: "Absolutely loved the workflow and delivery.Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { name: "Dana",    text: "Reliable, efficient, and friendly support.Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  ];

  const thankYouText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit.";

  /* ------------------------------------------------------------------
   * 1️⃣  Horizontal scrolling card galleries
   * ----------------------------------------------------------------*/
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gallerySections.current.forEach((section, i) => {
        const gallery = galleries.current[i];
        if (!gallery || !section) return;

        const scrollDistance = gallery.scrollWidth - window.innerWidth;

        gsap.to(gallery, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: true,
            pin: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * 2️⃣  Progressive reveal for “Thank You” text
   * ----------------------------------------------------------------*/
  useEffect(() => {
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((lineEl, lineIndex) => {
        if (!lineEl || !charsRef.current[lineIndex]) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: lineEl,
            start: "top 95%",
            end:   "top 65%",
            scrub: true,
          },
        });

        tl.to(charsRef.current[lineIndex], {
          color: "#ffffff",
          stagger: 0.15,
          ease: "none",
        });
      });
    }, thankYouRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * 3️⃣  Review carousel – two-card viewport (center & right)
   *     Leftmost column acts as a greyed-out history
   * ----------------------------------------------------------------*/
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track   = reviewTrackRef.current;
      const cards   = reviewItemsRef.current;
      if (!track || cards.length === 0) return;

      const cardWidth = cards[0].offsetWidth; // includes padding
      const gap       = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 32; // gap-8 ≈ 32px

      // 👉 Add a placeholder (blank column) at the beginning so that the
      //    first real review appears in the centre column on load.
      gsap.set(track, { x: 0 });

      const totalShift = reviews.length - 2; // number of scroll steps
      const distance   = (cardWidth + gap) * totalShift;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: reviewRef.current,
          start: "top top",
          end:   `+=${distance}`,
          scrub: true,
          pin: true,
        },
        onUpdate: self => {
          const offset = -gsap.getProperty(track, "x");
          const shift  = Math.round(offset / (cardWidth + gap));

          // Set opacity: any card that has fully passed the centre
          // (i.e., now in the left column) becomes light grey.
          cards.forEach((card, idx) => {
            gsap.set(card, { opacity: idx < shift ? 0.4 : 1 });
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * JSX
   * ----------------------------------------------------------------*/
  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* ---------- Card Galleries ---------- */}
      {cardSections.map((range, idx) => (
        <React.Fragment key={idx}>
          {/* Static header / description */}
          <section className="w-screen bg-black px-10 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {range.title}
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              {range.description}
            </p>
          </section>

          {/* Horizontal scroll area */}
          <section
            ref={el => (gallerySections.current[idx] = el)}
            className="relative h-screen w-screen overflow-hidden bg-black p-10"
          >
            <div
              ref={el => (galleries.current[idx] = el)}
              className="flex h-full gap-18 rounded-lg pr-10"
            >
              {Array.from({ length: range.end - range.start + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-full bg-[#800020] flex flex-col items-center justify-center text-white p-4 rounded-lg w-1/4"
                >
                  <h3 className="text-2xl font-bold mb-2">
                    Card {range.start + i}
                  </h3>
                  <p>Description for card {range.start + i}</p>
                </div>
              ))}
            </div>
          </section>
        </React.Fragment>
      ))}

      {/* ---------- Animated “Thank You” Text ---------- */}
      <section className="h-screen w-screen flex items-center justify-center bg-black">
        <h1
          ref={thankYouRef}
          className="text-4xl lg:text-6xl font-extrabold text-center leading-snug p-10"
        >
          {thankYouText.split("\n").map((line, lineIndex) => (
            <span
              key={lineIndex}
              ref={el => (lineRefs.current[lineIndex] = el)}
              className="block overflow-hidden"
            >
              {line.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  ref={el => {
                    if (!charsRef.current[lineIndex]) charsRef.current[lineIndex] = [];
                    charsRef.current[lineIndex][charIndex] = el;
                  }}
                  className="inline-block text-white/20"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </section>

      {/* ---------- Review Section (They Said) ---------- */}
            <section ref={reviewRef} className="h-screen w-screen bg-white text-black py-20 px-10">
        <div className="relative h-40 mb-16">
          <h2 className="absolute left-[20%] top-0 text-[7rem] font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            They
          </h2>
          <h2 className="absolute left-[60%] top-[60%] text-[7rem] font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Said
          </h2>
        </div>

        <div className="relative overflow-hidden flex justify-center">
          <div ref={reviewTrackRef} className="flex gap-8">
            {/* Invisible placeholder for left column */}
            <div className="w-1/3 flex-shrink-0" aria-hidden="true" />

            {reviews.map((review, i) => (
              <div
                key={i}
                ref={el => (reviewItemsRef.current[i] = el)}
                className="w-1/3 flex-shrink-0 p-6 mt-10"
              >
                <h3 className="text-xl font-semibold mb-2 text-center">{review.name}</h3>
                <p className="text-gray-700 text-center">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- End Section ---------- */}
      <section className="h-screen w-screen flex items-center justify-center bg-black">
        <h1 className="text-white text-6xl font-extrabold">The End</h1>
      </section>
    </div>
  );
}
