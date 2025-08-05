// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Fix for navbar collapse on mobile
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Subscription form submission with database storage
    const subscriptionForm = document.getElementById('subscriptionForm');
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('subscriptionEmail').value;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Create data object
            const formData = {
                email: email
            };
            
            // Send data to PHP script
            fetch('php/subscribe.php', {
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
                    alertDiv.innerHTML = data.message;
                    
                    // Insert alert after form
                    this.appendChild(alertDiv);
                    
                    // Reset form
                    this.reset();
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                } else {
                    // Create error alert
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = data.message || 'An error occurred. Please try again.';
                    
                    // Insert alert after form
                    this.appendChild(alertDiv);
                    
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
                this.appendChild(alertDiv);
                
                // Remove alert after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
                
                console.error('Error:', error);
            });
        });
    }

    // Enquiry form submission with email functionality
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const enquiryType = document.getElementById('enquiryType').value;
            const message = document.getElementById('message').value;
            
            // Create data object
            const formData = {
                name: name,
                email: email,
                phone: phone,
                enquiryType: enquiryType,
                message: message
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;
            
            // Send data to PHP script
            fetch('php/send_email.php', {
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
                    alertDiv.innerHTML = data.message;
                    
                    // Insert alert after form
                    this.appendChild(alertDiv);
                    
                    // Reset form
                    this.reset();
                    
                    // Remove alert after 5 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                } else {
                    // Create error alert
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger mt-3';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = data.message || 'An error occurred. Please try again.';
                    
                    // Insert alert after form
                    this.appendChild(alertDiv);
                    
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
                this.appendChild(alertDiv);
                
                // Remove alert after 5 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
                
                console.error('Error:', error);
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});