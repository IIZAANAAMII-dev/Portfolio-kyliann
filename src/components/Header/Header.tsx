import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Header.css';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée du header
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.from(header, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });
  }, []);

  // Animation du menu mobile
  const toggleMenu = () => {
    if (!navRef.current) return;
    
    if (!isMenuOpen) {
      gsap.to(navRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
        onStart: () => {
          if (navRef.current) {
            navRef.current.style.display = 'block';
          }
        }
      });
    } else {
      gsap.to(navRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (navRef.current) {
            navRef.current.style.display = 'none';
          }
        }
      });
    }
    
    setIsMenuOpen(!isMenuOpen);
  };

  // Animation des liens de navigation au survol
  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: -2,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleHoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  return (
    <header 
      ref={headerRef}
      className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            onMouseEnter={handleHover}
            onMouseLeave={handleHoverOut}
          >
            Kylian
          </Link>
          
          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8">
            {['Accueil', 'À Propos', 'Projets', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase().replace(' ', '')}`}
                className="text-gray-700 hover:text-indigo-600 transition-colors relative group"
                onMouseEnter={handleHover}
                onMouseLeave={handleHoverOut}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          
          {/* Bouton Menu Mobile */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Menu Mobile */}
        <div 
          ref={navRef}
          className="md:hidden h-0 opacity-0 overflow-hidden"
          style={{ display: 'none' }}
        >
          <nav className="flex flex-col space-y-4 py-4">
            {['Accueil', 'À Propos', 'Projets', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase().replace(' ', '')}`}
                className="text-gray-700 hover:text-indigo-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
