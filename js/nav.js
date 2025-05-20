document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    let ticking = false;

    // Fonction pour gérer le scroll de manière optimisée
    function handleScroll() {
        // Ajout/suppression de la classe 'scrolled' selon le défilement
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Mise à jour du lien actif
        updateActiveLink();
        ticking = false;
    }

    // Gestion du défilement avec debounce
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // Gestion du menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Désactiver le défilement du corps lorsque le menu est ouvert
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                navbar.style.background = 'rgba(13, 13, 13, 0.98)';
                navbar.style.borderRadius = '0';
                navbar.style.top = '0';
                navbar.style.width = '100%';
                navbar.style.maxWidth = '100%';
            } else {
                document.body.style.overflow = 'auto';
                navbar.style.background = '';
                navbar.style.borderRadius = '';
                navbar.style.top = '';
                navbar.style.width = '';
                navbar.style.maxWidth = '';
            }
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    navItems.forEach(link => {
        link.addEventListener('click', (e) => {
            // Vérifier si c'est un lien d'ancrage
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fermer le menu mobile s'il est ouvert
                    if (navLinks.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        
                        // Restaurer le style de la navbar
                        navbar.style.background = '';
                        navbar.style.borderRadius = '';
                        navbar.style.top = '';
                        navbar.style.width = '';
                        navbar.style.maxWidth = '';
                    }
                    
                    // Défilement fluide vers la section cible
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mettre à jour le lien actif
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // Initialisation
    updateActiveLink();
    
    // Gestion du survol des liens avec le curseur personnalisé
    navItems.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.cursor');
            if (cursor) cursor.classList.add('hover');
        });
        
        link.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.cursor');
            if (cursor) cursor.classList.remove('hover');
        });
    });
});
