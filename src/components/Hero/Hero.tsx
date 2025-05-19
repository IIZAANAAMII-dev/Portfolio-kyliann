import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée
  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 1 },
      onComplete: () => {
        // Animation de flottement continue pour le CTA
        if (ctaRef.current) {
          gsap.to(ctaRef.current, {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    });

    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
    .fromTo(
      subheadingRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    )
    .fromTo(
      ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.5'
    );

    // Animation au défilement
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        y: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animation au survol du bouton
  const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleHoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <section 
      ref={heroRef}
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 pt-20"
    >
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-200/30"
            style={{
              width: Math.random() * 300 + 50 + 'px',
              height: Math.random() * 300 + 50 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              filter: 'blur(40px)',
              opacity: 0.6
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            ref={headingRef} 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Bonjour, je suis <span className="text-indigo-600">Kylian</span>
          </h1>
          
          <p 
            ref={subheadingRef} 
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Développeur Full Stack passionné par la création d'expériences web exceptionnelles
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onMouseEnter={handleHover}
              onMouseLeave={handleHoverOut}
              className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              Voir mes projets
            </button>
            <button
              onMouseEnter={handleHover}
              onMouseLeave={handleHoverOut}
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Télécharger mon CV
            </button>
          </div>
        </div>
      </div>

      {/* Flèche de défilement */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
