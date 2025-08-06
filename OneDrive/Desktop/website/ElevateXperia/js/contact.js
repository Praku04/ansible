// Contact form handling script
document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form element
    const contactForm = document.getElementById('contactForm');
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const errorMessages = [];
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Clear previous validation states
        [name, email, phone, subject, message].forEach(field => {
            if (field) {
                field.classList.remove('is-invalid');
                const feedbackElement = field.nextElementSibling;
                if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                    feedbackElement.remove();
                }
            }
        });
        
        // Validate name
        if (name && name.value.trim() === '') {
            isValid = false;
            name.classList.add('is-invalid');
            addErrorFeedback(name, 'Please enter your name');
            errorMessages.push('Name is required');
        }
        
        // Validate email
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                isValid = false;
                email.classList.add('is-invalid');
                addErrorFeedback(email, 'Please enter your email address');
                errorMessages.push('Email is required');
            } else if (!emailRegex.test(email.value)) {
                isValid = false;
                email.classList.add('is-invalid');
                addErrorFeedback(email, 'Please enter a valid email address');
                errorMessages.push('Email is invalid');
            }
        }
        
        // Validate phone (optional but must be valid if provided)
        if (phone && phone.value.trim() !== '') {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(phone.value)) {
                isValid = false;
                phone.classList.add('is-invalid');
                addErrorFeedback(phone, 'Please enter a valid phone number');
                errorMessages.push('Phone number is invalid');
            }
        }
        
        // Validate subject
        if (subject && subject.value.trim() === '') {
            isValid = false;
            subject.classList.add('is-invalid');
            addErrorFeedback(subject, 'Please enter a subject');
            errorMessages.push('Subject is required');
        }
        
        // Validate message
        if (message && message.value.trim() === '') {
            isValid = false;
            message.classList.add('is-invalid');
            addErrorFeedback(message, 'Please enter your message');
            errorMessages.push('Message is required');
        }
        
        return { isValid, errorMessages };
    }
    
    // Helper function to add error feedback
    function addErrorFeedback(element, message) {
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        element.parentNode.insertBefore(feedback, element.nextSibling);
    }
    
    // Add input event listeners for real-time validation
    function addInputListeners() {
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                // Remove invalid class when user starts typing
                this.classList.remove('is-invalid');
                const feedbackElement = this.nextElementSibling;
                if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                    feedbackElement.remove();
                }
            });
        });
    }
    
    // Check if contact form exists on the page
    if (contactForm) {
        // Add input listeners for real-time validation
        addInputListeners();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const { isValid, errorMessages } = validateForm();
            
            if (!isValid) {
                // Show validation error summary if needed
                console.error('Form validation errors:', errorMessages);
                return;
            }
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create data object
            const formData = {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            // Send data to PHP script
            fetch('../php/send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Show success or error message
                if (data.success) {
                    // Create success alert
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = data.message || 'Thank you for your message! We will get back to you soon.';
                    
                    // Insert alert after form
                    contactForm.appendChild(alertDiv);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                } else {
                    // Create error alert
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = data.message || 'There was an error sending your message. Please try again later.';
                    
                    // Insert alert after form
                    contactForm.appendChild(alertDiv);
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                }
            })
            .catch(error => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Create error alert
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger mt-3';
                alertDiv.role = 'alert';
                alertDiv.innerHTML = 'Network error. Please try again later.';
                
                // Insert alert after form
                contactForm.appendChild(alertDiv);
                
                // Remove alert after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
                
                console.error('Error:', error);
            });
        });
    }
});