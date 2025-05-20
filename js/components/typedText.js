class TypedText {
    constructor(element, options = {}) {
        this.element = element;
        this.words = options.words || ['Développeur', 'Designer', 'Créatif'];
        this.typeSpeed = options.typeSpeed || 100;
        this.backSpeed = options.backSpeed || 50;
        this.backDelay = options.backDelay || 2000;
        this.loop = options.loop !== undefined ? options.loop : true;
        this.cursor = options.cursor !== undefined ? options.cursor : '|';
        this.cursorBlinking = options.cursorBlinking !== undefined ? options.cursorBlinking : true;
        this.cursorBlinkSpeed = options.cursorBlinkSpeed || 500;
        
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isBlinking = false;
        this.typingTimeout = null;
        this.blinkInterval = null;
        
        // Initialisation
        this.init();
    }
    
    init() {
        // Créer un span pour le curseur
        this.cursorElement = document.createElement('span');
        this.cursorElement.className = 'typed-cursor';
        this.cursorElement.textContent = this.cursor;
        this.element.parentNode.insertBefore(this.cursorElement, this.element.nextSibling);
        
        // Démarrer l'animation
        this.type();
        
        // Démarrer le clignotement du curseur
        if (this.cursorBlinking) {
            this.startBlinking();
        }
    }
    
    startBlinking() {
        if (this.blinkInterval) clearInterval(this.blinkInterval);
        this.isBlinking = true;
        this.blinkInterval = setInterval(() => {
            this.cursorElement.style.opacity = this.cursorElement.style.opacity === '0' ? '1' : '0';
        }, this.cursorBlinkSpeed);
    }
    
    stopBlinking() {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
        this.cursorElement.style.opacity = '1';
        this.isBlinking = false;
    }
    
    type() {
        // Arrêter le clignotement pendant la frappe
        this.stopBlinking();
        
        const currentWord = this.words[this.currentWordIndex];
        
        // Déterminer la vitesse en fonction de si on tape ou on efface
        const speed = this.isDeleting ? this.backSpeed : this.typeSpeed;
        
        if (this.isDeleting) {
            // Effacer un caractère
            this.currentCharIndex--;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
        } else {
            // Ajouter un caractère
            this.currentCharIndex++;
            this.element.textContent = currentWord.substring(0, this.currentCharIndex);
        }
        
        // Logique pour déterminer la prochaine étape
        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            // Fin du mot, on attend puis on efface
            if (this.loop || this.currentWordIndex < this.words.length - 1) {
                this.typingTimeout = setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.backDelay);
                return;
            }
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            // Tout est effacé, on passe au mot suivant
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }
        
        // Si on n'est pas en train d'attendre entre les mots, on continue à taper/effacer
        if (!this.typingTimeout) {
            this.typingTimeout = setTimeout(() => this.type(), speed);
        }
    }
    
    // Méthode pour détruire l'instance et nettoyer
    destroy() {
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        if (this.blinkInterval) clearInterval(this.blinkInterval);
        if (this.cursorElement && this.cursorElement.parentNode) {
            this.cursorElement.parentNode.removeChild(this.cursorElement);
        }
    }
}

// Initialisation automatique des éléments avec la classe 'typed-text'
document.addEventListener('DOMContentLoaded', () => {
    const typedElements = document.querySelectorAll('.typed-text');
    
    typedElements.forEach(element => {
        const words = element.getAttribute('data-words');
        const typeSpeed = parseInt(element.getAttribute('data-type-speed')) || 100;
        const backSpeed = parseInt(element.getAttribute('data-back-speed')) || 50;
        const backDelay = parseInt(element.getAttribute('data-back-delay')) || 2000;
        const loop = element.getAttribute('data-loop') !== 'false';
        const cursor = element.getAttribute('data-cursor') || '|';
        const cursorBlinking = element.getAttribute('data-cursor-blinking') !== 'false';
        
        new TypedText(element, {
            words: words ? words.split(',') : undefined,
            typeSpeed,
            backSpeed,
            backDelay,
            loop,
            cursor,
            cursorBlinking
        });
    });
});

export default TypedText;
