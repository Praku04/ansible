<?php
header('Content-Type: application/json');

// Database connection
require_once 'db_config.php';

// Get user message from POST request
$data = json_decode(file_get_contents('php://input'), true);
$userMessage = $data['message'] ?? '';
$sessionId = $data['session_id'] ?? session_id();

// OpenAI API configuration
$apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual API key
$apiUrl = 'https://api.openai.com/v1/chat/completions';

// Prepare context for the AI
$context = [
    ['role' => 'system', 'content' => 'You are a helpful assistant for ElevateXperia, an educational travel company that organizes study tours to prestigious colleges and companies across India and worldwide. Your name is ElevateXperia Assistant. Keep responses concise, friendly, and focused on educational tours, immersion programs, leadership walks, and related inquiries. If asked about pricing, suggest contacting the team for personalized quotes.'],
    ['role' => 'user', 'content' => $userMessage]
];

// Prepare request data
$requestData = [
    'model' => 'gpt-3.5-turbo',
    'messages' => $context,
    'max_tokens' => 150,
    'temperature' => 0.7
];

// Initialize cURL session
$ch = curl_init($apiUrl);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

// Execute cURL request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($ch);

// Process response
if ($httpCode == 200) {
    $responseData = json_decode($response, true);
    $botResponse = $responseData['choices'][0]['message']['content'] ?? 'Sorry, I couldn\'t process your request.';
    
    // Log conversation to database
    $stmt = $conn->prepare("INSERT INTO chatbot_logs (user_message, bot_response, session_id, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $userMessage, $botResponse, $sessionId);
    $stmt->execute();
    
    echo json_encode(['response' => $botResponse]);
} else {
    // Fallback response if API call fails
    echo json_encode(['response' => 'I\'m currently experiencing some technical difficulties. Please try again later or contact us directly at info@elevatexperia.com.']);
}

// Fallback function for when OpenAI API is not available or fails
function getFallbackResponse($message) {
    $message = strtolower($message);
    
    // Simple keyword matching for common questions
    if (strpos($message, 'hello') !== false || strpos($message, 'hi') !== false) {
        return "Hello! Welcome to ElevateXperia. How can I help you with our educational tours today?";
    } elseif (strpos($message, 'tour') !== false || strpos($message, 'program') !== false) {
        return "We offer various educational tours including Immersion Programs, Leadership Walks, Campus Tours, and Corporate Visits. Would you like more information about any specific program?";
    } elseif (strpos($message, 'price') !== false || strpos($message, 'cost') !== false) {
        return "Our program costs vary depending on the destination, duration, and inclusions. Please fill out the enquiry form on our website or contact us directly for a customized quote.";
    } elseif (strpos($message, 'contact') !== false) {
        return "You can reach us at +91 98765 43210 or email us at info@elevatexperia.com. Alternatively, you can fill out the contact form on our website.";
    } else {
        return "I'm here to help with information about our educational tours and programs. Could you please ask a specific question about our services?";
    }
}
?>