// Additional animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;

        animateElements.forEach(function(element) {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;

            // Check if element is in view
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                const animationType = element.getAttribute('data-animation') || 'fade-in';
                element.classList.add(animationType);
            }
        });
    }

    // Run on page load
    checkIfInView();

    // Run on scroll
    window.addEventListener('scroll', checkIfInView);

    // Typing animation for hero section
    const heroTitle = document.querySelector('.hero-section h1');
    if (heroTitle) {
        heroTitle.classList.add('typing');
    }

    // Hover effects for cards
    const cards = document.querySelectorAll('.tour-card, .feature-box, .testimonial-card');
    cards.forEach(card => {
        card.classList.add('hover-lift', 'hover-shadow');
    });

    // Image hover effects
    const images = document.querySelectorAll('.tour-card img, .hero-image');
    images.forEach(image => {
        const parent = image.parentElement;
        parent.classList.add('img-hover-zoom');
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    buttons.forEach(button => {
        button.classList.add('btn-hover-slide');
    });

    // Text hover effects for links
    const navLinks = document.querySelectorAll('.nav-link:not(.btn), .footer-links a');
    navLinks.forEach(link => {
        link.classList.add('text-hover-underline');
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }

    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        function updateCounter() {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        
        // Start counter when element is in view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
});