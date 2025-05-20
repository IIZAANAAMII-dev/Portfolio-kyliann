document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.horizontal');
    const horizontalContainer = document.querySelector('.horizontal-container');
    const sections = document.querySelectorAll('.partie');
    
    if (!container || !horizontalContainer || !sections.length) return;

    // Variables pour le contrôle du défilement
    let isScrolling = false;
    let scrollTimeout;
    let currentSection = 0;
    
    // Fonction pour obtenir la section actuelle
    function getCurrentSection() {
        return Math.round(horizontalContainer.scrollLeft / window.innerWidth);
    }
    
    // Fonction pour initialiser le défilement horizontal
    function initHorizontalScroll() {
        // Configurer les styles de base
        updateContainerWidth();
        
        // Initialiser les Spline viewers
        initSplines();
        
        // Gérer le redimensionnement
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });
        
        // Gérer le défilement tactile pour mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        horizontalContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        horizontalContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Gérer la molette de la souris pour le défilement horizontal
        horizontalContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (isScrolling) return;
            
            currentSection = getCurrentSection();
            const direction = Math.sign(e.deltaY);
            const targetSection = Math.max(0, Math.min(sections.length - 1, currentSection + direction));
            
            if (targetSection !== currentSection) {
                isScrolling = true;
                scrollToSection(targetSection);
                
                // Désactiver temporairement le défilement
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        }, { passive: false });
        
        // Activer la première section
        scrollToSection(0);
    }
    
    // Mettre à jour la largeur du conteneur et des sections
    function updateContainerWidth() {
        const windowWidth = window.innerWidth;
        const totalWidth = sections.length * 100; // 100vw par section
        
        // Mettre à jour la largeur du conteneur horizontal
        horizontalContainer.style.width = `${totalWidth}vw`;
        
        // Mettre à jour la largeur de chaque section
        sections.forEach(section => {
            section.style.width = '100vw';
            section.style.minWidth = '100vw';
            section.style.flexShrink = '0';
        });
        
        console.log('Container width updated to:', totalWidth, 'vw');
    }
    
    // Gérer le redimensionnement
    function handleResize() {
        updateContainerWidth();
        
        // Redimensionner les Splines
        document.querySelectorAll('spline-viewer').forEach(spline => {
            if (spline.resize) {
                spline.resize();
            }
        });
    }
    
    // Initialiser les vues Spline
    function initSplines() {
        const splineViewers = document.querySelectorAll('spline-viewer');
        
        splineViewers.forEach(viewer => {
            const container = viewer.closest('.spline-container');
            
            if (container) {
                container.style.opacity = '1';
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && viewer.resize) {
                            viewer.resize();
                            setTimeout(() => viewer.resize(), 100);
                        }
                    });
                }, { 
                    threshold: 0.1,
                    rootMargin: '0px 0px -50% 0px'
                });
                
                observer.observe(container);
            }
            
            if (viewer.resize) {
                viewer.resize();
                setTimeout(() => viewer.resize(), 500);
            }
        });
    }
    
    // Gérer le swipe sur mobile
    function handleSwipe() {
        const swipeThreshold = 50;
        const currentScroll = horizontalContainer.scrollLeft;
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe vers la gauche
            const nextSection = Math.min(
                Math.floor(currentScroll / window.innerWidth) + 1,
                sections.length - 1
            );
            scrollToSection(nextSection);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe vers la droite
            const prevSection = Math.max(
                Math.ceil(currentScroll / window.innerWidth) - 1,
                0
            );
            scrollToSection(prevSection);
        }
    }
    
    // Faire défiler vers une section spécifique
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            const targetScroll = window.innerWidth * index;
            
            console.log('Scrolling to section', index, 'at position', targetScroll);
            
            // Utiliser scrollTo avec behavior: 'smooth' pour une animation fluide
            horizontalContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            // Mettre à jour la section actuelle
            currentSection = index;
            
            // Forcer un redimensionnement des éléments Spline si nécessaire
            setTimeout(() => {
                document.querySelectorAll('spline-viewer').forEach(viewer => {
                    if (viewer.resize) viewer.resize();
                });
            }, 100);
            
            console.log('Current section is now', currentSection);
        }
    }
    
    // Démarrer l'initialisation
    initHorizontalScroll();
});