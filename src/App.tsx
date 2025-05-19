import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

// Styles globaux
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const appRef = useRef<HTMLDivElement>(null);

  // Animation globale au chargement
  useEffect(() => {
    // Désactiver le défilement initial
    document.body.style.overflow = 'hidden';

    // Animation d'entrée globale
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = 'auto';
      }
    });

    tl.fromTo(
      appRef.current,
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      }
    );

    // Nettoyage
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div ref={appRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Projects />
                <Contact />
              </>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
