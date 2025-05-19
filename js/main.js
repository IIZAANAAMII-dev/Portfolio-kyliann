// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser GSAP avec ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Variable pour suivre l'état de l'animation Spline
    let splineAnimationComplete = false;
    let isScrolling = false;
    let canScrollToNext = false;
    
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
    
    // Système de défilement contrôlé pour terminer l'animation Spline avant de passer à la section suivante
    const setupSplineScrollSystem = () => {
        const splineViewer = document.querySelector('spline-viewer');
        const heroSection = document.querySelector('.hero');
        const aboutSection = document.querySelector('#apropos');
        
        if (!splineViewer || !heroSection || !aboutSection) return;

        // Masquer le loader une fois Spline chargé
        splineViewer.addEventListener('load', () => {
            const loader = document.querySelector('.loader');
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
            
            // Animation initiale du contenu superposé
            gsap.from('.hero-overlay-content', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.5
            });
            
            // Empêcher le défilement normal
            let scrollTimeout;
            let lastScrollTop = 0;
            let animationProgress = 0;
            const animationDuration = 1.5; // Durée en secondes
            let isAnimating = false;
            
            window.addEventListener('wheel', function(e) {
                if (isAnimating) {
                    e.preventDefault();
                    return false;
                }
                
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Si on est dans la section hero et qu'on défile vers le bas
                if (scrollTop <= heroSection.offsetHeight && e.deltaY > 0) {
                    e.preventDefault();
                    
                    // Démarrer l'animation Spline si ce n'est pas déjà en cours
                    if (!isAnimating) {
                        isAnimating = true;
                        
                        // Animer le contenu pour qu'il disparaisse
                        gsap.to('.hero-overlay-content', {
                            y: -50,
                            opacity: 0,
                            duration: animationDuration / 2,
                            ease: 'power1.in'
                        });
                        
                        // Animation du modèle Spline
                        let startTime = null;
                        
                        function animateSpline(timestamp) {
                            if (!startTime) startTime = timestamp;
                            
                            const elapsed = timestamp - startTime;
                            animationProgress = Math.min(elapsed / (animationDuration * 1000), 1);
                            
                            // Animer la rotation et le zoom du modèle
                            try {
                                if (splineViewer.spline) {
                                    splineViewer.spline.setRotation(0, animationProgress * 360, 0);
                                    const scale = 1 - (animationProgress * 0.3);
                                    splineViewer.spline.setScale(scale, scale, scale);
                                }
                            } catch (e) {
                                console.log('Erreur pendant l\'animation:', e);
                            }
                            
                            if (animationProgress < 1) {
                                requestAnimationFrame(animateSpline);
                            } else {
                                // Animation terminée, défiler vers la section suivante
                                setTimeout(() => {
                                    window.scrollTo({
                                        top: aboutSection.offsetTop,
                                        behavior: 'smooth'
                                    });
                                    
                                    // Réinitialiser l'état
                                    setTimeout(() => {
                                        isAnimating = false;
                                        animationProgress = 0;
                                    }, 1000);
                                }, 200);
                            }
                        }
                        
                        requestAnimationFrame(animateSpline);
                    }
                    
                    return false;
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, { passive: false });
            
            // Gérer les événements tactiles pour les appareils mobiles
            let touchStartY = 0;
            
            window.addEventListener('touchstart', function(e) {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            window.addEventListener('touchmove', function(e) {
                if (isAnimating) {
                    e.preventDefault();
                    return false;
                }
                
                const touchY = e.touches[0].clientY;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Détection de glissement vers le haut (touchStartY > touchY)
                if (scrollTop <= heroSection.offsetHeight && touchStartY > touchY) {
                    e.preventDefault();
                    
                    // Même logique que pour l'événement wheel
                    if (!isAnimating) {
                        // Déclencher la même animation que pour la souris
                        isAnimating = true;
                        
                        // Animer le contenu pour qu'il disparaisse
                        gsap.to('.hero-overlay-content', {
                            y: -50,
                            opacity: 0,
                            duration: animationDuration / 2,
                            ease: 'power1.in'
                        });
                        
                        // Animation du modèle Spline
                        let startTime = null;
                        
                        function animateSpline(timestamp) {
                            if (!startTime) startTime = timestamp;
                            
                            const elapsed = timestamp - startTime;
                            animationProgress = Math.min(elapsed / (animationDuration * 1000), 1);
                            
                            // Animer la rotation et le zoom du modèle
                            try {
                                if (splineViewer.spline) {
                                    splineViewer.spline.setRotation(0, animationProgress * 360, 0);
                                    const scale = 1 - (animationProgress * 0.3);
                                    splineViewer.spline.setScale(scale, scale, scale);
                                }
                            } catch (e) {
                                console.log('Erreur pendant l\'animation:', e);
                            }
                            
                            if (animationProgress < 1) {
                                requestAnimationFrame(animateSpline);
                            } else {
                                // Animation terminée, défiler vers la section suivante
                                setTimeout(() => {
                                    window.scrollTo({
                                        top: aboutSection.offsetTop,
                                        behavior: 'smooth'
                                    });
                                    
                                    // Réinitialiser l'état
                                    setTimeout(() => {
                                        isAnimating = false;
                                        animationProgress = 0;
                                    }, 1000);
                                }, 200);
                            }
                        }
                        
                        requestAnimationFrame(animateSpline);
                    }
                    
                    return false;
                }
            }, { passive: false });
        });
    };
    
    // Appeler cette fonction après le chargement de la page
    setupSplineScrollSystem();
    
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
    
        // Configuration améliorée du défilement horizontal avec ScrollSmoother et Observer
    const setupEnhancedScroll = () => {
        // Références aux éléments
        const heroSection = document.querySelector('.hero');
        const horizontalContainer = document.querySelector('.horizontal-container');
        const horizontalSections = document.querySelectorAll('.horizontal-section');
        
        if (!heroSection || !horizontalContainer || horizontalSections.length === 0) return;
        
        // Variables d'état
        let currentSection = -1; // -1 signifie qu'on est sur la hero, 0 = première section horizontale, etc.
        let isAnimating = false;
        let isHorizontalActive = false;
        let horizontalScrollSmoother;
        
        // Préparer les sections horizontales (cachées initialement)
        gsap.set(horizontalSections, {
            opacity: 0,
            xPercent: 100, // position hors écran à droite
            force3D: true // améliore les performances WebGL
        });
        
        // Créer un Observer pour surveiller la fin de la section hero
        Observer.create({
            target: heroSection,
            type: "scroll",
            onUp: () => {
                // Retour vers la hero section si on est à la première section horizontale
                if (currentSection === 0 && isHorizontalActive) {
                    exitHorizontalMode();
                }
            },
            onDown: () => {
                // Entrer en mode horizontal lorsqu'on dépasse la hero section
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                if (heroBottom <= 0 && !isHorizontalActive && !isAnimating) {
                    enterHorizontalMode();
                }
            }
        });
        
        // Fonction pour entrer en mode défilement horizontal
        function enterHorizontalMode() {
            if (isAnimating || isHorizontalActive) return;
            isAnimating = true;
            
            // Animation du modèle Spline avant la transition
            const splineViewer = document.querySelector('spline-viewer');
            if (splineViewer && splineViewer.spline) {
                // Animer la disparition du contenu de la hero
                gsap.to('.hero-overlay-content', {
                    y: -50,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
                
                // Animation du modèle Spline
                const animationDuration = 1.5;
                let startTime = null;
                let animationProgress = 0;
                
                function animateSpline(timestamp) {
                    if (!startTime) startTime = timestamp;
                    
                    const elapsed = timestamp - startTime;
                    animationProgress = Math.min(elapsed / (animationDuration * 1000), 1);
                    
                    try {
                        // Rotation et zoom du modèle Spline
                        splineViewer.spline.setRotation(0, animationProgress * 360, 0); // Rotation complète
                        const scale = 1 - (animationProgress * 0.4);
                        splineViewer.spline.setScale(scale, scale, scale);
                    } catch (e) {
                        console.log('Erreur pendant l\'animation Spline:', e);
                    }
                    
                    if (animationProgress < 1) {
                        requestAnimationFrame(animateSpline);
                    } else {
                        // Animation Spline terminée, activer le défilement horizontal
                        setTimeout(() => {
                            activateHorizontalScrolling();
                        }, 300);
                    }
                }
                
                requestAnimationFrame(animateSpline);
            } else {
                // Si pas de Spline, activer directement le défilement horizontal
                activateHorizontalScrolling();
            }
        }
        
        // Activer le défilement horizontal et préparer la première section
        function activateHorizontalScrolling() {
            // Fixer la position de la page pour éviter le scroll vertical
            document.body.style.overflow = 'hidden';
            
            // Préparer toutes les sections horizontales
            horizontalSections.forEach((section, index) => {
                if (index === 0) {
                    // La première section est prête à entrer
                    gsap.set(section, {
                        opacity: 0,
                        xPercent: 100,
                        visibility: 'visible'
                    });
                } else {
                    // Les autres sections sont positionnées hors écran à droite
                    gsap.set(section, {
                        opacity: 0,
                        xPercent: 100,
                        visibility: 'visible'
                    });
                }
            });
            
            // Rendre visible le conteneur horizontal
            gsap.set(horizontalContainer, { 
                visibility: 'visible',
                opacity: 1
            });
            
            // Mettre à jour les variables d'état
            currentSection = 0;
            isHorizontalActive = true;
            
            // Afficher la première section horizontale avec animation de type PDF
            gsap.to(horizontalSections[0], {
                opacity: 1,
                xPercent: 0,
                duration: 1,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating = false;
                    
                    // Animer les éléments internes de la première section
                    animateSectionContent(horizontalSections[0]);
                    
                    // Initialiser les écouteurs pour le défilement horizontal
                    initHorizontalScrollListeners();
                }
            });
        }
        
        // Quitter le mode horizontal (revenir à la hero section ou passer au mode vertical suivant)
        function exitHorizontalMode(callback) {
            if (isAnimating) return;
            isAnimating = true;
            
            // Arrêter les écouteurs de défilement horizontal
            removeHorizontalScrollListeners();
            
            // Animer la sortie de la section horizontale actuelle
            gsap.to(horizontalSections[currentSection], {
                opacity: 0,
                xPercent: -100, // Sortie vers la gauche pour enchaîner avec le défilement vertical
                duration: 1,
                ease: 'power3.in'
            });
            
            // Rétablir le défilement vertical
            document.body.style.overflow = '';
            
            // Si on revient à la hero, animer son contenu
            if (currentSection === 0) {
                // Animer le retour du contenu hero
                gsap.to('.hero-overlay-content', {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    ease: 'power2.out'
                });
                
                // Animer le retour du modèle Spline
                const splineViewer = document.querySelector('spline-viewer');
                if (splineViewer && splineViewer.spline) {
                    try {
                        splineViewer.spline.setRotation(0, 0, 0);
                        splineViewer.spline.setScale(1, 1, 1);
                    } catch (e) {
                        console.log('Erreur pendant l\'animation Spline:', e);
                    }
                }
            }
            
            // Mise à jour des variables d'état
            isHorizontalActive = false;
            
            setTimeout(() => {
                isAnimating = false;
                // Réinitialiser l'index de section
                currentSection = -1;
                
                // Exécuter le callback s'il existe
                if (typeof callback === 'function') {
                    callback();
                }
            }, 1000);
        }
        
        // Initialiser les écouteurs d'événements pour le défilement horizontal
        function initHorizontalScrollListeners() {
            window.addEventListener('wheel', handleHorizontalWheel, { passive: false });
            window.addEventListener('touchstart', handleTouchStart, { passive: true });
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('keydown', handleKeyNavigation);
        }
        
        // Supprimer les écouteurs d'événements de défilement horizontal
        function removeHorizontalScrollListeners() {
            window.removeEventListener('wheel', handleHorizontalWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('keydown', handleKeyNavigation);
        }
        
        // Variables pour le défilement tactile
        let touchStartX = 0;
        
        // Gestion du début de toucher
        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
        }
        
        // Gestion du mouvement tactile
        function handleTouchMove(e) {
            if (isAnimating || !isHorizontalActive) return;
            
            const touchX = e.touches[0].clientX;
            const diff = touchStartX - touchX;
            
            // Seuil de détection pour éviter les déclenchements accidentels
            if (Math.abs(diff) > 50) {
                e.preventDefault();
                
                if (diff > 0) {
                    // Glissement vers la gauche = section suivante
                    goToNextSection();
                } else {
                    // Glissement vers la droite = section précédente
                    goToPrevSection();
                }
                
                // Réinitialiser pour éviter des détections multiples
                touchStartX = 0;
            }
        }
        
        // Gestion de la molette pour le défilement horizontal
        function handleHorizontalWheel(e) {
            if (!isHorizontalActive || isAnimating) return;
            
            e.preventDefault();
            
            // Déterminer la direction du défilement
            if (e.deltaY > 0) {
                goToNextSection();
            } else {
                goToPrevSection();
            }
        }
        
        // Gestion des touches clavier (flèches gauche/droite)
        function handleKeyNavigation(e) {
            if (!isHorizontalActive || isAnimating) return;
            
            if (e.key === 'ArrowRight') {
                goToNextSection();
            } else if (e.key === 'ArrowLeft') {
                goToPrevSection();
            }
        }
        
        // Aller à la section horizontale suivante
        function goToNextSection() {
            // Si nous sommes sur la dernière section horizontale
            if (currentSection === horizontalSections.length - 1) {
                // Transition vers le défilement vertical
                transitionToVerticalScroll();
            } 
            // Sinon, passer à la section horizontale suivante
            else if (currentSection < horizontalSections.length - 1) {
                navigateToSection(currentSection + 1);
            }
        }
        
        // Fonction pour passer au défilement vertical après la dernière section horizontale (comme sur l'image)
        function transitionToVerticalScroll() {
            if (isAnimating) return;
            isAnimating = true;
            
            // Référence à la dernière section horizontale
            const lastHorizontalSection = horizontalSections[currentSection];
            // Référence à la section verticale suivante
            const verticalSection = document.querySelector('.vertical-section');
            
            if (!verticalSection) {
                isAnimating = false;
                return;
            }
            
            // 1. Animation de sortie de la dernière section horizontale vers le bas (comme sur l'image)
            gsap.to(lastHorizontalSection, {
                y: 50, // Descendre légèrement
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    // Désactiver le mode horizontal
                    removeHorizontalScrollListeners();
                    
                    // Rétablir le défilement vertical
                    document.body.style.overflow = '';
                    
                    // Préparer la section verticale pour une entrée du haut
                    gsap.set(verticalSection, {
                        y: -50,
                        opacity: 0,
                        visibility: 'visible'
                    });
                    
                    // 2. Animer l'entrée de la section verticale depuis le haut
                    gsap.to(verticalSection, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => {
                            // Scroll automatique vers la section verticale
                            verticalSection.scrollIntoView({ behavior: 'smooth' });
                            
                            // Mise à jour des variables d'état
                            isHorizontalActive = false;
                            
                            setTimeout(() => {
                                isAnimating = false;
                            }, 300);
                        }
                    });
                }
            });
        }
        
        // Aller à la section horizontale précédente
        function goToPrevSection() {
            if (currentSection > 0) {
                navigateToSection(currentSection - 1);
            } else if (currentSection === 0) {
                // Retour à la hero section
                exitHorizontalMode();
            }
        }
        
        // Naviguer vers une section spécifique - effet PDF
        function navigateToSection(index) {
            if (isAnimating || index === currentSection) return;
            isAnimating = true;
            
            const direction = index > currentSection ? 1 : -1;
            const currentElement = horizontalSections[currentSection];
            const targetElement = horizontalSections[index];
            
            // Défilement de type PDF - animation en deux étapes
            
            // 1. Sortie rapide de la section actuelle
            gsap.to(currentElement, {
                opacity: 0,
                xPercent: -direction * 100,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    // 2. Entrée de la nouvelle section
                    gsap.fromTo(targetElement,
                        { 
                            opacity: 0, 
                            xPercent: direction * 100,
                            visibility: 'visible'
                        },
                        {
                            opacity: 1,
                            xPercent: 0,
                            duration: 0.5,
                            ease: 'power2.out',
                            onComplete: () => {
                                // Mettre à jour la section courante
                                currentSection = index;
                                isAnimating = false;
                                
                                // Animer les éléments internes de la nouvelle section
                                animateSectionContent(targetElement);
                            }
                        }
                    );
                }
            });
            
            // Mettre à jour la navigation
            updateNavigation(index);
        }
        
        // Mettre à jour la navigation
        function updateNavigation(index) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Trouver l'ID de la section
            const sectionId = horizontalSections[index].id;
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        }
        
        // Animation du contenu interne des sections
        function animateSectionContent(section) {
            // Sélectionner les éléments à animer
            const title = section.querySelector('.section-title, h2');
            const contentElements = section.querySelectorAll('.about-image, .about-text, .skills-box, .about-content > *, p, img, .skill, .project-item, .contact-item, form > *');
            
            // Animer le titre avec un léger délai
            if (title) {
                gsap.fromTo(title, 
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
                );
            }
            
            // Animer les éléments de contenu avec un effet décalé
            if (contentElements.length > 0) {
                gsap.fromTo(contentElements,
                    { x: 70, opacity: 0 },
                    { 
                        x: 0, 
                        opacity: 1, 
                        duration: 0.8, 
                        stagger: 0.1, 
                        delay: 0.4, 
                        ease: 'power3.out'
                    }
                );
            }
            
            // Animer les barres de progression si présentes
            const progressBars = section.querySelectorAll('.progress');
            if (progressBars.length > 0) {
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width') + '%';
                    gsap.to(bar, {
                        width: targetWidth,
                        duration: 1.5,
                        delay: 0.6,
                        ease: 'power3.out'
                    });
                });
            }
        }
        
        // Gérer les liens de navigation pour le système de défilement personnalisé
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                
                // Vérifier si c'est la hero section
                if (targetId === 'accueil') {
                    if (isHorizontalActive) {
                        exitHorizontalMode();
                    } 
                    // Défilement vers le haut de la page
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    // Mettre à jour la classe active
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    return;
                }
                
                // Vérifier si c'est le footer ou une section verticale après le mode horizontal
                if (targetId === 'footer' || targetId === 'vertical-section') {
                    // Si nous sommes en mode horizontal, il faut d'abord sortir
                    if (isHorizontalActive) {
                        // Sortir du mode horizontal et aller au footer
                        exitHorizontalMode(() => {
                            // Une fois sorti, faire défiler verticalement vers le footer
                            setTimeout(() => {
                                const target = document.getElementById(targetId);
                                if (target) {
                                    target.scrollIntoView({ behavior: 'smooth' });
                                }
                            }, 500);
                        });
                    } else {
                        // Sinon, simplement défiler vers le footer
                        const target = document.getElementById(targetId);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    
                    // Mettre à jour la classe active
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    return;
                }
                
                // Trouver la section correspondante
                let targetIndex = -1;
                horizontalSections.forEach((section, index) => {
                    if (section.id === targetId) targetIndex = index;
                });
                
                if (targetIndex >= 0) {
                    // Si en mode horizontal, naviguer directement
                    if (isHorizontalActive) {
                        navigateToSection(targetIndex);
                    } else {
                        // Sinon, activer d'abord le mode horizontal
                        enterHorizontalMode();
                        
                        // Attendre que le mode horizontal soit actif avant de naviguer
                        setTimeout(() => {
                            if (targetIndex > 0) {
                                navigateToSection(targetIndex);
                            }
                        }, 1500);
                    }
                    
                    // Mettre à jour la classe active
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Adapter le conteneur horizontal lors du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            if (isHorizontalActive) {
                // Réajuster la largeur des sections si nécessaire
                horizontalSections.forEach((section) => {
                    gsap.set(section, { width: window.innerWidth + 'px' });
                });
            }
        });
    };
    
    // Appeler cette fonction après le chargement de la page
    setupEnhancedScroll();
    
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
    
    // Navigation fluide avec attente de la fin d'animation Spline
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            const splineViewer = document.querySelector('spline-viewer');
            
            if (target) {
                // Animation de la scène Spline avant de défiler
                if (splineViewer && splineViewer.spline && this.getAttribute('href') !== '#accueil') {
                    // Durée d'animation avant de défiler (2 secondes)
                    const animationDuration = 2;
                    
                    // Animation de zoom arrière pour un effet de transition
                    const timeline = gsap.timeline({
                        onComplete: () => {
                            // Une fois l'animation terminée, on défile vers la section cible
                            window.scrollTo({
                                top: target.offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    });
                    
                    // Effet de zoom arrière et rotation
                    try {
                        timeline.to('.hero-overlay-content', {
                            opacity: 0,
                            y: -50,
                            duration: animationDuration / 2
                        });
                        
                        // Animation spécifique pour le modèle Spline
                        let currentScale = 1;
                        let endScale = 0.5;
                        let rotationY = 180;
                        
                        // Pour éviter les bugs, utiliser requestAnimationFrame
                        let startTime = null;
                        
                        function animateSpline(timestamp) {
                            if (!startTime) startTime = timestamp;
                            
                            const elapsed = timestamp - startTime;
                            const progress = Math.min(elapsed / (animationDuration * 1000), 1);
                            
                            // Calculer les valeurs d'animation
                            const scale = currentScale - (progress * (currentScale - endScale));
                            const rotation = progress * rotationY;
                            
                            // Appliquer les transformations au modèle Spline
                            try {
                                splineViewer.spline.setScale(scale, scale, scale);
                                splineViewer.spline.setRotation(0, rotation, 0);
                            } catch (e) {
                                console.log('Erreur lors de l\'animation Spline:', e);
                            }
                            
                            if (progress < 1) {
                                requestAnimationFrame(animateSpline);
                            }
                        }
                        
                        requestAnimationFrame(animateSpline);
                    } catch (e) {
                        console.log('Erreur:', e);
                        // En cas d'erreur, défiler immédiatement
                        window.scrollTo({
                            top: target.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Défilement normal si ce n'est pas depuis la hero section
                    window.scrollTo({
                        top: target.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header sticky avec effet de flou au scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Header sticky avec effet de flou au scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Gestion du menu hamburger style Magician
const navToggle = document.querySelector('.nav-toggle');
const navMenuContainer = document.querySelector('.nav-menu-container');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

// Fermer le menu mobile quand on clique sur un lien
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenuContainer.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        // Mettre à jour la classe active sur le lien cliqué
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
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

document.addEventListener('DOMContentLoaded', () => {
    // Animation de chargement
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        loader.classList.add('loaded');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    });

    // Toggle du menu mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermeture du menu lors du clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navigation active selon la section visible
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
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
