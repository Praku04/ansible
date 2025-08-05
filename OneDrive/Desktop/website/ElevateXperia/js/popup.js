// Popup functionality for ElevateXperia website
document.addEventListener('DOMContentLoaded', function() {
    // Create popup elements
    createPopupElements();
    
    // Initialize popup functionality with 3-minute delay
    setTimeout(function() {
        showPopup();
    }, 180000); // 3 minutes in milliseconds
});

// Function to create popup elements
function createPopupElements() {
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    popupContainer.id = 'popupContainer';
    popupContainer.innerHTML = `
        <div class="popup-box">
            <div class="popup-header">
                <h4>Special Offer!</h4>
                <button class="popup-close" id="popupClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="popup-content">
                <img src="assets/images/popup-image.svg" alt="Special Offer" class="popup-image">
                <h5>Get 15% Off Your First Tour Booking!</h5>
                <p>Subscribe to our newsletter and receive exclusive offers, travel tips, and early access to new tour programs.</p>
                <form id="popupSubscribeForm" class="popup-form">
                    <div class="form-group mb-3">
                        <input type="email" class="form-control" id="popupEmail" placeholder="Your Email Address" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Subscribe Now</button>
                </form>
                <div class="popup-success" id="popupSuccess" style="display: none;">
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing! Your discount code has been sent to your email.</p>
                </div>
            </div>
            <div class="popup-footer">
                <label class="popup-checkbox">
                    <input type="checkbox" id="dontShowAgain"> Don't show this again
                </label>
            </div>
        </div>
    `;
    
    // Add popup container to the body
    document.body.appendChild(popupContainer);
    
    // Add popup styles
    const popupStyles = document.createElement('style');
    popupStyles.innerHTML = `
        .popup-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .popup-container.show {
            display: flex;
            opacity: 1;
        }
        
        .popup-box {
            background-color: white;
            width: 90%;
            max-width: 500px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            animation: popup-animation 0.5s forwards;
        }
        
        @keyframes popup-animation {
            0% {
                transform: scale(0.8);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .popup-header {
            padding: 15px 20px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .popup-header h4 {
            margin: 0;
            font-weight: 600;
        }
        
        .popup-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 18px;
            transition: transform 0.3s ease;
        }
        
        .popup-close:hover {
            transform: scale(1.2);
        }
        
        .popup-content {
            padding: 25px;
            text-align: center;
        }
        
        .popup-image {
            width: 150px;
            margin-bottom: 20px;
        }
        
        .popup-content h5 {
            font-size: 1.4rem;
            margin-bottom: 15px;
            color: var(--primary-color);
            font-weight: 700;
        }
        
        .popup-content p {
            margin-bottom: 20px;
            color: #555;
        }
        
        .popup-form .form-control {
            border-radius: 30px;
            padding: 12px 20px;
            border: 2px solid #e0e0e0;
        }
        
        .popup-form .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.25rem rgba(var(--primary-color-rgb), 0.25);
        }
        
        .popup-success {
            text-align: center;
            padding: 15px;
        }
        
        .popup-success i {
            font-size: 3rem;
            color: var(--success-color);
            margin-bottom: 15px;
        }
        
        .popup-footer {
            padding: 15px 25px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: center;
        }
        
        .popup-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 0.9rem;
            color: #666;
        }
        
        .popup-checkbox input {
            margin-right: 8px;
        }
        
        @media (max-width: 576px) {
            .popup-box {
                width: 95%;
                max-width: 350px;
            }
            
            .popup-content h5 {
                font-size: 1.2rem;
            }
            
            .popup-image {
                width: 120px;
            }
        }
    `;
    
    // Add styles to the head
    document.head.appendChild(popupStyles);
}

// Function to show popup
function showPopup() {
    // Check if user has opted to not show the popup again
    if (localStorage.getItem('dontShowPopup') === 'true') {
        return;
    }
    
    const popupContainer = document.getElementById('popupContainer');
    const popupClose = document.getElementById('popupClose');
    const dontShowAgain = document.getElementById('dontShowAgain');
    const popupSubscribeForm = document.getElementById('popupSubscribeForm');
    const popupSuccess = document.getElementById('popupSuccess');
    
    // Show popup
    popupContainer.classList.add('show');
    
    // Close popup when close button is clicked
    popupClose.addEventListener('click', function() {
        popupContainer.classList.remove('show');
    });
    
    // Handle "Don't show again" checkbox
    dontShowAgain.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('dontShowPopup', 'true');
        } else {
            localStorage.removeItem('dontShowPopup');
        }
    });
    
    // Handle form submission
    popupSubscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('popupEmail').value;
        
        // Here you would typically send the email to your server
        // For now, we'll just simulate a successful subscription
        
        // Hide form and show success message
        popupSubscribeForm.style.display = 'none';
        popupSuccess.style.display = 'block';
        
        // Close popup after 3 seconds
        setTimeout(function() {
            popupContainer.classList.remove('show');
            
            // Reset form for next time
            setTimeout(function() {
                popupSubscribeForm.style.display = 'block';
                popupSuccess.style.display = 'none';
                popupSubscribeForm.reset();
            }, 1000);
        }, 3000);
    });
    
    // Close popup when clicking outside
    popupContainer.addEventListener('click', function(e) {
        if (e.target === popupContainer) {
            popupContainer.classList.remove('show');
        }
    });
}