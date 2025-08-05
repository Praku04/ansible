<?php
/**
 * Database Configuration File
 * 
 * This file contains the database connection settings for the ElevateXperia website.
 * When deploying to Hostinger, update these values with your actual database credentials.
 */

// Database connection settings
define('DB_HOST', 'localhost');      // Database host (usually localhost on shared hosting)
define('DB_NAME', 'u123456789_elevatexperia');  // Your database name (update this)
define('DB_USER', 'u123456789_admin');          // Your database username (update this)
define('DB_PASS', 'YourStrongPassword123!');    // Your database password (update this)

// JWT Secret Key for authentication tokens
define('JWT_SECRET', 'your_secret_key_for_jwt_tokens_change_this_in_production');

// OAuth Configuration
define('OAUTH_REDIRECT_URI', 'https://yourdomain.com/php/oauth_handler.php'); // Update with your actual domain

// Google OAuth credentials
define('GOOGLE_CLIENT_ID', 'your-google-client-id');
define('GOOGLE_CLIENT_SECRET', 'your-google-client-secret');

// Facebook OAuth credentials
define('FACEBOOK_APP_ID', 'your-facebook-app-id');
define('FACEBOOK_APP_SECRET', 'your-facebook-app-secret');

// Twitter OAuth credentials
define('TWITTER_CONSUMER_KEY', 'your-twitter-consumer-key');
define('TWITTER_CONSUMER_SECRET', 'your-twitter-consumer-secret');

// LinkedIn OAuth credentials
define('LINKEDIN_CLIENT_ID', 'your-linkedin-client-id');
define('LINKEDIN_CLIENT_SECRET', 'your-linkedin-client-secret');

// Establish database connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    // Log the error but don't display sensitive information
    error_log('Database connection failed: ' . $e->getMessage());
    die('Database connection error. Please try again later.');
}