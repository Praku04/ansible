<?php
// Include database configuration
require_once 'php/db_config.php';

// Get available tours from database
$toursQuery = "SELECT id, title, description, duration, price FROM tours WHERE status = 'active' ORDER BY title";
$toursResult = $conn->query($toursQuery);

// Check if tour_id is provided in URL
$selectedTourId = isset($_GET['tour_id']) ? intval($_GET['tour_id']) : 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book a Tour - ElevateXperia</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <style>
        .booking-form {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .tour-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        .tour-card:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transform: translateY(-5px);
        }
        .tour-card.selected {
            border: 2px solid #0d6efd;
            background-color: rgba(13, 110, 253, 0.05);
        }
        .booking-success {
            display: none;
            background-color: #d4edda;
            color: #155724;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Include Header/Navigation -->
    <?php include 'includes/header.php'; ?>

    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5 mb-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>Book Your Educational Tour</h1>
                    <p class="lead">Reserve your spot for an unforgettable learning experience</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Booking Form Section -->
    <section class="booking-section py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <!-- Booking Success Message -->
                    <div id="bookingSuccess" class="booking-success mb-4">
                        <i class="fas fa-check-circle fa-4x mb-3 text-success"></i>
                        <h2>Booking Successful!</h2>
                        <p class="lead">Thank you for booking with ElevateXperia. We've sent a confirmation email with your booking details.</p>
                        <p>Your booking is currently pending confirmation. Our team will review your request and get back to you shortly.</p>
                        <a href="index.php" class="btn btn-primary mt-3">Return to Home</a>
                    </div>

                    <!-- Booking Form -->
                    <div id="bookingForm" class="booking-form">
                        <h2 class="text-center mb-4">Tour Booking Form</h2>
                        
                        <!-- Tour Selection -->
                        <div class="mb-4">
                            <h4>Select a Tour</h4>
                            <div class="row">
                                <?php if ($toursResult && $toursResult->num_rows > 0): ?>
                                    <?php while($tour = $toursResult->fetch_assoc()): ?>
                                        <div class="col-md-6 mb-3">
                                            <div class="tour-card <?php echo ($tour['id'] == $selectedTourId) ? 'selected' : ''; ?>" 
                                                 data-tour-id="<?php echo $tour['id']; ?>" 
                                                 onclick="selectTour(this, <?php echo $tour['id']; ?>)">
                                                <h5><?php echo htmlspecialchars($tour['title']); ?></h5>
                                                <p class="small"><?php echo htmlspecialchars(substr($tour['description'], 0, 100)) . '...'; ?></p>
                                                <div class="d-flex justify-content-between">
                                                    <span><i class="far fa-clock"></i> <?php echo htmlspecialchars($tour['duration']); ?></span>
                                                    <span><strong>$<?php echo htmlspecialchars($tour['price']); ?></strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <div class="col-12">
                                        <div class="alert alert-info">No tours are currently available. Please check back later.</div>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <form id="tourBookingForm">
                            <input type="hidden" id="tour_id" name="tour_id" value="<?php echo $selectedTourId; ?>">
                            
                            <!-- Personal Information -->
                            <div class="mb-4">
                                <h4>Personal Information</h4>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="name" class="form-label">Full Name *</label>
                                        <input type="text" class="form-control" id="name" name="name" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="email" class="form-label">Email Address *</label>
                                        <input type="email" class="form-control" id="email" name="email" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="phone" class="form-label">Phone Number *</label>
                                        <input type="tel" class="form-control" id="phone" name="phone" required>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Booking Details -->
                            <div class="mb-4">
                                <h4>Booking Details</h4>
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label for="participants" class="form-label">Number of Participants *</label>
                                        <input type="number" class="form-control" id="participants" name="participants" min="1" value="1" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="booking_date" class="form-label">Preferred Date *</label>
                                        <input type="date" class="form-control" id="booking_date" name="booking_date" required>
                                    </div>
                                    <div class="col-12">
                                        <label for="special_requests" class="form-label">Special Requests or Requirements</label>
                                        <textarea class="form-control" id="special_requests" name="special_requests" rows="3" placeholder="Any dietary restrictions, accessibility needs, or other special requests?"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Terms and Conditions -->
                            <div class="mb-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="terms" required>
                                    <label class="form-check-label" for="terms">
                                        I agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">Terms and Conditions</a>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Error Messages -->
                            <div id="bookingErrors" class="alert alert-danger" style="display: none;"></div>
                            
                            <!-- Submit Button -->
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary btn-lg px-5" id="submitBooking">
                                    <span id="submitText">Submit Booking</span>
                                    <span id="loadingSpinner" class="spinner-border spinner-border-sm ms-2" role="status" style="display: none;"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Terms and Conditions Modal -->
    <div class="modal fade" id="termsModal" tabindex="-1" aria-labelledby="termsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="termsModalLabel">Terms and Conditions</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6>Booking and Payment</h6>
                    <p>All bookings are subject to availability and confirmation. A booking is not confirmed until you receive a confirmation email from ElevateXperia.</p>
                    
                    <h6>Cancellation Policy</h6>
                    <p>Cancellations made 30 days or more before the tour date will receive a full refund minus a 10% administrative fee. Cancellations made 15-29 days before the tour date will receive a 50% refund. No refunds will be issued for cancellations made less than 15 days before the tour date.</p>
                    
                    <h6>Changes to Bookings</h6>
                    <p>Any changes to bookings must be requested at least 15 days before the tour date and are subject to availability. A change fee may apply.</p>
                    
                    <h6>Participant Conduct</h6>
                    <p>All participants are expected to behave in a respectful and appropriate manner during the tour. ElevateXperia reserves the right to remove any participant who engages in disruptive or inappropriate behavior without refund.</p>
                    
                    <h6>Liability</h6>
                    <p>ElevateXperia is not responsible for any loss, damage, injury, or illness that may occur during the tour. Participants are advised to have appropriate travel insurance.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">I Understand</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Include Footer -->
    <?php include 'includes/footer.php'; ?>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AOS Animation Library -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Custom JS -->
    <script>
        // Initialize AOS
        AOS.init();
        
        // Set minimum date for booking to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('booking_date').min = tomorrow.toISOString().split('T')[0];
        
        // Function to select a tour
        function selectTour(element, tourId) {
            // Remove selected class from all tour cards
            document.querySelectorAll('.tour-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            element.classList.add('selected');
            
            // Update hidden tour_id input
            document.getElementById('tour_id').value = tourId;
        }
        
        // Handle form submission
        document.getElementById('tourBookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading spinner
            document.getElementById('submitText').textContent = 'Processing...';
            document.getElementById('loadingSpinner').style.display = 'inline-block';
            document.getElementById('submitBooking').disabled = true;
            document.getElementById('bookingErrors').style.display = 'none';
            
            // Get form data
            const formData = new FormData(this);
            
            // Send AJAX request
            fetch('php/book_tour.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading spinner
                document.getElementById('submitText').textContent = 'Submit Booking';
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('submitBooking').disabled = false;
                
                if (data.success) {
                    // Show success message
                    document.getElementById('bookingForm').style.display = 'none';
                    document.getElementById('bookingSuccess').style.display = 'block';
                    
                    // Scroll to success message
                    document.getElementById('bookingSuccess').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Show error messages
                    const errorDiv = document.getElementById('bookingErrors');
                    errorDiv.innerHTML = '';
                    
                    if (Array.isArray(data.errors)) {
                        const ul = document.createElement('ul');
                        data.errors.forEach(error => {
                            const li = document.createElement('li');
                            li.textContent = error;
                            ul.appendChild(li);
                        });
                        errorDiv.appendChild(ul);
                    } else {
                        errorDiv.textContent = 'An error occurred while processing your booking. Please try again.';
                    }
                    
                    errorDiv.style.display = 'block';
                    errorDiv.scrollIntoView({ behavior: 'smooth' });
                }
            })
            .catch(error => {
                // Handle network errors
                document.getElementById('submitText').textContent = 'Submit Booking';
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('submitBooking').disabled = false;
                
                const errorDiv = document.getElementById('bookingErrors');
                errorDiv.textContent = 'A network error occurred. Please check your connection and try again.';
                errorDiv.style.display = 'block';
                errorDiv.scrollIntoView({ behavior: 'smooth' });
                
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>