// Script pour le défilement horizontal avec GSAP
document.addEventListener('DOMContentLoaded', function() {
    // Enregistrer les plugins nécessaires
    gsap.registerPlugin(ScrollTrigger);
    
    // Sélectionner les éléments
    const section = document.querySelector('.horizontal-scroll-section');
    const container = document.querySelector('.horizontal-scroll-container');
    const dots = document.querySelectorAll('.horizontal-scroll-dot');
    const items = document.querySelectorAll('.horizontal-scroll-item');
    
    // Animation de la section suivante à la fin du défilement
    const nextSection = document.querySelector('.next-vertical-section');
    
    // S'assurer que la container a la bonne largeur
    const updateContainerWidth = () => {
        // La largeur du container doit être égale à la largeur de la fenêtre * le nombre d'items
        container.style.width = `${items.length * 100}vw`;
        
        // S'assurer que les items ont tous la même largeur
        items.forEach(item => {
            item.style.width = `${100 / items.length}%`;
            item.style.minWidth = `100vw`;
        });
    };
    
    // Appeler immédiatement et aussi à chaque redimensionnement
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    
    // Animation horizontale optimisée
    let scrollTween = gsap.to(container, {
        x: () => -(container.offsetWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top top", // Démarre quand le haut de la section atteint le haut du viewport
            end: () => "+=" + (container.offsetWidth - window.innerWidth),
            pin: true,
            pinSpacing: true, // Maintient l'espace pour un défilement fluide
            scrub: 1,
            markers: false, // Désactivation des marqueurs
            anticipatePin: 1, // Évite les sauts au début du pin
            invalidateOnRefresh: true, // Recalculer lors du rafraîchissement
            onUpdate: (self) => {
                // Calculer quelle section est actuellement visible
                const index = Math.min(
                    Math.floor(self.progress * items.length),
                    items.length - 1
                );
                
                // Mettre à jour les dots et ajouter/supprimer la classe active
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                // Mettre à jour le statut actif des items
                items.forEach((item, i) => {
                    item.classList.toggle('active', i === index);
                });
            },
            onLeave: () => {
                // Activer la section suivante quand on quitte la section horizontale
                nextSection.classList.add('visible');
            },
            onEnterBack: () => {
                // Désactiver la section suivante quand on revient à la section horizontale
                nextSection.classList.remove('visible');
            }
        }
    });
    
    // Observer pour animer l'apparition de la section suivante au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Déclenche quand 10% de la section est visible
    });
    
    // Observer la section suivante
    observer.observe(nextSection);
    
    // Navigation par les dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const items = document.querySelectorAll('.horizontal-scroll-item');
            const progress = index / (items.length - 1);
            
            // Déterminer la position de scroll cible
            const scrollTriggers = ScrollTrigger.getAll();
            const st = scrollTriggers[0]; // Premier ScrollTrigger
            if (st) {
                const scrollTo = st.start + (st.end - st.start) * progress;
                window.scrollTo({
                    top: scrollTo,
                    behavior: 'smooth'
                });
            }
        });
    });
});
