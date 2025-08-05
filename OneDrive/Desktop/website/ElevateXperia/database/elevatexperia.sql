-- Database structure for ElevateXperia website

-- Create database (if not already created through Hostinger panel)
-- CREATE DATABASE IF NOT EXISTS your_db_name;
-- USE your_db_name;

-- Enquiries table for storing contact form submissions
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `enquiry_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subscribers table for storing newsletter subscribers
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `subscribed_at` datetime NOT NULL,
  `status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users table for admin access (if needed)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','editor') NOT NULL DEFAULT 'editor',
  `created_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample admin user (password is 'admin123' - change this in production!)
-- INSERT INTO `users` (`username`, `password`, `email`, `role`, `created_at`) VALUES
-- ('admin', '$2y$10$8KQT9cWRbqtj3GUl.zQO7.XWBnAiOzKYVZGKgZ9HvX/hsO0qErXVO', 'admin@elevatexperia.com', 'admin', NOW());

-- Tours table for storing tour information
CREATE TABLE IF NOT EXISTS `tours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `duration` varchar(20) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Programs table for storing educational programs
CREATE TABLE IF NOT EXISTS `programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `type` enum('immersion','leadership','campus','corporate') NOT NULL,
  `duration` varchar(20) NOT NULL,
  `highlights` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings table for storing tour bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `tour_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `participants` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Chatbot logs table for improving responses
CREATE TABLE IF NOT EXISTS `chatbot_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_message` text NOT NULL,
  `bot_response` text NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;