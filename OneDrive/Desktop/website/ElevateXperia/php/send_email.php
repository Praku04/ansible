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
if (
    !isset($data['name']) || 
    !isset($data['email']) || 
    !isset($data['phone']) || 
    !isset($data['enquiryType']) || 
    !isset($data['message'])
) {
    $response["message"] = "Missing required fields";
    echo json_encode($response);
    exit();
}

// Sanitize inputs
$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = filter_var($data['phone'], FILTER_SANITIZE_STRING);
$enquiryType = filter_var($data['enquiryType'], FILTER_SANITIZE_STRING);
$message = filter_var($data['message'], FILTER_SANITIZE_STRING);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response["message"] = "Invalid email format";
    echo json_encode($response);
    exit();
}

// Set recipient email (change this to your actual email)
$to = "info@elevatexperia.com";

// Set email subject
$subject = "New Enquiry from ElevateXperia Website: " . $enquiryType;

// Create email body
$email_body = "<html><body>";
$email_body .= "<h2>New Enquiry from ElevateXperia Website</h2>";
$email_body .= "<p><strong>Name:</strong> {$name}</p>";
$email_body .= "<p><strong>Email:</strong> {$email}</p>";
$email_body .= "<p><strong>Phone:</strong> {$phone}</p>";
$email_body .= "<p><strong>Enquiry Type:</strong> {$enquiryType}</p>";
$email_body .= "<p><strong>Message:</strong><br>{$message}</p>";
$email_body .= "<p>This email was sent from the contact form on ElevateXperia website.</p>";
$email_body .= "</body></html>";

// Set email headers
$headers = "From: {$email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Send email
$mail_sent = mail($to, $subject, $email_body, $headers);

// Store in database and check if email was sent successfully
if ($mail_sent) {
    // Prepare an insert statement
    $sql = "INSERT INTO enquiries (name, email, phone, enquiry_type, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    
    if ($stmt = $conn->prepare($sql)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("sssss", $name, $email, $phone, $enquiryType, $message);
        
        // Execute the statement
        if ($stmt->execute()) {
            // Record saved successfully
            $response["success"] = true;
            $response["message"] = "Thank you for your enquiry! We will contact you soon.";
        } else {
            // Email sent but database storage failed
            $response["success"] = true; // Still mark as success since email was sent
            $response["message"] = "Thank you for your enquiry! We will contact you soon.";
            // Log the error
            error_log("Database error: " . $stmt->error);
        }
        
        // Close statement
        $stmt->close();
    } else {
        // Email sent but database preparation failed
        $response["success"] = true; // Still mark as success since email was sent
        $response["message"] = "Thank you for your enquiry! We will contact you soon.";
        // Log the error
        error_log("Database prepare error: " . $conn->error);
    }
} else {
    $response["message"] = "Failed to send email. Please try again later.";
}

// Close connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>