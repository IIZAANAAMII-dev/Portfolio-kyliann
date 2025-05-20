document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si on est sur mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) return; // Ne pas initialiser le curseur sur mobile
    
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    
    // Éléments qui déclenchent l'effet de survol (optimisé pour la performance)
    const hoverSelectors = [
        'a', 
        'button', 
        '.btn', 
        'input', 
        'textarea', 
        'select',
        '.nav-links a',
        '.project-card',
        '.social-links a'
    ].join(',');
    
    // Position et vitesse du curseur
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const interpolationFactor = 0.8; // Augmenté pour un suivi plus direct
    let rafId = null;
    let isCursorMoving = false;
    
    // Positionner le curseur initialement
    cursor.style.transition = 'none'; // Désactiver les transitions initiales
    cursor.style.opacity = '0'; // Cacher le curseur initialement
    
    // Suivre la position de la souris
    const mouseMoveHandler = (e) => {
        // Mettre à jour la position de la souris
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Si c'est le premier mouvement, positionner le curseur directement
        if (!isCursorMoving) {
            cursorX = mouseX;
            cursorY = mouseY;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            cursor.style.opacity = '1';
            isCursorMoving = true;
            return;
        }
        
        // Démarrer l'animation si elle n'est pas déjà en cours
        if (!rafId) {
            rafId = requestAnimationFrame(animateCursor);
        }
    };
    
    // Utiliser capture pour une meilleure performance
    document.addEventListener('mousemove', mouseMoveHandler, { passive: true, capture: true });
    
    // Animation fluide du curseur
    function animateCursor() {
        // Calcul des différences de position
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        // Si la distance est très faible, on arrête l'animation
        if (Math.abs(diffX) < 0.1 && Math.abs(diffY) < 0.1) {
            cursorX = mouseX;
            cursorY = mouseY;
            rafId = null;
        } else {
            // Appliquer le mouvement avec interpolation dynamique
            // Plus la distance est grande, plus le facteur d'interpolation est élevé
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            const dynamicFactor = Math.min(interpolationFactor * (1 + distance * 0.01), 0.95);
            
            cursorX += diffX * dynamicFactor;
            cursorY += diffY * dynamicFactor;
            
            // Demander la prochaine frame
            rafId = requestAnimationFrame(animateCursor);
        }
        
        // Appliquer la transformation
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
    
    // Démarrer l'animation
    animateCursor();
    
    // Gestion des effets de survol optimisée avec délégation d'événements
    function initHoverEffects() {
        // Utiliser la délégation d'événements pour gérer les éléments dynamiques
        const handleMouseEnter = (e) => {
            if (e.target.matches(hoverSelectors)) {
                cursor.classList.add('hover');
            }
        };
        
        const handleMouseLeave = () => cursor.classList.remove('hover');
        
        // Ajouter les écouteurs au document
        document.addEventListener('mouseenter', handleMouseEnter, { capture: true });
        document.addEventListener('mouseleave', handleMouseLeave, { capture: true });
        
        // Nettoyage
        return () => {
            document.removeEventListener('mouseenter', handleMouseEnter, { capture: true });
            document.removeEventListener('mouseleave', handleMouseLeave, { capture: true });
        };
    }
    
    // Initialiser les effets de survol
    const cleanupHoverEffects = initHoverEffects();
    
    // Nettoyage des ressources
    const cleanup = () => {
        // Supprimer l'écouteur de mouvement de souris
        document.removeEventListener('mousemove', mouseMoveHandler, { capture: true });
        
        // Arrêter l'animation en cours
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        
        // Nettoyer les effets de survol
        if (cleanupHoverEffects) {
            cleanupHoverEffects();
        }
        
        // Réinitialiser le curseur
        document.body.style.cursor = '';
        cursor.style.opacity = '0';
    };
    
    // Nettoyer lors du déchargement de la page
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', cleanup);
        // Nettoyer aussi si le composant est démonté (pour les SPAs)
        window.addEventListener('unload', cleanup);
    }
    
    // Cacher le curseur par défaut et configurer l'opacité
    document.body.style.cursor = 'none';
    cursor.style.willChange = 'transform';
    
    // Gérer la visibilité du curseur
    const setCursorVisible = (isVisible) => {
        cursor.style.opacity = isVisible ? '1' : '0';
    };
    
    document.addEventListener('mouseenter', () => setCursorVisible(true));
    document.addEventListener('mouseleave', () => setCursorVisible(false));
    
    // Exposer la fonction de nettoyage pour une utilisation externe si nécessaire
    cursor.cleanup = cleanup;
});
