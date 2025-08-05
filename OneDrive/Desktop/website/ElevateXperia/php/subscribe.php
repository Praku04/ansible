<?php
// Include database connection
require_once "db_config.php";

// Set headers to handle CORS and JSON responses
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Get the posted data
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

// Initialize response array
$response = array(
    "success" => false,
    "message" => ""
);

// Validate required fields
if (!isset($data['email'])) {
    $response["message"] = "Email address is required";
    echo json_encode($response);
    exit();
}

// Sanitize and validate email
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Invalid email format";
    echo json_encode($response);
    exit();
}

// Check if email already exists in subscribers table
$check_sql = "SELECT id FROM subscribers WHERE email = ?";
if ($stmt = $conn->prepare($check_sql)) {
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        // Email already exists
        $response["success"] = true;
        $response["message"] = "You are already subscribed to our newsletter!";
        $stmt->close();
        $conn->close();
        echo json_encode($response);
        exit();
    }
    $stmt->close();
}

// Insert new subscriber
$sql = "INSERT INTO subscribers (email, subscribed_at, status) VALUES (?, NOW(), 'active')";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("s", $email);
    
    if ($stmt->execute()) {
        // Send confirmation email
        $to = $email;
        $subject = "Thank you for subscribing to ElevateXperia Newsletter";
        
        $message = "<html><body>";
        $message .= "<h2>Welcome to ElevateXperia Newsletter!</h2>";
        $message .= "<p>Thank you for subscribing to our newsletter. You will now receive updates about our latest programs, educational insights, and special offers.</p>";
        $message .= "<p>If you have any questions, feel free to contact us at info@elevatexperia.com.</p>";
        $message .= "<p>Best regards,<br>The ElevateXperia Team</p>";
        $message .= "</body></html>";
        
        $headers = "From: info@elevatexperia.com\r\n";
        $headers .= "Reply-To: info@elevatexperia.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        
        mail($to, $subject, $message, $headers);
        
        // Success response
        $response["success"] = true;
        $response["message"] = "Thank you for subscribing to our newsletter!";
    } else {
        $response["message"] = "Something went wrong. Please try again later.";
        error_log("Database error: " . $stmt->error);
    }
    
    $stmt->close();
} else {
    $response["message"] = "Something went wrong. Please try again later.";
    error_log("Database prepare error: " . $conn->error);
}

// Close connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>