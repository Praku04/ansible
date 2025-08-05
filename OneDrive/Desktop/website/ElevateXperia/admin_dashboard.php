<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in, if not redirect to login page
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Check if user has admin role, if not show error
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo "<div class='alert alert-danger'>You do not have permission to access this page.</div>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - ElevateXperia</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
        }
        .sidebar {
            min-height: 100vh;
            background-color: #343a40;
            color: white;
            padding-top: 20px;
        }
        .sidebar .nav-link {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 5px;
            border-radius: 5px;
            padding: 10px 15px;
        }
        .sidebar .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }
        .sidebar .nav-link.active {
            background-color: #007bff;
            color: white;
        }
        .sidebar .nav-link i {
            margin-right: 10px;
        }
        .main-content {
            padding: 20px;
        }
        .dashboard-card {
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
            transition: transform 0.3s;
        }
        .dashboard-card:hover {
            transform: translateY(-5px);
        }
        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        .table-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .form-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .btn-action {
            margin-right: 5px;
        }
        .tab-content {
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 sidebar">
                <h3 class="text-center mb-4">ElevateXperia</h3>
                <div class="d-flex flex-column">
                    <a href="#dashboard" class="nav-link active" data-bs-toggle="tab">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#tours" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-map-marked-alt"></i> Tours
                    </a>
                    <a href="#programs" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-graduation-cap"></i> Programs
                    </a>
                    <a href="#bookings" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-calendar-check"></i> Bookings
                    </a>
                    <a href="#enquiries" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-question-circle"></i> Enquiries
                    </a>
                    <a href="#subscribers" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-envelope"></i> Subscribers
                    </a>
                    <a href="#chatbot" class="nav-link" data-bs-toggle="tab">
                        <i class="fas fa-robot"></i> Chatbot Logs
                    </a>
                    <a href="index.html" class="nav-link mt-auto">
                        <i class="fas fa-home"></i> Back to Website
                    </a>
                    <a href="logout.php" class="nav-link text-danger">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 main-content">
                <div class="tab-content">
                    <!-- Dashboard Tab -->
                    <div class="tab-pane fade show active" id="dashboard">
                        <h2 class="mb-4">Dashboard</h2>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="dashboard-card bg-primary text-white">
                                    <div class="card-icon">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <h5>Total Bookings</h5>
                                    <h3 id="total-bookings">Loading...</h3>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="dashboard-card bg-warning text-white">
                                    <div class="card-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <h5>Pending Bookings</h5>
                                    <h3 id="pending-bookings">Loading...</h3>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="dashboard-card bg-success text-white">
                                    <div class="card-icon">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <h5>Subscribers</h5>
                                    <h3 id="total-subscribers">Loading...</h3>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="dashboard-card bg-info text-white">
                                    <div class="card-icon">
                                        <i class="fas fa-question-circle"></i>
                                    </div>
                                    <h5>Enquiries</h5>
                                    <h3 id="total-enquiries">Loading...</h3>
                                </div>
                            </div>
                        </div>
                        
                        <div class="table-container mt-4">
                            <h4>Recent Bookings</h4>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Tour</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recent-bookings">
                                        <tr>
                                            <td colspan="6" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tours Tab -->
                    <div class="tab-pane fade" id="tours">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2>Tours Management</h2>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTourModal">
                                <i class="fas fa-plus"></i> Add New Tour
                            </button>
                        </div>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Destination</th>
                                            <th>Duration</th>
                                            <th>Price</th>
                                            <th>Featured</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tours-list">
                                        <tr>
                                            <td colspan="7" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Programs Tab -->
                    <div class="tab-pane fade" id="programs">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2>Programs Management</h2>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProgramModal">
                                <i class="fas fa-plus"></i> Add New Program
                            </button>
                        </div>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Duration</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="programs-list">
                                        <tr>
                                            <td colspan="5" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Bookings Tab -->
                    <div class="tab-pane fade" id="bookings">
                        <h2 class="mb-4">Bookings Management</h2>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Tour</th>
                                            <th>Date</th>
                                            <th>Participants</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="bookings-list">
                                        <tr>
                                            <td colspan="9" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Enquiries Tab -->
                    <div class="tab-pane fade" id="enquiries">
                        <h2 class="mb-4">Enquiries</h2>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="enquiries-list">
                                        <tr>
                                            <td colspan="6" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Subscribers Tab -->
                    <div class="tab-pane fade" id="subscribers">
                        <h2 class="mb-4">Subscribers</h2>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Date Subscribed</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="subscribers-list">
                                        <tr>
                                            <td colspan="5" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Chatbot Logs Tab -->
                    <div class="tab-pane fade" id="chatbot">
                        <h2 class="mb-4">Chatbot Conversation Logs</h2>
                        
                        <div class="table-container">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Session ID</th>
                                            <th>User Message</th>
                                            <th>Bot Response</th>
                                            <th>Timestamp</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="chatbot-logs">
                                        <tr>
                                            <td colspan="6" class="text-center">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Add Tour Modal -->
    <div class="modal fade" id="addTourModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Tour</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addTourForm">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="tourTitle" class="form-label">Title</label>
                                <input type="text" class="form-control" id="tourTitle" name="title" required>
                            </div>
                            <div class="col-md-6">
                                <label for="tourDestination" class="form-label">Destination</label>
                                <input type="text" class="form-control" id="tourDestination" name="destination" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="tourDuration" class="form-label">Duration</label>
                                <input type="text" class="form-control" id="tourDuration" name="duration" placeholder="e.g. 5 days" required>
                            </div>
                            <div class="col-md-6">
                                <label for="tourPrice" class="form-label">Price</label>
                                <input type="number" class="form-control" id="tourPrice" name="price" step="0.01" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="tourDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="tourDescription" name="description" rows="4" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="tourImageUrl" class="form-label">Image URL</label>
                            <input type="text" class="form-control" id="tourImageUrl" name="image_url" required>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="tourFeatured" name="featured">
                            <label class="form-check-label" for="tourFeatured">Featured Tour</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveTourBtn">Save Tour</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Edit Tour Modal -->
    <div class="modal fade" id="editTourModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Tour</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editTourForm">
                        <input type="hidden" id="editTourId" name="id">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="editTourTitle" class="form-label">Title</label>
                                <input type="text" class="form-control" id="editTourTitle" name="title" required>
                            </div>
                            <div class="col-md-6">
                                <label for="editTourDestination" class="form-label">Destination</label>
                                <input type="text" class="form-control" id="editTourDestination" name="destination" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="editTourDuration" class="form-label">Duration</label>
                                <input type="text" class="form-control" id="editTourDuration" name="duration" placeholder="e.g. 5 days" required>
                            </div>
                            <div class="col-md-6">
                                <label for="editTourPrice" class="form-label">Price</label>
                                <input type="number" class="form-control" id="editTourPrice" name="price" step="0.01" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="editTourDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="editTourDescription" name="description" rows="4" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="editTourImageUrl" class="form-label">Image URL</label>
                            <input type="text" class="form-control" id="editTourImageUrl" name="image_url" required>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="editTourFeatured" name="featured">
                            <label class="form-check-label" for="editTourFeatured">Featured Tour</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="updateTourBtn">Update Tour</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Add Program Modal -->
    <div class="modal fade" id="addProgramModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Program</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addProgramForm">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="programName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="programName" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <label for="programType" class="form-label">Type</label>
                                <select class="form-select" id="programType" name="type" required>
                                    <option value="">Select Type</option>
                                    <option value="Immersion Program">Immersion Program</option>
                                    <option value="Leadership Walk">Leadership Walk</option>
                                    <option value="Educational Tour">Educational Tour</option>
                                    <option value="Workshop">Workshop</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="programDuration" class="form-label">Duration</label>
                            <input type="text" class="form-control" id="programDuration" name="duration" placeholder="e.g. 2 weeks" required>
                        </div>
                        <div class="mb-3">
                            <label for="programDescription" class="form-label">Description</label>
                            <textarea class="form-control" id="programDescription" name="description" rows="4" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="programHighlights" class="form-label">Highlights</label>
                            <textarea class="form-control" id="programHighlights" name="highlights" rows="3" placeholder="Enter key highlights separated by new lines" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="programImageUrl" class="form-label">Image URL</label>
                            <input type="text" class="form-control" id="programImageUrl" name="image_url" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveProgramBtn">Save Program</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- View Booking Modal -->
    <div class="modal fade" id="viewBookingModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Booking Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="bookingDetails">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="confirmBookingBtn">Confirm Booking</button>
                    <button type="button" class="btn btn-danger" id="cancelBookingBtn">Cancel Booking</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- View Enquiry Modal -->
    <div class="modal fade" id="viewEnquiryModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Enquiry Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="enquiryDetails">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="replyEnquiryBtn">Reply</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- View Chatbot Log Modal -->
    <div class="modal fade" id="viewChatbotLogModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chatbot Conversation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="chatbotLogDetails">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Admin Dashboard JS -->
    <script src="js/admin_dashboard.js"></script>
</body>
</html>