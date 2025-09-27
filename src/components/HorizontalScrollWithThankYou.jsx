import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import hand from "../assets/fixed-hand.png";
import screen1 from "../assets/1-page-1.png";
import screen2 from "../assets/1-page-2.png";
import screen3 from "../assets/1-page-3.png";
import screen4 from "../assets/1-page-4.png";

gsap.registerPlugin(ScrollTrigger);

const ScrollTextImage = () => {
  const containerRef = useRef(null);
  const textTrackRef = useRef(null);
  const [step, setStep] = useState(0);

  const texts = [
    "Welcome to SwipeWire",
    "Seamless Integration",
    "Beautiful Design Awaits",
  ];

  const images = [screen1, screen2, screen3];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const totalSteps = texts.length;

      gsap.to(textTrackRef.current, {
        xPercent: -100 * (totalSteps - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerWidth * totalSteps}`,
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const newStep = Math.round(self.progress * (totalSteps - 1));
            setStep(newStep);
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#2E0435]"
    >
      {/* Fixed Hand Image */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <img src={hand} alt="Hand" className="w-[400px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={images[step]}
            alt="Screen"
            className="w-[150px] h-[300px] object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Text Track Sliding from Right to Left */}
      <div
        ref={textTrackRef}
        className="absolute top-1/2 -translate-y-1/2 right-0 flex w-[300vw] z-10"
      >
        {texts.map((text, index) => (
          <div
            key={index}
            className="w-screen flex items-center justify-center px-12 text-white text-4xl font-bold"
          >
            {text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollTextImage;
