import React, { useEffect, useState } from 'react';

const ScrollingSections = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Define scroll trigger points
  const section1Trigger = sectionHeight;
  const section2Trigger = section1Trigger + sectionHeight;
  const section3Trigger = section2Trigger + sectionHeight;
  const section4Trigger = section3Trigger + sectionHeight;
  const allSectionsEnd = section4Trigger + sectionHeight;

  // Container for all animated sections - starts moving immediately
  const getContainerStyles = () => {
    if (scrollY < sectionHeight) {
      // Container slides up as user scrolls from the very beginning
      const progress = scrollY / sectionHeight;
      return {
        position: 'fixed',
        top: '0',
        transform: `translateY(${100 - progress * 100}vh)`,
      };
    } else if (scrollY >= sectionHeight && scrollY < allSectionsEnd) {
      // Container is fully in view
      return {
        position: 'fixed',
        top: '0',
        transform: 'translateY(0)',
      };
    } else {
      // Moving up with final section
      const exitProgress = Math.min(1, (scrollY - allSectionsEnd) / sectionHeight);
      return {
        position: 'fixed',
        top: '0',
        transform: `translateY(${-exitProgress * 100}vh)`,
      };
    }
  };

  // Section 1 - always visible in container
  const getSection1Transform = () => {
    return 'translateY(0)';
  };

  // Section 2 slides over section 1
  const getSection2Transform = () => {
    if (scrollY < section2Trigger - sectionHeight * 0.3) {
      return 'translateY(100vh)';
    } else if (scrollY < section2Trigger) {
      const progress = (scrollY - (section2Trigger - sectionHeight * 0.3)) / (sectionHeight * 0.3);
      return `translateY(${100 - progress * 100}vh)`;
    }
    return 'translateY(0)';
  };

  // Section 3 slides over section 2
  const getSection3Transform = () => {
    if (scrollY < section3Trigger - sectionHeight * 0.3) {
      return 'translateY(100vh)';
    } else if (scrollY < section3Trigger) {
      const progress = (scrollY - (section3Trigger - sectionHeight * 0.3)) / (sectionHeight * 0.3);
      return `translateY(${100 - progress * 100}vh)`;
    }
    return 'translateY(0)';
  };

  // Section 4 slides over section 3
  const getSection4Transform = () => {
    if (scrollY < section4Trigger - sectionHeight * 0.3) {
      return 'translateY(100vh)';
    } else if (scrollY < section4Trigger) {
      const progress = (scrollY - (section4Trigger - sectionHeight * 0.3)) / (sectionHeight * 0.3);
      return `translateY(${100 - progress * 100}vh)`;
    }
    return 'translateY(0)';
  };

  // Header visibility - fades in as container rises
  const headerOpacity = Math.min(1, scrollY / (sectionHeight * 0.5));

  const containerStyles = getContainerStyles();

  return (
    <div className="relative bg-gradient-to-b from-white to-black">
      {/* Start Section */}

      {/* All Sections Container */}
      <div 
        className="w-full h-screen transition-transform duration-100 ease-linear"
        style={{
          ...containerStyles,
          zIndex: 10,
          willChange: 'transform'
        }}
      >
        {/* Header - Fades in as sections appear */}
        <div 
          className="absolute top-0 left-0 w-full h-20 flex items-center justify-center text-3xl font-bold text-white transition-opacity duration-300"
          style={{ 
            zIndex: 100,
            // textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            opacity: headerOpacity
          }}
        >
          <span className="tracking-wider">SECTIONS SHOWCASE</span>
        </div>

        {/* Section 1 - Always visible in container */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center"
          style={{ 
            zIndex: 20,
            transform: getSection1Transform()
          }}
        >
          <div className="text-center text-white px-8">
            <h2 className="text-6xl font-bold mb-4">Section 1</h2>
            <p className="text-2xl opacity-90">First layer of content</p>
            <p className="text-lg mt-4 opacity-75">Slides up from bottom</p>
          </div>
        </div>

        {/* Section 2 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ 
            zIndex: 30,
            transform: getSection2Transform(),
            willChange: 'transform'
          }}
        >
          <div className="text-center text-white px-8">
            <h2 className="text-6xl font-bold mb-4">Section 2</h2>
            <p className="text-2xl opacity-90">Overlays the first</p>
            <p className="text-lg mt-4 opacity-75">Creating depth</p>
          </div>
        </div>

        {/* Section 3 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ 
            zIndex: 40,
            transform: getSection3Transform(),
            willChange: 'transform'
          }}
        >
          <div className="text-center text-white px-8">
            <h2 className="text-6xl font-bold mb-4">Section 3</h2>
            <p className="text-2xl opacity-90">Building momentum</p>
            <p className="text-lg mt-4 opacity-75">Smooth transitions</p>
          </div>
        </div>

        {/* Section 4 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ 
            zIndex: 50,
            transform: getSection4Transform(),
            willChange: 'transform'
          }}
        >
          <div className="text-center text-white px-8">
            <h2 className="text-6xl font-bold mb-4">Section 4</h2>
            <p className="text-2xl opacity-90">Grand finale</p>
            <p className="text-lg mt-4 opacity-75">Ready to exit together</p>
          </div>
        </div>
      </div>

      {/* Spacer for scroll */}
      <div style={{ height: `${allSectionsEnd + sectionHeight}px` }} />
    </div>
  );
};

export default ScrollingSections;