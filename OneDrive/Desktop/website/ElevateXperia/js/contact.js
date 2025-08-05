// Contact form handling script
document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form element
    const contactForm = document.getElementById('contactForm');
    
    // Check if contact form exists on the page
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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