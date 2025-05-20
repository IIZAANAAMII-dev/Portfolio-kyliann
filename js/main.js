// Configuration globale
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
});

// Désactiver le comportement de défilement pendant le chargement
document.body.style.overflow = 'hidden';

// Cacher la barre de défilement pendant le chargement
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
document.body.style.paddingRight = 'var(--scrollbar-width)';

// Fonction pour masquer l'écran de chargement
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Ajouter la classe pour déclencher la transition de disparition
        loadingScreen.classList.add('hidden');
        
        // Réactiver le défilement après la fin de l'animation
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Supprimer l'écran de chargement du DOM
            loadingScreen.remove();
            
            // Déclencher un événement personnalisé pour indiquer que le chargement est terminé
            window.dispatchEvent(new Event('loading-complete'));
        }, 800); // Correspond à la durée de la transition CSS
    }
}

// Attendre que tout soit chargé
window.addEventListener('load', () => {
    // Simuler un temps de chargement minimum pour une meilleure expérience utilisateur
    setTimeout(hideLoadingScreen, 1500);
});

// Curseur personnalisé
const cursor = document.querySelector('.cursor');
const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    
    // Animation fluide du follower
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Effet de survol sur les éléments interactifs
const hoverElements = document.querySelectorAll('a, button, .hover-effect, [data-cursor-hover]');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

// Animation au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// Initialisation des animations au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Animation du texte tapé
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
        const textArray = ['Créatif', 'Passionné', 'Innovant'];
        let textArrayIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = textArray[textArrayIndex];
            
            if (isDeleting) {
                typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }


            if (!isDeleting && charIndex === currentText.length) {
                typingSpeed = 2000; // Pause à la fin du mot
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textArrayIndex = (textArrayIndex + 1) % textArray.length;
            }

            setTimeout(type, typingSpeed);
        }

        // Démarrer l'animation après un court délai
        setTimeout(type, 1000);
    }
    
    // Initialiser les animations au chargement
    animateOnScroll();
    
    // Initialiser Locomotive Scroll
    if (typeof LocomotiveScroll !== 'undefined') {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            smartphone: { smooth: true },
            tablet: { smooth: true },
            getDirection: true
        });
        
        // Mise à jour de Locomotive Scroll lors du redimensionnement
        window.addEventListener('load', () => {
            scroll.update();
        });
    }
    
    // Animation du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Fermer le menu au clic sur un lien
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (menuToggle && navLinks) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Animation du bouton de défilement vers le bas
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});

// Animation du défilement fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#!') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
