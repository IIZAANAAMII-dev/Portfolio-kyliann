// Configuration de base de Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: false,
    getDirection: true,
    class: 'is-revealed',
    resetNativeScroll: true,
    lerp: 0.1,
    // Désactiver les effets sur la section horizontale
    ignoreElements: '.horizontal, .horizontal *',
    // Désactiver le smooth scroll natif
    smooth: false,
    // Désactiver sur mobile
    tablet: { smooth: false },
    smartphone: { smooth: false },
});

// Variables pour le contrôle du défilement
let isScrolling = false;
let scrollTimeout;

// Fonction pour passer à la section suivante ou précédente
function goToSection(direction) {
    if (isScrolling) return;
    
    const sections = Array.from(document.querySelectorAll('section'));
    const currentSection = document.elementFromPoint(
        window.innerWidth / 2, 
        window.innerHeight / 2
    ).closest('section');

    if (!currentSection) return;

    const currentIndex = sections.indexOf(currentSection);
    let targetIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;
    
    // Limiter l'index aux limites des sections
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    // Ne rien faire si on est déjà à la première/dernière section
    if (targetIndex === currentIndex) return;
    
    isScrolling = true;
    
    // Ajouter une classe pendant l'animation
    document.body.classList.add('is-scrolling');
    
    // Faire défiler vers la section cible
    scroll.scrollTo(sections[targetIndex], {
        offset: 0,
        duration: 0.8,
        disableLerp: false,
        callback: () => {
            // Réactiver le scroll après un court délai
            setTimeout(() => {
                isScrolling = false;
                document.body.classList.remove('is-scrolling');
            }, 300);
        }
    });
}

// Gérer la molette de la souris
let wheelTimeout;
let wheelDelta = 0;

window.addEventListener('wheel', (e) => {
    // Annuler le comportement par défaut
    e.preventDefault();
    
    // Accumuler le delta pour détecter un mouvement significatif
    wheelDelta += Math.abs(e.deltaY);
    
    // Réinitialiser le compteur après un court délai
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        wheelDelta = 0;
    }, 100);
    
    // Si le mouvement est suffisant, changer de section
    if (wheelDelta > 50) {
        const direction = e.deltaY > 0 ? 'down' : 'up';
        goToSection(direction);
        wheelDelta = 0; // Réinitialiser après changement
    }
}, { passive: false });

// Gérer les touches fléchées du clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToSection('down');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToSection('up');
    } else if (e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToSection('down');
    } else if (e.key === 'PageUp') {
        e.preventDefault();
        goToSection('up');
    } else if (e.key === 'Home') {
        e.preventDefault();
        scroll.scrollTo('top', { duration: 0.8 });
    } else if (e.key === 'End') {
        e.preventDefault();
        scroll.scrollTo(document.body.scrollHeight, { duration: 0.8 });
    }
});

// Désactiver le défilement au toucher sur mobile
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (isScrolling) {
        e.preventDefault();
        return false;
    }
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    if (Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 'down' : 'up';
        goToSection(direction);
        touchStartY = touchY;
    }
    
    e.preventDefault();
}, { passive: false });

// Initialisation après le chargement complet
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter une classe au body pour les styles CSS
    document.body.classList.add('snap-scroll-enabled');
    
    // Délai pour s'assurer que tout est chargé
    setTimeout(() => {
        // Forcer le rafraîchissement du scroll
        scroll.update();
        
        // Réinitialiser la position au chargement
        window.scrollTo(0, 0);
        
        // Forcer un rafraîchissement supplémentaire
        setTimeout(() => {
            scroll.update();
            
            // Activer les styles de transition après l'initialisation
            document.body.classList.add('scroll-initialized');
        }, 300);
    }, 500);
    
    // Gérer le clavier pour la navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const delta = e.key === 'ArrowDown' ? 1 : -1;
            const sections = Array.from(document.querySelectorAll('section[data-scroll-section]'));
            const currentSection = document.elementFromPoint(
                window.innerWidth / 2, 
                window.innerHeight / 2
            ).closest('section[data-scroll-section]');
            
            if (!currentSection) return;
            
            const currentIndex = sections.indexOf(currentSection);
            let targetIndex = currentIndex + delta;
            targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
            
            if (targetIndex !== currentIndex) {
                scroll.scrollTo(sections[targetIndex], {
                    offset: 0,
                    duration: 0.8,
                    disableLerp: false
                });
            }
        }
    });
});

// Gestion du redimensionnement avec debounce
let resizeTimeout;
let resizeStartTime;

function handleResize() {
    const now = Date.now();
    if (!resizeStartTime) resizeStartTime = now;
    
    // Annuler le rafraîchissement si le redimensionnement est trop rapide
    if (now - resizeStartTime < 500) {
        clearTimeout(resizeTimeout);
    }
    
    // Ajouter une classe pendant le redimensionnement
    document.documentElement.classList.add('is-resizing');
    
    // Effacer tout délai existant
    clearTimeout(resizeTimeout);
    
    // Définir un nouveau délai
    resizeTimeout = setTimeout(() => {
        document.documentElement.classList.remove('is-resizing');
        scroll.update();
        resizeStartTime = null;
        
        // Forcer un rafraîchissement supplémentaire pour les cas problématiques
        setTimeout(() => scroll.update(), 100);
    }, 250);
}

// Écouteurs d'événements optimisés
window.addEventListener('resize', handleResize, { passive: true });

// Mettre à jour la position du scroll après les animations
function refreshScroll() {
    scroll.update();
}

// Gérer les ancres de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            scroll.scrollTo(target, {
                offset: -100,
                duration: 800,
                easing: [0.25, 0.0, 0.35, 1.0],
                disableLerp: true
            });
        }
    });
});

// Détection précise de la section active
let lastScroll = 0;
let ticking = false;

function updateActiveSection() {
    const scrollY = window.scrollY || window.pageYOffset;
    const direction = scrollY > lastScroll ? 'down' : 'up';
    lastScroll = scrollY;
    
    // Ignorer pendant le redimensionnement
    if (document.documentElement.classList.contains('is-resizing')) return;
    
    // Parcourir toutes les sections
    document.querySelectorAll('section[id]').forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;
        const offset = windowHeight * 0.3; // 30% de la hauteur de la fenêtre
        
        // Vérifier si la section est dans la vue
        const isInView = (
            (sectionTop <= (scrollY + offset) && 
             sectionTop + sectionHeight > scrollY + offset) ||
            (direction === 'down' && 
             sectionTop < scrollY + windowHeight && 
             sectionTop + sectionHeight > scrollY + windowHeight - offset) ||
            (direction === 'up' && 
             sectionTop < scrollY + offset && 
             sectionTop + sectionHeight > scrollY)
        );
        
        if (isInView) {
            const id = section.getAttribute('id');
            if (id) {
                // Mettre à jour la navigation
                document.querySelectorAll('nav a').forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${id}` || 
                                   href.endsWith(`#${id}`);
                    link.classList.toggle('active', isActive);
                    
                    // Mettre à jour l'URL sans recharger la page
                    if (isActive && window.history && window.history.replaceState) {
                        const newUrl = `${window.location.pathname}#${id}`;
                        if (window.location.href !== newUrl) {
                            window.history.replaceState({}, '', newUrl);
                        }
                    }
                });
            }
        }
    });
    
    ticking = false;
}

// Gestion du défilement avec détection de fin d'animation
let lastScrollTime = 0;

scroll.on('scroll', (args) => {
    const now = Date.now();
    
    // Limiter les mises à jour à 60fps
    if (now - lastScrollTime > 16) {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveSection);
            ticking = true;
        }
        lastScrollTime = now;
    }
    
    // Détecter la fin du défilement
    if (!args.delta.changed) {
        isScrolling = false;
    }
});

// Désactiver le comportement par défaut du scroll
window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > 5) {
        e.preventDefault();
    }
}, { passive: false });

// Gérer le chargement initial avec hash dans l'URL
function handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                scroll.scrollTo(target, {
                    offset: -100,
                    duration: 0
                });
            }, 100);
        }
    }
}

// Appeler la fonction au chargement initial
setTimeout(handleInitialHash, 500);

// Exposer la fonction de rafraîchissement au scope global
window.refreshScroll = refreshScroll;
