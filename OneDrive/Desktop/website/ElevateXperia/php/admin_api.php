<?php
// Include database configuration
require_once 'db_config.php';

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in and has admin role
function isAdmin() {
    return isset($_SESSION['user_id']) && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Set headers for JSON response
header('Content-Type: application/json');

// Check if user is admin, if not return unauthorized error
if (!isAdmin()) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized access'
    ]);
    exit;
}

// Get request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Handle different endpoints
switch ($endpoint) {
    case 'tours':
        handleTours($method, $conn);
        break;
    case 'programs':
        handlePrograms($method, $conn);
        break;
    case 'bookings':
        handleBookings($method, $conn);
        break;
    case 'users':
        handleUsers($method, $conn);
        break;
    case 'dashboard':
        getDashboardStats($conn);
        break;
    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid endpoint'
        ]);
        break;
}

// Handle tours endpoint
function handleTours($method, $conn) {
    switch ($method) {
        case 'GET':
            // Get all tours or a specific tour
            if (isset($_GET['id'])) {
                // Get specific tour
                $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
                $stmt = $conn->prepare("SELECT * FROM tours WHERE id = ?");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();
                $tour = $result->fetch_assoc();
                
                if ($tour) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $tour
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Tour not found'
                    ]);
                }
            } else {
                // Get all tours
                $result = $conn->query("SELECT * FROM tours ORDER BY created_at DESC");
                $tours = [];
                
                while ($row = $result->fetch_assoc()) {
                    $tours[] = $row;
                }
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $tours
                ]);
            }
            break;
            
        case 'POST':
            // Create new tour
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            if (!isset($data['title']) || !isset($data['description']) || !isset($data['duration']) || 
                !isset($data['destination']) || !isset($data['price']) || !isset($data['image_url'])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields'
                ]);
                break;
            }
            
            // Prepare and execute query
            $stmt = $conn->prepare("INSERT INTO tours (title, description, duration, destination, price, image_url, featured, created_at) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
            $featured = isset($data['featured']) ? 1 : 0;
            $stmt->bind_param("ssssdsi", $data['title'], $data['description'], $data['duration'], 
                             $data['destination'], $data['price'], $data['image_url'], $featured);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Tour created successfully',
                    'id' => $conn->insert_id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create tour: ' . $conn->error
                ]);
            }
            break;
            
        case 'PUT':
            // Update existing tour
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Tour ID is required'
                ]);
                break;
            }
            
            // Prepare update query
            $query = "UPDATE tours SET ";
            $params = [];
            $types = "";
            
            // Add fields to update
            if (isset($data['title'])) {
                $query .= "title = ?, ";
                $params[] = $data['title'];
                $types .= "s";
            }
            
            if (isset($data['description'])) {
                $query .= "description = ?, ";
                $params[] = $data['description'];
                $types .= "s";
            }
            
            if (isset($data['duration'])) {
                $query .= "duration = ?, ";
                $params[] = $data['duration'];
                $types .= "s";
            }
            
            if (isset($data['destination'])) {
                $query .= "destination = ?, ";
                $params[] = $data['destination'];
                $types .= "s";
            }
            
            if (isset($data['price'])) {
                $query .= "price = ?, ";
                $params[] = $data['price'];
                $types .= "d";
            }
            
            if (isset($data['image_url'])) {
                $query .= "image_url = ?, ";
                $params[] = $data['image_url'];
                $types .= "s";
            }
            
            if (isset($data['featured'])) {
                $query .= "featured = ?, ";
                $params[] = $data['featured'] ? 1 : 0;
                $types .= "i";
            }
            
            // Remove trailing comma and add WHERE clause
            $query = rtrim($query, ", ") . " WHERE id = ?";
            $params[] = $data['id'];
            $types .= "i";
            
            // Execute update query
            $stmt = $conn->prepare($query);
            $stmt->bind_param($types, ...$params);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Tour updated successfully'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update tour: ' . $conn->error
                ]);
            }
            break;
            
        case 'DELETE':
            // Delete tour
            if (isset($_GET['id'])) {
                $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
                $stmt = $conn->prepare("DELETE FROM tours WHERE id = ?");
                $stmt->bind_param("i", $id);
                
                if ($stmt->execute()) {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Tour deleted successfully'
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Failed to delete tour: ' . $conn->error
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Tour ID is required'
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'status' => 'error',
                'message' => 'Method not allowed'
            ]);
            break;
    }
}

// Handle programs endpoint
function handlePrograms($method, $conn) {
    // Similar structure to handleTours function
    // Implementation for programs CRUD operations
    switch ($method) {
        case 'GET':
            // Get all programs or a specific program
            if (isset($_GET['id'])) {
                $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
                $stmt = $conn->prepare("SELECT * FROM programs WHERE id = ?");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();
                $program = $result->fetch_assoc();
                
                if ($program) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $program
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Program not found'
                    ]);
                }
            } else {
                $result = $conn->query("SELECT * FROM programs ORDER BY created_at DESC");
                $programs = [];
                
                while ($row = $result->fetch_assoc()) {
                    $programs[] = $row;
                }
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $programs
                ]);
            }
            break;
            
        case 'POST':
            // Create new program
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || !isset($data['description']) || !isset($data['type']) || 
                !isset($data['duration']) || !isset($data['highlights']) || !isset($data['image_url'])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Missing required fields'
                ]);
                break;
            }
            
            $stmt = $conn->prepare("INSERT INTO programs (name, description, type, duration, highlights, image_url, created_at) 
                                   VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $stmt->bind_param("ssssss", $data['name'], $data['description'], $data['type'], 
                             $data['duration'], $data['highlights'], $data['image_url']);
            
            if ($stmt->execute()) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Program created successfully',
                    'id' => $conn->insert_id
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to create program: ' . $conn->error
                ]);
            }
            break;
            
        // PUT and DELETE methods would be similar to the tours endpoint
        // Omitted for brevity
        
        default:
            echo json_encode([
                'status' => 'error',
                'message' => 'Method not allowed'
            ]);
            break;
    }
}

// Handle bookings endpoint
function handleBookings($method, $conn) {
    switch ($method) {
        case 'GET':
            // Get all bookings or a specific booking
            if (isset($_GET['id'])) {
                $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
                $stmt = $conn->prepare("SELECT b.*, t.title as tour_title FROM bookings b 
                                       JOIN tours t ON b.tour_id = t.id WHERE b.id = ?");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();
                $booking = $result->fetch_assoc();
                
                if ($booking) {
                    echo json_encode([
                        'status' => 'success',
                        'data' => $booking
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Booking not found'
                    ]);
                }
            } else {
                $result = $conn->query("SELECT b.*, t.title as tour_title FROM bookings b 
                                      JOIN tours t ON b.tour_id = t.id ORDER BY b.created_at DESC");
                $bookings = [];
                
                while ($row = $result->fetch_assoc()) {
                    $bookings[] = $row;
                }
                
                echo json_encode([
                    'status' => 'success',
                    'data' => $bookings
                ]);
            }
            break;
            
        case 'PUT':
            // Update booking status
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id']) || !isset($data['status'])) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Booking ID and status are required'
                ]);
                break;
            }
            
            // Validate status
            $validStatuses = ['pending', 'confirmed', 'cancelled'];
            if (!in_array($data['status'], $validStatuses)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid status. Must be one of: ' . implode(', ', $validStatuses)
                ]);
                break;
            }
            
            $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
            $stmt->bind_param("si", $data['status'], $data['id']);
            
            if ($stmt->execute()) {
                // Get booking details for email notification
                $stmt = $conn->prepare("SELECT b.*, t.title as tour_title FROM bookings b 
                                       JOIN tours t ON b.tour_id = t.id WHERE b.id = ?");
                $stmt->bind_param("i", $data['id']);
                $stmt->execute();
                $result = $stmt->get_result();
                $booking = $result->fetch_assoc();
                
                if ($booking) {
                    // Send status update email
                    $to = $booking['email'];
                    $subject = "ElevateXperia Booking Status Update";
                    $message = "<html><body>";
                    $message .= "<h2>Your Booking Status Has Been Updated</h2>";
                    $message .= "<p>Dear {$booking['name']},</p>";
                    $message .= "<p>Your booking for <strong>{$booking['tour_title']}</strong> has been <strong>{$data['status']}</strong>.</p>";
                    
                    if ($data['status'] == 'confirmed') {
                        $message .= "<p>We're excited to have you join us! Here are your booking details:</p>";
                        $message .= "<p><strong>Booking ID:</strong> {$booking['id']}</p>";
                        $message .= "<p><strong>Tour:</strong> {$booking['tour_title']}</p>";
                        $message .= "<p><strong>Date:</strong> {$booking['booking_date']}</p>";
                        $message .= "<p><strong>Participants:</strong> {$booking['participants']}</p>";
                        $message .= "<p>Our team will contact you shortly with more details about the tour.</p>";
                    } elseif ($data['status'] == 'cancelled') {
                        $message .= "<p>We're sorry to inform you that your booking has been cancelled. If you have any questions, please contact us.</p>";
                    }
                    
                    $message .= "<p>If you have any questions, please contact us at info@elevatexperia.com or call us at +91 98765 43210.</p>";
                    $message .= "<p>Thank you for choosing ElevateXperia!</p>";
                    $message .= "<p>Best regards,<br>The ElevateXperia Team</p>";
                    $message .= "</body></html>";
                    
                    // Set headers for HTML email
                    $headers = "MIME-Version: 1.0" . "\r\n";
                    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
                    $headers .= "From: ElevateXperia <info@elevatexperia.com>" . "\r\n";
                    
                    // Send email
                    mail($to, $subject, $message, $headers);
                }
                
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Booking status updated successfully'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Failed to update booking status: ' . $conn->error
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'status' => 'error',
                'message' => 'Method not allowed'
            ]);
            break;
    }
}

// Handle users endpoint
function handleUsers($method, $conn) {
    // Implementation for user management
    // Omitted for brevity
}

// Get dashboard statistics
function getDashboardStats($conn) {
    // Get total bookings
    $result = $conn->query("SELECT COUNT(*) as total FROM bookings");
    $totalBookings = $result->fetch_assoc()['total'];
    
    // Get pending bookings
    $result = $conn->query("SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'");
    $pendingBookings = $result->fetch_assoc()['pending'];
    
    // Get total subscribers
    $result = $conn->query("SELECT COUNT(*) as total FROM subscribers WHERE status = 'active'");
    $totalSubscribers = $result->fetch_assoc()['total'];
    
    // Get total enquiries
    $result = $conn->query("SELECT COUNT(*) as total FROM enquiries");
    $totalEnquiries = $result->fetch_assoc()['total'];
    
    // Get recent bookings
    $result = $conn->query("SELECT b.*, t.title as tour_title FROM bookings b 
                          JOIN tours t ON b.tour_id = t.id ORDER BY b.created_at DESC LIMIT 5");
    $recentBookings = [];
    
    while ($row = $result->fetch_assoc()) {
        $recentBookings[] = $row;
    }
    
    // Return dashboard stats
    echo json_encode([
        'status' => 'success',
        'data' => [
            'totalBookings' => $totalBookings,
            'pendingBookings' => $pendingBookings,
            'totalSubscribers' => $totalSubscribers,
            'totalEnquiries' => $totalEnquiries,
            'recentBookings' => $recentBookings
        ]
    ]);
}
?>