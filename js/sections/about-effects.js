// Script pour l'effet de mouvement des étiquettes et des images lorsque la souris se déplace
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.about-section');
    const topTag = document.querySelector('.top-tag');
    const bottomTag = document.querySelector('.bottom-tag');
    const profileImage = document.querySelector('.profile-image');
    const effetImage = document.querySelector('.effet-image');
    
    // Ajouter l'écouteur d'événement de mouvement de la souris à la section
    aboutSection.addEventListener('mousemove', function(e) {
        // Calculer la position relative de la souris dans la section
        const rect = aboutSection.getBoundingClientRect();
        const x = e.clientX - rect.left; // Position X relative à la section
        const y = e.clientY - rect.top;  // Position Y relative à la section
        
        // Calculer le pourcentage de la position de la souris par rapport à la taille de la section
        const xPercent = x / rect.width;
        const yPercent = y / rect.height;
        
        // Déplacer les étiquettes et les images en fonction de la position de la souris
        // Les déplacements sont limités pour rester subtils
        const moveX = (xPercent - 0.5) * 30; // Déplacement horizontal max de 30px
        const moveY = (yPercent - 0.5) * 20; // Déplacement vertical max de 20px
        
        // Appliquer les transformations avec des vitesses différentes pour chaque élément
        topTag.style.transform = `translate(${moveX * 0.8}px, ${moveY * 0.6}px)`;
        bottomTag.style.transform = `translate(${moveX * -0.6}px, ${moveY * -0.8}px)`;
        
        // Mouvement plus subtil pour l'image principale
        profileImage.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.2}px) scale(1.02)`;
        
        // Mouvement de l'image d'effet (dans le sens opposé pour plus de profondeur)
        effetImage.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.3}px)`;
    });
    
    // Réinitialiser la position des éléments lorsque la souris quitte la section
    aboutSection.addEventListener('mouseleave', function() {
        profileImage.style.transform = 'translate(0, 0) scale(1)';
        topTag.style.transform = 'translate(0, 0)';
        bottomTag.style.transform = 'translate(0, 0)';
        effetImage.style.transform = 'translate(0, 0)';
    });
});
