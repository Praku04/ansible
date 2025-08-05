# ElevateXperia Website

## Hosting on Hostinger and Database Setup Guide

This document provides instructions for hosting the ElevateXperia website on Hostinger shared servers and setting up a database connection. This guide covers deployment of all features including the AI-powered chatbot, tour booking system, and admin dashboard.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Hosting on Hostinger](#hosting-on-hostinger)
3. [Database Setup](#database-setup)
4. [Connecting to the Database](#connecting-to-the-database)
5. [Email Form Configuration](#email-form-configuration)
6. [AI Chatbot Configuration](#ai-chatbot-configuration)
7. [Admin Dashboard Setup](#admin-dashboard-setup)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- A Hostinger account with a shared hosting plan
- Domain name (either purchased through Hostinger or externally)
- FTP client (like FileZilla) or access to Hostinger's File Manager
- Basic knowledge of PHP and MySQL
- OpenAI API key for the chatbot functionality
- SSL certificate (recommended for secure API calls)

## Hosting on Hostinger

### Step 1: Purchase a Hosting Plan

1. Sign up for a Hostinger account at [https://www.hostinger.com](https://www.hostinger.com)
2. Choose a shared hosting plan that fits your needs
3. Complete the purchase process

### Step 2: Set Up Your Domain

1. Log in to your Hostinger account
2. Navigate to the Domains section
3. Either register a new domain or connect an existing domain
4. Follow the instructions to point your domain to Hostinger's nameservers

### Step 3: Upload Your Website Files

#### Using File Manager:

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to "File Manager"
3. Go to the `public_html` directory
4. Upload all your website files to this directory

#### Using FTP:

1. Get your FTP credentials from the Hostinger control panel
2. Connect to your server using an FTP client like FileZilla
3. Upload all your website files to the `public_html` directory

## Database Setup

### Step 1: Create a MySQL Database

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to "Databases" → "MySQL Databases"
3. Create a new database:
   - Enter a database name
   - Create a new database user with a strong password
   - Assign all privileges to the user
4. Note down the database name, username, password, and hostname

### Step 2: Import Database Structure (if needed)

1. In the Hostinger control panel, go to "Databases" → "phpMyAdmin"
2. Select your newly created database
3. Go to the "Import" tab
4. Upload your SQL file and click "Go" to import your database structure

## Connecting to the Database

### Step 1: Create a Database Connection File

Create a file named `db_config.php` in your website's `php` directory with the following content:

```php
<?php
// Database configuration
define('DB_SERVER', 'localhost'); // Usually 'localhost' for shared hosting
define('DB_USERNAME', 'your_db_username'); // Replace with your database username
define('DB_PASSWORD', 'your_db_password'); // Replace with your database password
define('DB_NAME', 'your_db_name'); // Replace with your database name

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

### Step 2: Use the Connection in Your PHP Files

Include the database connection file at the beginning of any PHP file that needs database access:

```php
<?php
// Include database connection file
require_once "php/db_config.php";

// Your PHP code that uses the database connection
// ...
?>
```

### Example: Storing Form Submissions in Database

Modify your `send_email.php` file to also store form submissions in the database:

```php
<?php
// Include database connection
require_once "db_config.php";

// Rest of your email sending code...

// After sending email, store in database
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
    }
} else {
    $response["message"] = "Failed to send email. Please try again later.";
}

// Close connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>
```

### Database Table Structure

Create the following tables in your database:

```sql
CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `enquiry_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `participants` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `chatbot_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_input` text NOT NULL,
  `ai_response` text NOT NULL,
  `user_ip` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Email Form Configuration

### PHP Mail Configuration on Hostinger

Hostinger's shared hosting plans come with PHP mail function enabled by default. However, you might need to adjust some settings:

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to "Advanced" → "PHP Configuration"
3. Make sure the mail function is enabled

### Using Hostinger's SMTP Server (Alternative Method)

For more reliable email delivery, you can use Hostinger's SMTP server instead of the PHP mail function. Create a file named `smtp_config.php` in your website's `php` directory:

```php
<?php
// SMTP configuration for Hostinger
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@yourdomain.com'); // Use your Hostinger email
define('SMTP_PASSWORD', 'your-email-password');
define('SMTP_FROM', 'your-email@yourdomain.com');
define('SMTP_FROM_NAME', 'ElevateXperia');
?>
```

Then install PHPMailer using Hostinger's SSH access or by uploading the files manually, and modify your `send_email.php` to use PHPMailer with SMTP.

## AI Chatbot Configuration

### Setting Up the OpenAI API Integration

1. Create a file named `chatbot_api.php` in your website's `php` directory:

```php
<?php
// OpenAI API configuration
define('OPENAI_API_KEY', 'your-openai-api-key'); // Replace with your actual API key
define('OPENAI_MODEL', 'gpt-3.5-turbo'); // Or your preferred model
define('MAX_TOKENS', 150); // Adjust based on your needs

// Function to get chatbot response
function getChatbotResponse($userInput) {
    $url = 'https://api.openai.com/v1/chat/completions';
    
    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . OPENAI_API_KEY
    ];
    
    $data = [
        'model' => OPENAI_MODEL,
        'messages' => [
            ['role' => 'system', 'content' => 'You are a helpful assistant for ElevateXperia educational tours.'],
            ['role' => 'user', 'content' => $userInput]
        ],
        'max_tokens' => MAX_TOKENS,
        'temperature' => 0.7
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    // Log the conversation
    logChatbotConversation($userInput, $responseData['choices'][0]['message']['content']);
    
    return $responseData['choices'][0]['message']['content'];
}

// Function to log chatbot conversations
function logChatbotConversation($userInput, $aiResponse) {
    global $conn;
    
    $sql = "INSERT INTO chatbot_logs (user_input, ai_response, user_ip, created_at) VALUES (?, ?, ?, NOW())";
    
    if ($stmt = $conn->prepare($sql)) {
        $userIp = $_SERVER['REMOTE_ADDR'];
        $stmt->bind_param("sss", $userInput, $aiResponse, $userIp);
        $stmt->execute();
        $stmt->close();
    }
}
?>
```

## Admin Dashboard Setup

1. Create a login system for admin access:

```php
<?php
// admin_login.php
session_start();
require_once "php/db_config.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    
    $sql = "SELECT id, username, password, role FROM users WHERE username = ?";
    
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $username);
        
        if ($stmt->execute()) {
            $stmt->store_result();
            
            if ($stmt->num_rows == 1) {
                $stmt->bind_result($id, $username, $hashed_password, $role);
                
                if ($stmt->fetch()) {
                    if (password_verify($password, $hashed_password) && $role == 'admin') {
                        $_SESSION["loggedin"] = true;
                        $_SESSION["id"] = $id;
                        $_SESSION["username"] = $username;
                        $_SESSION["role"] = $role;
                        
                        header("location: admin/dashboard.php");
                    } else {
                        $error = "Invalid password or insufficient permissions.";
                    }
                }
            } else {
                $error = "Invalid username.";
            }
        } else {
            $error = "Database error. Please try again later.";
        }
        
        $stmt->close();
    }
    
    $conn->close();
}
?>
```

## Troubleshooting

### Common Issues and Solutions

1. **Website Not Loading**
   - Check if all files are uploaded to the correct directory
   - Verify that your domain is properly pointed to Hostinger's nameservers
   - Check for any error logs in the Hostinger control panel

2. **Database Connection Errors**
   - Verify your database credentials
   - Check if the database user has the correct permissions
   - Make sure your PHP version is compatible with your code

3. **Email Not Sending**
   - Check if PHP mail function is enabled
   - Verify that your server allows outgoing emails
   - Consider using SMTP instead of the PHP mail function
   - Check spam folders for test emails

4. **File Upload Limits**
   - If you're uploading large files, you might need to adjust PHP settings
   - In the Hostinger control panel, go to "Advanced" → "PHP Configuration"
   - Increase values for `upload_max_filesize` and `post_max_size`

5. **OpenAI API Issues**
   - Verify your API key is correct and has sufficient credits
   - Check for rate limiting issues in the OpenAI dashboard
   - Ensure your server can make outbound HTTPS requests
   - Review the error logs for specific API error messages

### Getting Support

If you encounter issues that you can't resolve, Hostinger provides customer support through:

- Live chat support (available 24/7)
- Email support
- Knowledge base articles at [https://support.hostinger.com](https://support.hostinger.com)

---

For any additional questions or customizations, please contact your web developer or Hostinger support team.