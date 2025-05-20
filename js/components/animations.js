// Initialisation des animations GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si GSAP est chargé
    if (typeof gsap !== 'undefined') {
        // Enregistrer les plugins GSAP
        gsap.registerPlugin(ScrollTrigger);
        
        // Animation d'entrée pour les sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            // Ignorer la section hero pour une animation personnalisée
            if (section.classList.contains('hero')) return;
            
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
            
            // Animation des titres de section
            const title = section.querySelector('.section-title');
            if (title) {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: 'power3.out'
                });
            }
            
            // Animation des sous-titres de section
            const subtitle = section.querySelector('.section-subtitle');
            if (subtitle) {
                gsap.from(subtitle, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    },
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.1,
                    ease: 'power3.out'
                });
            }
        });
        
        // Animation des cartes de projet
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Animation des compétences
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item.closest('.skills-section'),
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                },
                x: index % 2 === 0 ? -30 : 30,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Animation du formulaire de contact
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            gsap.from(contactForm, {
                scrollTrigger: {
                    trigger: contactForm,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out'
            });
        }
        
        // Animation des éléments d'information de contact
        const contactInfoItems = document.querySelectorAll('.contact-info-item');
        contactInfoItems.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item.closest('.contact-section'),
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                },
                x: -30,
                opacity: 0,
                duration: 0.8,
                delay: 0.1 * index,
                ease: 'power3.out'
            });
        });
        
        // Animation des icônes de réseaux sociaux
        const socialIcons = document.querySelectorAll('.social-link');
        socialIcons.forEach((icon, index) => {
            gsap.from(icon, {
                scrollTrigger: {
                    trigger: icon.closest('.contact-info'),
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                    once: true
                },
                y: 20,
                opacity: 0,
                duration: 0.5,
                delay: 0.1 * index,
                ease: 'back.out'
            });
        });
    }
});

// Animation de la section hero
function initHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    
    // Réinitialiser les styles pour l'animation
    gsap.set([heroContent, heroTitle, heroSubtitle, heroDescription, heroCta], { opacity: 0, y: 30 });
    
    // Animation de la section hero
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.to(heroContent, { opacity: 1, y: 0, duration: 1 })
      .to(heroTitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.8')
      .to(heroSubtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to(heroDescription, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to(heroCta, { opacity: 1, y: 0, duration: 0.8, onComplete: () => {
          // Animation du bouton CTA
          gsap.to(heroCta, {
              y: -10,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
          });
      }}, '-=0.6');
    
    return tl;
}

// Initialiser les animations après le chargement complet
window.addEventListener('loading-complete', () => {
    // Démarrer l'animation de la section hero
    if (document.querySelector('.hero')) {
        initHeroAnimation();
    }
    
    // Initialiser d'autres animations si nécessaire
});

// Exporter les fonctions pour une utilisation externe si nécessaire
export { initHeroAnimation };
