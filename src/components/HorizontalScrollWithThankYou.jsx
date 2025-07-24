import React, { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------
 * ASSETS
 * ----------------------------------------------------------------*/
import handImage from "../assets/fixed-hand.png";
import screen1 from "../assets/1-page-1.png";
import screen2 from "../assets/1-page-2.png";
import screen3 from "../assets/1-page-3.png";
import screen4 from "../assets/1-page-4.png";

/* ------------------------------------------------------------------
 * REGISTER GSAP PLUGIN
 * ----------------------------------------------------------------*/
gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScrollWithThankYou() {
  const containerRef = useRef(null);

  /* ---------- refs for horizontal card galleries ---------- */
  const galleries = useRef([]);
  const gallerySections = useRef([]);

  /* ---------- refs for thank‑you progressive text ---------- */
  const thankYouRef = useRef(null);
  const lineRefs = useRef([]);
  const charsRef = useRef([]);

  /* ---------- refs for review section ---------- */
  const reviewRef = useRef(null);
  const reviewTrackRef = useRef(null);
  const reviewItemsRef = useRef([]);

  /* ---------- refs for DEVICE (hand + changing screens) ----- */
  const deviceSectionRef = useRef(null);
  const screenImgRef = useRef(null);
  const textTrackRef = useRef(null);
  const textCardsRef = useRef([]);
  const screenWrapperRef = useRef(null);
  const screenRefs = useRef([]);
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
   * DATA DEFINITIONS
   * ----------------------------------------------------------------*/
  const cardSections = [
    { start: 1, end: 7, title: "First Card Section", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { start: 10, end: 17, title: "Second Card Section", description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { start: 20, end: 27, title: "Third Card Section", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi." },
  ];

  const reviews = [
    { name: "Alice", text: "Amazing experience! Highly recommended." },
    { name: "Bob", text: "The team was professional and supportive." },
    { name: "Charlie", text: "Absolutely loved the workflow and delivery." },
    { name: "Dana", text: "Reliable, efficient, and friendly support!" },
  ];

  const deviceScreens = [screen1, screen2, screen3, screen4];
  const deviceTexts = [
    { heading: "Connect", para: "Instantly sync across devices." },
    { heading: "Discover", para: "Explore curated content daily." },
    { heading: "Create", para: "Build your own playlists easily." },
    { heading: "Share", para: "Send moments with one tap." },
  ];
  const thankYouText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit.";

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


useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalSteps = deviceScreens.length - 1;
      const scrollDistance = 1000; // you can calculate based on card width and gap if needed

      gsap.set(screenRefs.current, { x: "100%", opacity: 0 });
      gsap.set(screenRefs.current[0], { x: "0%", opacity: 1 });

      let previousIndex = 0;

      ScrollTrigger.create({
        trigger: deviceSectionRef.current,
        start: "top top",
        end: `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const step = Math.round(self.progress * totalSteps);
          if (step !== previousIndex) {
            const from = screenRefs.current[previousIndex];
            const to = screenRefs.current[step];
            const direction = step > previousIndex ? 1 : -1;

            if (from && to) {
              gsap.set(to, { x: `${100 * direction}%`, opacity: 1 });
              gsap.to(from, { x: `${-100 * direction}%`, opacity: 0, duration: 0.5 });
              gsap.to(to, { x: "0%", duration: 0.5 });
            }

            // Update text cards
            const leftCard = textCardsRef.current[0];
            const rightCard = textCardsRef.current[1];

            if (deviceTexts[step - 1]) {
              const h3 = leftCard && leftCard.querySelector("h3");
              const p = leftCard && leftCard.querySelector("p");
              if (h3) h3.textContent = deviceTexts[step - 1].heading;
              if (p) p.textContent = deviceTexts[step - 1].para;
              gsap.to(leftCard, { opacity: 0.3, duration: 0.3 });
            } else {
              gsap.to(leftCard, { opacity: 0, duration: 0.3 });
            }

            const h3Right = rightCard && rightCard.querySelector("h3");
            const pRight = rightCard && rightCard.querySelector("p");
            if (h3Right) h3Right.textContent = deviceTexts[step].heading;
            if (pRight) pRight.textContent = deviceTexts[step].para;
            gsap.to(rightCard, { opacity: 1, duration: 0.3 });

            previousIndex = step;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);
  return (
    <div ref={containerRef} className="overflow-x-hidden bg-[#090113]">
      {/* Other sections stay the same */}

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

      {/* ---------- DEVICE SHOWCASE SECTION ---------- */}
   <section
  ref={deviceSectionRef}
  className="h-screen w-screen bg-[#2E0435] relative overflow-visible"
>
  <div className="relative w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:px-0 gap-y-10">
    
    {/* Left card - on small screens will appear on top */}
    <div className="flex justify-center lg:justify-end lg:pr-12 order-1 lg:order-none">
      <div
        className="w-full sm:w-[300px] text-center lg:text-right opacity-30"
        ref={(el) => (textCardsRef.current[0] = el)}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white/50">Connect</h3>
        <p className="text-sm sm:text-base text-white/30">Instantly sync across devices.</p>
      </div>
    </div>

    {/* Phone with screen - centered */}
    <div className="relative z-10 order-3 lg:order-none flex justify-center">
      <div className="relative w-fit">
        <img src={handImage} className="w-[250px] sm:w-[400px] lg:w-[500px] mt-[40%] sm:mt-[40%] object-contain mx-auto" />
        
        <div
          ref={screenWrapperRef}
          className="absolute top-[5%] left-[17.5%] w-[65%] sm:w-[40%] lg:w-[40%] h-[90%] overflow-hidden rounded-xl z-30"
        >
          {deviceScreens.map((src, i) => (
            <img
              key={i}
              ref={(el) => (screenRefs.current[i] = el)}
              src={src}
              className="absolute w-full h-screen mt-[110%] object-cover rounded-xl"
              alt="screen"
            />
          ))}
        </div>
      </div>
    </div>

    {/* Right card - on small screens will appear below */}
    <div className="flex justify-center lg:justify-start lg:pl-12 order-2 lg:order-none">
      <div
        className="w-full sm:w-[300px] text-center lg:text-left"
        ref={(el) => (textCardsRef.current[1] = el)}
      >
        <h3 className="text-lg sm:text-xl font-bold text-white">Discover</h3>
        <p className="text-sm sm:text-base text-white/80">Explore curated content daily.</p>
      </div>
    </div>
  </div>
</section>

       {/* ---------- END SECTION ---------- */}
      <section className="h-screen w-screen flex items-center justify-center bg-black">
        <h1 className="text-white text-6xl font-extrabold">The End</h1>
      </section>
    </div>
  );
}
