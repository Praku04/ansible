// This file contains functions related to authentication, such as handling user registration and validation of input data.

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form inputs
        if (!validateForm()) {
            return;
        }

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = passwordField.value;

        // Call the register function to handle registration
        register(fullName, email, password);
    });

    function validateForm() {
        // Check if passwords match
        if (passwordField.value !== confirmPasswordField.value) {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.style.color = '#dc3545';
            return false;
        }

        // Check password strength
        const strength = checkPasswordStrength(passwordField.value);
        if (strength < 2) {
            alert('Please choose a stronger password!');
            return false;
        }

        return true;
    }

    function checkPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

        return strength;
    }

    function register(fullName, email, password) {
        // Simulate registration process (replace with actual API call)
        console.log('Registering user:', { fullName, email, password });
        alert('Registration successful!');
    }
});