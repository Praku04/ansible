<?php
// Database configuration
// Replace these values with your actual database credentials when hosting on Hostinger
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