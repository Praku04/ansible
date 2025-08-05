// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Here you would typically send the data to your server for authentication
            // For demo purposes, we'll use a simple check
            if (email === 'admin@example.com' && password === 'password') {
                // Store authentication token in localStorage
                localStorage.setItem('authToken', 'demo-token');
                localStorage.setItem('userRole', 'admin');
                
                // Redirect to admin dashboard with a small delay to ensure storage is set
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 100);
            } else if (email && password) {
                // Regular user login
                localStorage.setItem('authToken', 'user-token');
                localStorage.setItem('userRole', 'user');
                
                // Redirect to home page
                window.location.href = '../index.html';
            } else {
                // Show error message
                const errorMessage = document.getElementById('loginErrorMessage');
                errorMessage.textContent = 'Invalid email or password';
                errorMessage.style.display = 'block';
            }
        });
    }

    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                const errorMessage = document.getElementById('registerErrorMessage');
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Here you would typically send the data to your server for registration
            // For demo purposes, we'll just show a success message and redirect
            alert(`Thank you for registering, ${name}! You can now log in with your credentials.`);
            window.location.href = 'bootstrap-login.html';
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // If we're on the logout page, the button will handle the logout
            // Otherwise, redirect to the logout page
            if (!window.location.href.includes('logout.html')) {
                // Redirect to logout page
                const isInPagesDir = window.location.href.includes('/pages/');
                window.location.href = isInPagesDir ? 'bootstrap-logout.html' : 'pages/bootstrap-logout.html';
            } else {
                // Clear authentication data
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                
                // Redirect to home page
                window.location.href = '../index.html';
            }
        });
    }

    // Check authentication status on page load
    function checkAuth() {
        const authToken = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole');
        const loginBtn = document.querySelector('.login-btn');
        
        // Check if we're on the admin dashboard page and redirect if not authorized
        const isAdminDashboard = window.location.href.includes('admin-dashboard.html');
        if (isAdminDashboard && (!authToken || userRole !== 'admin')) {
            window.location.href = 'bootstrap-login.html';
            return;
        }
        
        if (authToken) {
            // User is logged in
            if (loginBtn) {
                loginBtn.textContent = 'My Account';
                // Fix path based on current location
                const isInPagesDir = window.location.href.includes('/pages/');
                loginBtn.href = userRole === 'admin' ? 
                    (isInPagesDir ? 'admin-dashboard.html' : 'pages/admin-dashboard.html') : '#';
            }
            
            // Add logout button to navigation if not already present
            const navbarNav = document.getElementById('navbarNav');
            if (navbarNav && !document.getElementById('logoutButton')) {
                const navList = navbarNav.querySelector('ul');
                const logoutItem = document.createElement('li');
                logoutItem.className = 'nav-item';
                // Create logout button with proper path
                const isInPagesDir = window.location.href.includes('/pages/');
                const logoutPath = isInPagesDir ? 'bootstrap-logout.html' : 'pages/bootstrap-logout.html';
                logoutItem.innerHTML = `<a class="nav-link btn btn-outline-light logout-btn" href="${logoutPath}" id="logoutButton">Logout</a>`;
                navList.appendChild(logoutItem);
                
                // Add event listener to the newly created button
                document.getElementById('logoutButton').addEventListener('click', function(e) {
                    e.preventDefault();
                    // Redirect to logout page instead of immediately logging out
                    window.location.href = logoutPath;
                });
            }
        }
    }
    
    // Run auth check
    checkAuth();
});