document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('registerForm');
    
    // Add animation to the form on load
    authForm.classList.add('fade-in');

    // Add event listener for form submission
    authForm.addEventListener('submit', function() {
        // Trigger animation on form submission
        authForm.classList.add('submitted');
    });

    // Add animations to social buttons on hover
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            button.classList.add('hover-effect');
        });
        button.addEventListener('mouseleave', function() {
            button.classList.remove('hover-effect');
        });
    });
});