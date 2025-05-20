class Projects {
    constructor() {
        this.projects = [
            {
                id: 1,
                title: "Application Mobile de Recettes",
                category: "UI/UX Design",
                description: "Conception d'une application de recettes de cuisine avec une interface utilisateur intuitive et des animations fluides.",
                image: "https://source.unsplash.com/random/600x400/?mobile-app,food",
                tags: ["UI Design", "UX Research", "Prototypage"]
            },
            {
                id: 2,
                title: "Site E-commerce Moderne",
                category: "Développement Web",
                description: "Développement d'une plateforme e-commerce avec React et Node.js, optimisée pour les performances.",
                image: "https://source.unsplash.com/random/600x400/?ecommerce,shopping",
                tags: ["React", "Node.js", "MongoDB"]
            },
            {
                id: 3,
                title: "Identité de Marque",
                category: "Branding",
                description: "Création d'une identité visuelle complète pour une startup technologique innovante.",
                image: "https://source.unsplash.com/random/600x400/?branding,design",
                tags: ["Logo", "Charte Graphique", "Branding"]
            },
            {
                id: 4,
                title: "Tableau de Bord Analytics",
                category: "UI/UX Design",
                description: "Conception d'un tableau de bord de données avec visualisations interactives et personnalisables.",
                image: "https://source.unsplash.com/random/600x400/?dashboard,analytics",
                tags: ["UI Design", "Data Visualization", "Prototypage"]
            },
            {
                id: 5,
                title: "Application de Gestion de Projet",
                category: "Développement Web",
                description: "Application web complète pour la gestion de projet avec fonctionnalités en temps réel.",
                image: "https://source.unsplash.com/random/600x400/?project,management",
                tags: ["Vue.js", "Firebase", "Temps Réel"]
            },
            {
                id: 6,
                title: "Refonte de Site Web",
                category: "UI/UX Design",
                description: "Refonte complète de l'expérience utilisateur d'un site web existant avec une approche centrée utilisateur.",
                image: "https://source.unsplash.com/random/600x400/?website,redesign",
                tags: ["UX Research", "UI Design", "Tests Utilisateurs"]
            }
        ];

        this.activeFilter = 'all';
        this.initialize();
    }

    initialize() {
        this.renderProjects();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    renderProjects(filter = 'all') {
        const projectsContainer = document.querySelector('.projects-grid');
        if (!projectsContainer) return;

        const filteredProjects = filter === 'all' 
            ? this.projects 
            : this.projects.filter(project => 
                project.category.toLowerCase().includes(filter.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
            );

        projectsContainer.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category.toLowerCase()}">
                <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <a href="#" class="project-link">Voir le projet
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        `).join('');

        // Animate projects after rendering
        this.animateProjects();
    }


    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.activeFilter = filter;
                this.updateActiveFilterButton();
                this.renderProjects(filter);
            });
        });


        // Project card click
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                // Handle project click (e.g., open modal or navigate to project page)
                console.log('Project clicked:', projectCard.querySelector('.project-title').textContent);
            }
        });
    }


    updateActiveFilterButton() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === this.activeFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }


    setupIntersectionObserver() {
        const header = document.querySelector('.section-header');
        if (!header) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(header);
    }


    animateProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, 150 * index);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Projects();
});
