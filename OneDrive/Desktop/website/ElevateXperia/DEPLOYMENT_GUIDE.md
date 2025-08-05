# ElevateXperia Website Deployment Guide

## Deploying to Hostinger Shared Hosting

This guide provides step-by-step instructions for deploying the ElevateXperia website to Hostinger shared hosting, setting up the database, configuring the contact form with email functionality, and implementing the AI-powered chatbot, tour booking system, and admin dashboard.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Preparing Your Files](#preparing-your-files)
3. [Uploading to Hostinger](#uploading-to-hostinger)
4. [Setting Up the Database](#setting-up-the-database)
5. [Configuring Email Functionality](#configuring-email-functionality)
6. [Testing Your Website](#testing-your-website)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have:

- A Hostinger shared hosting account
- Your Hostinger control panel (hPanel) login credentials
- A registered domain name (either through Hostinger or another registrar)
- FTP client software (like FileZilla) installed on your computer
- The complete ElevateXperia website files
- OpenAI API key for the AI-powered chatbot

## Preparing Your Files

1. **Update Configuration Files**:
   - Open `php/db_config.php` and update the database credentials with the ones you'll create in Hostinger
   - In `php/send_email.php`, `php/subscribe.php`, and `php/book_tour.php`, update the email addresses to your actual business email
   - Update the OpenAI API key in `php/chatbot_api.php` with your actual API key

2. **Optimize Images and Assets**:
   - Make sure all images are properly optimized for web
   - The SVG files should already be optimized

3. **Create a Backup**:
   - Create a complete backup of your website files before uploading

## Uploading to Hostinger

### Using File Manager

1. Log in to your Hostinger account and access hPanel
2. Navigate to the "Files" section and click on "File Manager"
3. Go to the `public_html` directory (this is your website's root folder)
4. Click "Upload" and select all your website files
5. Wait for the upload to complete

### Using FTP

1. Get your FTP credentials from Hostinger hPanel:
   - Go to "Files" → "FTP Accounts"
   - Create a new FTP account or use the existing one
   - Note down the hostname, username, and password

2. Connect using FileZilla:
   - Open FileZilla
   - Enter the hostname, username, and password
   - Connect to the server

3. Upload files:
   - Navigate to the `public_html` directory on the remote server
   - Select all your local website files
   - Upload them to the remote server

## Setting Up the Database

1. **Create a MySQL Database**:
   - In Hostinger hPanel, go to "Databases" → "MySQL Databases"
   - Create a new database with a name like `elevatexperia_db`
   - Create a new database user with a strong password
   - Assign all privileges to this user
   - Note down the database name, username, and password

2. **Import Database Structure**:
   - Go to "Databases" → "phpMyAdmin"
   - Select your newly created database
   - Click on the "Import" tab
   - Upload the `database/elevatexperia.sql` file
   - Click "Go" to import the database structure

3. **Update Database Configuration**:
   - Edit the `php/db_config.php` file on the server:
     ```php
     define('DB_SERVER', 'localhost');
     define('DB_USERNAME', 'your_db_username'); // Replace with your actual username
     define('DB_PASSWORD', 'your_db_password'); // Replace with your actual password
     define('DB_NAME', 'your_db_name'); // Replace with your actual database name
     ```

## Configuring Email Functionality

### Using PHP mail() Function

The website is already configured to use the PHP `mail()` function, which should work on Hostinger shared hosting. However, you may need to verify a few settings:

1. **Check PHP mail Configuration**:
   - In Hostinger hPanel, go to "Advanced" → "PHP Configuration"
   - Make sure the mail function is enabled

2. **Update Sender Email**:
   - In `php/send_email.php` and `php/subscribe.php`, update the sender email to match your domain:
     ```php
     $headers = "From: info@yourdomain.com\r\n";
     ```

### Using SMTP (Alternative Method)

For more reliable email delivery, you can use Hostinger's SMTP server:

1. **Create an Email Account**:
   - In Hostinger hPanel, go to "Emails" → "Email Accounts"
   - Create a new email account (e.g., info@yourdomain.com)

2. **Install PHPMailer**:
   - Download PHPMailer from [GitHub](https://github.com/PHPMailer/PHPMailer)
   - Upload the PHPMailer files to a directory on your server (e.g., `php/PHPMailer/`)

3. **Create SMTP Configuration**:
   - Create a file named `smtp_config.php` in the `php` directory:
     ```php
     <?php
     define('SMTP_HOST', 'smtp.hostinger.com');
     define('SMTP_PORT', 587);
     define('SMTP_USERNAME', 'info@yourdomain.com');
     define('SMTP_PASSWORD', 'your-email-password');
     define('SMTP_FROM', 'info@yourdomain.com');
     define('SMTP_FROM_NAME', 'ElevateXperia');
     ?>
     ```

4. **Modify Email Scripts**:
   - Update `php/send_email.php` and `php/subscribe.php` to use PHPMailer with SMTP
   - Example implementation is provided in the README.md file

## Testing Your Website

1. **Check Website Loading**:
   - Visit your domain in a web browser
   - Verify that all pages load correctly
   - Check that all images and styles are displaying properly

2. **Test Contact Form**:
   - Fill out and submit the contact form
   - Verify that you receive the email
   - Check that the submission is stored in the database

3. **Test Subscription Form**:
   - Subscribe with a test email address
   - Verify that you receive the confirmation email
   - Check that the subscription is stored in the database

4. **Test AI Chatbot**:
   - Click on the chat icon
   - Ask several test questions to verify the AI responds correctly
   - Check that the conversation history is maintained

5. **Test Tour Booking System**:
   - Navigate to the Tours page
   - Attempt to book a tour with test information
   - Verify that you receive booking confirmation emails
   - Check that the booking is stored in the database

6. **Test Admin Dashboard**:
   - Navigate to the admin login page
   - Log in with your admin credentials
   - Verify you can view and manage tours, bookings, and user inquiries

## Troubleshooting

### Common Issues and Solutions

1. **Website Not Loading**:
   - Check if all files are uploaded to the correct directory
   - Verify that your domain is properly pointed to Hostinger's nameservers
   - Check for any error logs in the Hostinger control panel

2. **Database Connection Errors**:
   - Verify your database credentials in `php/db_config.php`
   - Check if the database user has the correct permissions
   - Make sure your PHP version is compatible with your code

3. **Email Not Sending**:
   - Check if PHP mail function is enabled
   - Verify that your server allows outgoing emails
   - Consider using SMTP instead of the PHP mail function
   - Check spam folders for test emails

4. **File Permission Issues**:
   - Set appropriate file permissions:
     - Directories: 755
     - Files: 644
     - PHP files: 644

### Getting Support

If you encounter issues that you can't resolve, Hostinger provides customer support through:

- Live chat support (available 24/7)
- Email support
- Knowledge base articles at [https://support.hostinger.com](https://support.hostinger.com)

---

For any additional questions or customizations, please contact your web developer or Hostinger support team.