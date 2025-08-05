<?php
/**
 * OAuth Handler for ElevateXperia
 * Handles authentication with Google, Facebook, Twitter, and LinkedIn
 */

// Include database configuration
require_once 'db_config.php';

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Define OAuth provider configurations
$providers = [
    'google' => [
        'client_id' => 'YOUR_GOOGLE_CLIENT_ID',
        'client_secret' => 'YOUR_GOOGLE_CLIENT_SECRET',
        'redirect_uri' => 'https://yourdomain.com/php/oauth_handler.php?provider=google',
        'scopes' => ['email', 'profile']
    ],
    'facebook' => [
        'client_id' => 'YOUR_FACEBOOK_APP_ID',
        'client_secret' => 'YOUR_FACEBOOK_APP_SECRET',
        'redirect_uri' => 'https://yourdomain.com/php/oauth_handler.php?provider=facebook',
        'scopes' => ['email', 'public_profile']
    ],
    'twitter' => [
        'consumer_key' => 'YOUR_TWITTER_CONSUMER_KEY',
        'consumer_secret' => 'YOUR_TWITTER_CONSUMER_SECRET',
        'redirect_uri' => 'https://yourdomain.com/php/oauth_handler.php?provider=twitter',
        'oauth_callback' => 'https://yourdomain.com/php/oauth_handler.php?provider=twitter'
    ],
    'linkedin' => [
        'client_id' => 'YOUR_LINKEDIN_CLIENT_ID',
        'client_secret' => 'YOUR_LINKEDIN_CLIENT_SECRET',
        'redirect_uri' => 'https://yourdomain.com/php/oauth_handler.php?provider=linkedin',
        'scopes' => ['r_liteprofile', 'r_emailaddress']
    ]
];

// Check if provider is specified
if (!isset($_GET['provider'])) {
    redirect_with_error('Invalid request. Provider not specified.');
}

$provider = $_GET['provider'];

// Check if provider is supported
if (!array_key_exists($provider, $providers)) {
    redirect_with_error('Unsupported provider: ' . $provider);
}

// Handle the OAuth flow based on provider
switch ($provider) {
    case 'google':
        handle_google_auth($providers['google']);
        break;
    case 'facebook':
        handle_facebook_auth($providers['facebook']);
        break;
    case 'twitter':
        handle_twitter_auth($providers['twitter']);
        break;
    case 'linkedin':
        handle_linkedin_auth($providers['linkedin']);
        break;
}

/**
 * Handle Google OAuth authentication
 */
function handle_google_auth($config) {
    // Check if this is the initial request or callback
    if (!isset($_GET['code'])) {
        // Initial request - redirect to Google's OAuth server
        $auth_url = 'https://accounts.google.com/o/oauth2/auth';
        $auth_url .= '?client_id=' . urlencode($config['client_id']);
        $auth_url .= '&redirect_uri=' . urlencode($config['redirect_uri']);
        $auth_url .= '&response_type=code';
        $auth_url .= '&scope=' . urlencode(implode(' ', $config['scopes']));
        $auth_url .= '&access_type=online';
        
        header('Location: ' . $auth_url);
        exit;
    } else {
        // Callback with authorization code
        $code = $_GET['code'];
        
        // Exchange code for access token
        $token_url = 'https://oauth2.googleapis.com/token';
        $token_data = [
            'code' => $code,
            'client_id' => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'redirect_uri' => $config['redirect_uri'],
            'grant_type' => 'authorization_code'
        ];
        
        $token_response = make_post_request($token_url, $token_data);
        $token_info = json_decode($token_response, true);
        
        if (!isset($token_info['access_token'])) {
            redirect_with_error('Failed to get access token from Google');
        }
        
        // Get user info with access token
        $user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo';
        $user_info_response = make_get_request($user_info_url, [
            'Authorization: Bearer ' . $token_info['access_token']
        ]);
        
        $user_info = json_decode($user_info_response, true);
        
        // Process user information
        process_oauth_user('google', $user_info);
    }
}

/**
 * Handle Facebook OAuth authentication
 */
function handle_facebook_auth($config) {
    // Check if this is the initial request or callback
    if (!isset($_GET['code'])) {
        // Initial request - redirect to Facebook's OAuth server
        $auth_url = 'https://www.facebook.com/v12.0/dialog/oauth';
        $auth_url .= '?client_id=' . urlencode($config['client_id']);
        $auth_url .= '&redirect_uri=' . urlencode($config['redirect_uri']);
        $auth_url .= '&scope=' . urlencode(implode(',', $config['scopes']));
        
        header('Location: ' . $auth_url);
        exit;
    } else {
        // Callback with authorization code
        $code = $_GET['code'];
        
        // Exchange code for access token
        $token_url = 'https://graph.facebook.com/v12.0/oauth/access_token';
        $token_url .= '?client_id=' . urlencode($config['client_id']);
        $token_url .= '&client_secret=' . urlencode($config['client_secret']);
        $token_url .= '&redirect_uri=' . urlencode($config['redirect_uri']);
        $token_url .= '&code=' . urlencode($code);
        
        $token_response = make_get_request($token_url);
        $token_info = json_decode($token_response, true);
        
        if (!isset($token_info['access_token'])) {
            redirect_with_error('Failed to get access token from Facebook');
        }
        
        // Get user info with access token
        $user_info_url = 'https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=' . $token_info['access_token'];
        $user_info_response = make_get_request($user_info_url);
        
        $user_info = json_decode($user_info_response, true);
        
        // Process user information
        process_oauth_user('facebook', $user_info);
    }
}

/**
 * Handle Twitter OAuth authentication
 */
function handle_twitter_auth($config) {
    // Twitter OAuth 1.0a requires a library
    // This is a simplified version - in production, use abraham/twitteroauth library
    
    // Check if this is the initial request or callback
    if (!isset($_GET['oauth_token']) || !isset($_GET['oauth_verifier'])) {
        // Initial request - get request token
        $request_token_url = 'https://api.twitter.com/oauth/request_token';
        
        // Generate signature and headers (simplified)
        // In production, use abraham/twitteroauth library for proper OAuth 1.0a flow
        
        // Redirect to Twitter authorization page
        $auth_url = 'https://api.twitter.com/oauth/authenticate?oauth_token=REQUEST_TOKEN';
        
        header('Location: ' . $auth_url);
        exit;
    } else {
        // Callback with oauth_token and oauth_verifier
        $oauth_token = $_GET['oauth_token'];
        $oauth_verifier = $_GET['oauth_verifier'];
        
        // Exchange for access token (simplified)
        // In production, use abraham/twitteroauth library
        
        // Get user info
        $user_info = [
            'id' => 'twitter_user_id',
            'name' => 'Twitter User',
            'email' => 'twitter_user@example.com' // Twitter may not provide email
        ];
        
        // Process user information
        process_oauth_user('twitter', $user_info);
    }
}

/**
 * Handle LinkedIn OAuth authentication
 */
function handle_linkedin_auth($config) {
    // Check if this is the initial request or callback
    if (!isset($_GET['code'])) {
        // Initial request - redirect to LinkedIn's OAuth server
        $auth_url = 'https://www.linkedin.com/oauth/v2/authorization';
        $auth_url .= '?client_id=' . urlencode($config['client_id']);
        $auth_url .= '&redirect_uri=' . urlencode($config['redirect_uri']);
        $auth_url .= '&response_type=code';
        $auth_url .= '&scope=' . urlencode(implode(' ', $config['scopes']));
        
        header('Location: ' . $auth_url);
        exit;
    } else {
        // Callback with authorization code
        $code = $_GET['code'];
        
        // Exchange code for access token
        $token_url = 'https://www.linkedin.com/oauth/v2/accessToken';
        $token_data = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'client_id' => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'redirect_uri' => $config['redirect_uri']
        ];
        
        $token_response = make_post_request($token_url, $token_data);
        $token_info = json_decode($token_response, true);
        
        if (!isset($token_info['access_token'])) {
            redirect_with_error('Failed to get access token from LinkedIn');
        }
        
        // Get user profile
        $profile_url = 'https://api.linkedin.com/v2/me';
        $profile_response = make_get_request($profile_url, [
            'Authorization: Bearer ' . $token_info['access_token']
        ]);
        
        $profile = json_decode($profile_response, true);
        
        // Get email address
        $email_url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
        $email_response = make_get_request($email_url, [
            'Authorization: Bearer ' . $token_info['access_token']
        ]);
        
        $email_data = json_decode($email_response, true);
        $email = isset($email_data['elements'][0]['handle~']['emailAddress']) ? 
                 $email_data['elements'][0]['handle~']['emailAddress'] : '';
        
        // Combine profile and email
        $user_info = $profile;
        $user_info['email'] = $email;
        
        // Process user information
        process_oauth_user('linkedin', $user_info);
    }
}

/**
 * Process OAuth user information
 */
function process_oauth_user($provider, $user_info) {
    global $conn;
    
    // Extract user data based on provider
    $provider_user_id = '';
    $name = '';
    $email = '';
    
    switch ($provider) {
        case 'google':
            $provider_user_id = isset($user_info['sub']) ? $user_info['sub'] : '';
            $name = isset($user_info['name']) ? $user_info['name'] : '';
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            break;
            
        case 'facebook':
            $provider_user_id = isset($user_info['id']) ? $user_info['id'] : '';
            $name = isset($user_info['name']) ? $user_info['name'] : '';
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            break;
            
        case 'twitter':
            $provider_user_id = isset($user_info['id']) ? $user_info['id'] : '';
            $name = isset($user_info['name']) ? $user_info['name'] : '';
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            break;
            
        case 'linkedin':
            $provider_user_id = isset($user_info['id']) ? $user_info['id'] : '';
            $name = isset($user_info['localizedFirstName']) && isset($user_info['localizedLastName']) ? 
                   $user_info['localizedFirstName'] . ' ' . $user_info['localizedLastName'] : '';
            $email = isset($user_info['email']) ? $user_info['email'] : '';
            break;
    }
    
    // Validate required data
    if (empty($provider_user_id) || empty($email)) {
        redirect_with_error('Incomplete user data from ' . $provider);
    }
    
    // Check if user exists in our database
    $stmt = $conn->prepare("SELECT id, role FROM users WHERE email = ? OR (oauth_provider = ? AND oauth_provider_id = ?)");
    $stmt->bind_param("sss", $email, $provider, $provider_user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User exists - log them in
        $user = $result->fetch_assoc();
        $user_id = $user['id'];
        $role = $user['role'];
        
        // Update OAuth info if needed
        $update_stmt = $conn->prepare("UPDATE users SET oauth_provider = ?, oauth_provider_id = ? WHERE id = ?");
        $update_stmt->bind_param("ssi", $provider, $provider_user_id, $user_id);
        $update_stmt->execute();
        $update_stmt->close();
    } else {
        // New user - register them
        $role = 'user'; // Default role
        $password_hash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT); // Random password
        
        $insert_stmt = $conn->prepare("INSERT INTO users (name, email, password, role, oauth_provider, oauth_provider_id) VALUES (?, ?, ?, ?, ?, ?)");
        $insert_stmt->bind_param("ssssss", $name, $email, $password_hash, $role, $provider, $provider_user_id);
        $insert_stmt->execute();
        $user_id = $insert_stmt->insert_id;
        $insert_stmt->close();
    }
    
    // Generate JWT token
    $token = generate_jwt_token($user_id, $email, $role);
    
    // Redirect to frontend with token
    $redirect_url = '../pages/bootstrap-login.html?token=' . urlencode($token) . '&provider=' . urlencode($provider);
    header('Location: ' . $redirect_url);
    exit;
}

/**
 * Generate JWT token
 */
function generate_jwt_token($user_id, $email, $role) {
    // In production, use a proper JWT library
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $user_id,
        'email' => $email,
        'role' => $role,
        'exp' => time() + 3600 // 1 hour expiration
    ]);
    
    $base64_header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64_payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $secret = 'your_jwt_secret_key'; // Change this to a secure secret key
    
    $signature = hash_hmac('sha256', $base64_header . '.' . $base64_payload, $secret, true);
    $base64_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64_header . '.' . $base64_payload . '.' . $base64_signature;
}

/**
 * Make HTTP GET request
 */
function make_get_request($url, $headers = []) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

/**
 * Make HTTP POST request
 */
function make_post_request($url, $data, $headers = []) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge([
        'Content-Type: application/x-www-form-urlencoded'
    ], $headers));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

/**
 * Redirect with error message
 */
function redirect_with_error($error_message) {
    $redirect_url = '../pages/bootstrap-login.html?error=' . urlencode($error_message);
    header('Location: ' . $redirect_url);
    exit;
}
?>