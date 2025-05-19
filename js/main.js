// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser GSAP avec ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animation de chargement
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            // Animer l'entrée de la hero section
            animateHeroSection();
        }, 1000);
    });
    
    // Animer la hero section au chargement
    function animateHeroSection() {
        const heroTimeline = gsap.timeline();
        
        // Animer les éléments de la hero section
        heroTimeline
            .from('.hero-title', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from('.hero-subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.hero-description', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.hero-btns', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.4')
            .from('.hero-image', {
                x: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-shape', {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.6')
            .from('.scroll-down', {
                y: -20,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.2');
    }
    
    // Animation de la hero section au scroll
    gsap.to('.hero-text', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0.5,
        ease: 'none'
    });
    
    // Animation du modèle Spline au scroll
    document.addEventListener('DOMContentLoaded', () => {
        // Attendre que le viewer Spline soit chargé
        const splineViewer = document.querySelector('spline-viewer');
        if (splineViewer) {
            splineViewer.addEventListener('load', () => {
                // Une fois chargé, on peut manipuler le modèle avec ScrollTrigger
                ScrollTrigger.create({
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    onUpdate: (self) => {
                        // Rotation du modèle basée sur le défilement
                        if (splineViewer.spline) {
                            splineViewer.spline.setRotation(0, self.progress * 360, 0);
                        }
                    }
                });
            });
        }
    });
    
    // Animation des formes en arrière-plan au scroll
    gsap.to('.hero-shape-1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        x: -50,
        y: 50,
        rotation: -10,
        ease: 'none'
    });
    
    gsap.to('.hero-shape-2', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        x: 50,
        y: 100,
        rotation: 10,
        ease: 'none'
    });
    
    // Animation de l'indicateur de défilement
    gsap.to('.mouse-wheel', {
        y: 5,
        opacity: 0.5,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'power2.inOut'
    });
    
    // Animation des sections au scroll
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        // Animer le titre de la section
        gsap.from(section.querySelector('.section-title'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Animer le contenu de la section
        const contentElements = section.querySelectorAll('.about-image, .about-text, .skills-box');
        gsap.from(contentElements, {
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });
    
    // Animation des barres de progression des compétences
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') + '%';
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            width: width,
            duration: 1.5,
            ease: 'power3.out'
        });
    });
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header sticky et changement de couleur au scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mise à jour du lien actif dans la navigation
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Animation du texte avec Typed.js (si disponible)
    if (typeof Typed !== 'undefined') {
        new Typed('.typed-text', {
            strings: ['Web', 'Frontend', 'JavaScript', 'GSAP'],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
            loop: true
        });
    }
});
