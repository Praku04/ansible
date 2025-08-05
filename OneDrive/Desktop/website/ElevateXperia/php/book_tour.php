<?php
/**
 * Book Tour PHP Script
 * Handles tour booking form submissions
 */

// Include database configuration
require_once 'db_config.php';

// Set headers for JSON response
header('Content-Type: application/json');

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $tourId = filter_input(INPUT_POST, 'tour_id', FILTER_SANITIZE_NUMBER_INT);
    $participants = filter_input(INPUT_POST, 'participants', FILTER_SANITIZE_NUMBER_INT);
    $bookingDate = filter_input(INPUT_POST, 'booking_date', FILTER_SANITIZE_STRING);
    $specialRequests = filter_input(INPUT_POST, 'special_requests', FILTER_SANITIZE_STRING);
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    // Validate inputs
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }
    
    if (empty($phone)) {
        $errors[] = "Phone number is required";
    }
    
    if (empty($tourId)) {
        $errors[] = "Tour selection is required";
    }
    
    if (empty($participants) || $participants < 1) {
        $errors[] = "Number of participants must be at least 1";
    }
    
    if (empty($bookingDate)) {
        $errors[] = "Booking date is required";
    }
    
    // Validate booking date (must be in the future)
    $currentDate = date('Y-m-d');
    $selectedDate = date('Y-m-d', strtotime($bookingDate));
    
    if ($selectedDate < $currentDate) {
        $errors[] = "Booking date must be in the future";
    }
    
    // Check if the tour exists
    $stmt = $conn->prepare("SELECT id, title FROM tours WHERE id = ?");
    $stmt->bind_param("i", $tourId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $errors[] = "Selected tour does not exist";
    } else {
        $tour = $result->fetch_assoc();
    }
    
    // If no errors, proceed with booking
    if (empty($errors)) {
        // Prepare SQL statement
        $sql = "INSERT INTO bookings (user_id, tour_id, name, email, phone, participants, booking_date, special_requests, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iisssisss", $userId, $tourId, $name, $email, $phone, $participants, $bookingDate, $specialRequests);
        
        // Execute the statement
        if ($stmt->execute()) {
            // Get the booking ID
            $bookingId = $conn->insert_id;
            
            // Send confirmation email
            $to = $email;
            $subject = "ElevateXperia Tour Booking Confirmation";
            $message = "<html><body>";
            $message .= "<h2>Thank you for booking with ElevateXperia!</h2>";
            $message .= "<p>Dear $name,</p>";
            $message .= "<p>Your booking has been received and is currently pending confirmation. Here are your booking details:</p>";
            $message .= "<p><strong>Booking ID:</strong> $bookingId</p>";
            $message .= "<p><strong>Tour:</strong> {$tour['title']}</p>";
            $message .= "<p><strong>Number of Participants:</strong> $participants</p>";
            $message .= "<p><strong>Booking Date:</strong> $bookingDate</p>";
            $message .= "<p>Our team will review your booking and contact you shortly to confirm the details and provide further information.</p>";
            $message .= "<p>If you have any questions, please contact us at info@elevatexperia.com or call us at +91 98765 43210.</p>";
            $message .= "<p>Thank you for choosing ElevateXperia for your educational journey!</p>";
            $message .= "<p>Best regards,<br>The ElevateXperia Team</p>";
            $message .= "</body></html>";
            
            // Set headers for HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: ElevateXperia <info@elevatexperia.com>" . "\r\n";
            
            // Send email
            mail($to, $subject, $message, $headers);
            
            // Send notification email to admin
            $adminEmail = "admin@elevatexperia.com"; // Change to actual admin email
            $adminSubject = "New Tour Booking - {$tour['title']}";
            
            $adminMessage = "<html><body>";
            $adminMessage .= "<h2>New Tour Booking Received</h2>";
            $adminMessage .= "<p>A new booking has been received for the <strong>{$tour['title']}</strong>.</p>";
            $adminMessage .= "<p><strong>Booking Details:</strong></p>";
            $adminMessage .= "<ul>";
            $adminMessage .= "<li><strong>Booking ID:</strong> {$bookingId}</li>";
            $adminMessage .= "<li><strong>Name:</strong> {$name}</li>";
            $adminMessage .= "<li><strong>Email:</strong> {$email}</li>";
            $adminMessage .= "<li><strong>Phone:</strong> {$phone}</li>";
            $adminMessage .= "<li><strong>Tour:</strong> {$tour['title']}</li>";
            $adminMessage .= "<li><strong>Date:</strong> {$bookingDate}</li>";
            $adminMessage .= "<li><strong>Number of Participants:</strong> {$participants}</li>";
            $adminMessage .= "<li><strong>Special Requests:</strong> {$specialRequests}</li>";
            $adminMessage .= "</ul>";
            $adminMessage .= "<p>Please log in to the admin dashboard to review and confirm this booking.</p>";
            $adminMessage .= "</body></html>";
            
            // Send admin notification
            mail($adminEmail, $adminSubject, $adminMessage, $headers);
            
            // Return success response
            $response = [
                'status' => 'success',
                'message' => 'Your booking has been submitted successfully. We will contact you shortly to confirm the details.',
                'booking_id' => $bookingId
            ];
        } else {
            // Return error response
            $response = [
                'status' => 'error',
                'message' => 'Sorry, there was an error processing your booking. Please try again later.'
            ];
        }
    } else {
        // Return validation errors
        $response = [
            'status' => 'error',
            'message' => 'Please correct the following errors:',
            'errors' => $errors
        ];
    }
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// If not a POST request, redirect to the homepage
header("Location: ../index.html");
exit;
?>