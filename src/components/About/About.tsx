import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      defaults: { ease: 'power3.out', duration: 1 }
    });

    tl.fromTo(
      imageRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      contentRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      '.skill-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      },
      '-=0.4'
    );

    // Animation des barres de compétences au défilement
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
      gsap.to(bar, {
        width: bar.getAttribute('data-width'),
        scrollTrigger: {
          trigger: bar,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration: 1.5,
        ease: 'power3.out'
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const skills = [
    { name: 'React', level: '90%' },
    { name: 'TypeScript', level: '85%' },
    { name: 'Node.js', level: '80%' },
    { name: 'CSS/SCSS', level: '85%' },
    { name: 'UI/UX Design', level: '75%' },
  ];

  return (
    <section 
      ref={sectionRef} 
      id="apropos"
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            À <span className="text-indigo-600">propos</span> de moi
          </h2>
          <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Photo de profil */}
          <div 
            ref={imageRef}
            className="w-full lg:w-1/3 relative group"
          >
            <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 mix-blend-overlay opacity-30"></div>
              <img 
                src="https://via.placeholder.com/400x500" 
                alt="Kylian" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-indigo-600 rounded-xl -z-10 group-hover:rotate-2 transition-transform duration-500"></div>
          </div>

          {/* Contenu */}
          <div ref={contentRef} className="w-full lg:w-2/3">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Développeur Full Stack Passionné
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Je m'appelle Kylian et je suis un développeur Full Stack passionné par la création d'applications web modernes et performantes. Avec plus de 5 ans d'expérience dans le développement web, j'ai travaillé sur divers projets allant des sites vitrines aux applications web complexes.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Mon objectif est de créer des expériences utilisateur exceptionnelles tout en écrivant un code propre, maintenable et évolutif. Je suis constamment à la recherche de nouvelles technologies et de meilleures pratiques pour améliorer mes compétences.
            </p>

            {/* Compétences */}
            <div ref={skillsRef} className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-800">Mes compétences</h4>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="skill-progress bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full" 
                        data-width={skill.level}
                        style={{ width: 0 }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton */}
            <div className="mt-10">
              <a 
                href="#contact" 
                className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
