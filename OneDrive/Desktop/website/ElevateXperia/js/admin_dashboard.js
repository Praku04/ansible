/**
 * ElevateXperia Admin Dashboard JavaScript
 * This file handles all the functionality for the admin dashboard
 */

// Base URL for API calls
const API_BASE_URL = 'php/admin_api.php';

// Document ready function
$(document).ready(function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up event listeners for tab changes
    setupTabListeners();
    
    // Set up event listeners for form submissions
    setupFormSubmissions();
    
    // Set up event listeners for action buttons
    setupActionButtons();
});

/**
 * Initialize the dashboard with data
 */
function initializeDashboard() {
    // Load dashboard statistics
    loadDashboardStats();
    
    // Load initial data for the active tab
    const activeTab = $('.nav-link.active').attr('href').substring(1);
    loadTabData(activeTab);
}

/**
 * Set up event listeners for tab changes
 */
function setupTabListeners() {
    $('.nav-link').on('click', function() {
        const tabId = $(this).attr('href').substring(1);
        loadTabData(tabId);
        
        // Update active class
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });
}

/**
 * Load data based on the selected tab
 * @param {string} tabId - The ID of the selected tab
 */
function loadTabData(tabId) {
    switch(tabId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'tours':
            loadTours();
            break;
        case 'programs':
            loadPrograms();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'enquiries':
            loadEnquiries();
            break;
        case 'subscribers':
            loadSubscribers();
            break;
        case 'chatbot':
            loadChatbotLogs();
            break;
    }
}

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=dashboard`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const data = response.data;
                
                // Update dashboard cards
                $('#total-bookings').text(data.totalBookings);
                $('#pending-bookings').text(data.pendingBookings);
                $('#total-subscribers').text(data.totalSubscribers);
                $('#total-enquiries').text(data.totalEnquiries);
                
                // Update recent bookings table
                updateRecentBookingsTable(data.recentBookings);
            } else {
                showAlert('error', 'Failed to load dashboard statistics: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading dashboard statistics: ' + error);
        }
    });
}

/**
 * Update the recent bookings table
 * @param {Array} bookings - Array of booking objects
 */
function updateRecentBookingsTable(bookings) {
    const tableBody = $('#recent-bookings');
    tableBody.empty();
    
    if (bookings.length === 0) {
        tableBody.append('<tr><td colspan="6" class="text-center">No recent bookings found</td></tr>');
        return;
    }
    
    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        
        tableBody.append(`
            <tr>
                <td>${booking.id}</td>
                <td>${booking.name}</td>
                <td>${booking.tour_title}</td>
                <td>${formatDate(booking.booking_date)}</td>
                <td><span class="badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info btn-action view-booking" data-id="${booking.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    // Add event listeners to the view buttons
    $('.view-booking').on('click', function() {
        const bookingId = $(this).data('id');
        viewBookingDetails(bookingId);
    });
}

/**
 * Load tours data
 */
function loadTours() {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=tours`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                updateToursTable(response.data);
            } else {
                showAlert('error', 'Failed to load tours: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading tours: ' + error);
        }
    });
}

/**
 * Update the tours table
 * @param {Array} tours - Array of tour objects
 */
function updateToursTable(tours) {
    const tableBody = $('#tours-list');
    tableBody.empty();
    
    if (tours.length === 0) {
        tableBody.append('<tr><td colspan="7" class="text-center">No tours found</td></tr>');
        return;
    }
    
    tours.forEach(tour => {
        tableBody.append(`
            <tr>
                <td>${tour.id}</td>
                <td>${tour.title}</td>
                <td>${tour.destination}</td>
                <td>${tour.duration}</td>
                <td>$${parseFloat(tour.price).toFixed(2)}</td>
                <td>${tour.featured == 1 ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action edit-tour" data-id="${tour.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action delete-tour" data-id="${tour.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    // Add event listeners to the action buttons
    $('.edit-tour').on('click', function() {
        const tourId = $(this).data('id');
        editTour(tourId);
    });
    
    $('.delete-tour').on('click', function() {
        const tourId = $(this).data('id');
        deleteTour(tourId);
    });
}

/**
 * Load programs data
 */
function loadPrograms() {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=programs`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                updateProgramsTable(response.data);
            } else {
                showAlert('error', 'Failed to load programs: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading programs: ' + error);
        }
    });
}

/**
 * Update the programs table
 * @param {Array} programs - Array of program objects
 */
function updateProgramsTable(programs) {
    const tableBody = $('#programs-list');
    tableBody.empty();
    
    if (programs.length === 0) {
        tableBody.append('<tr><td colspan="5" class="text-center">No programs found</td></tr>');
        return;
    }
    
    programs.forEach(program => {
        tableBody.append(`
            <tr>
                <td>${program.id}</td>
                <td>${program.name}</td>
                <td>${program.type}</td>
                <td>${program.duration}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action edit-program" data-id="${program.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action delete-program" data-id="${program.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    // Add event listeners to the action buttons
    $('.edit-program').on('click', function() {
        const programId = $(this).data('id');
        editProgram(programId);
    });
    
    $('.delete-program').on('click', function() {
        const programId = $(this).data('id');
        deleteProgram(programId);
    });
}

/**
 * Load bookings data
 */
function loadBookings() {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=bookings`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                updateBookingsTable(response.data);
            } else {
                showAlert('error', 'Failed to load bookings: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading bookings: ' + error);
        }
    });
}

/**
 * Update the bookings table
 * @param {Array} bookings - Array of booking objects
 */
function updateBookingsTable(bookings) {
    const tableBody = $('#bookings-list');
    tableBody.empty();
    
    if (bookings.length === 0) {
        tableBody.append('<tr><td colspan="9" class="text-center">No bookings found</td></tr>');
        return;
    }
    
    bookings.forEach(booking => {
        const statusClass = getStatusClass(booking.status);
        
        tableBody.append(`
            <tr>
                <td>${booking.id}</td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td>${booking.tour_title}</td>
                <td>${formatDate(booking.booking_date)}</td>
                <td>${booking.participants}</td>
                <td><span class="badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info btn-action view-booking" data-id="${booking.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `);
    });
    
    // Add event listeners to the view buttons
    $('.view-booking').on('click', function() {
        const bookingId = $(this).data('id');
        viewBookingDetails(bookingId);
    });
}

/**
 * View booking details
 * @param {number} bookingId - The ID of the booking to view
 */
function viewBookingDetails(bookingId) {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=bookings&id=${bookingId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const booking = response.data;
                const statusClass = getStatusClass(booking.status);
                
                // Populate the modal with booking details
                $('#bookingDetails').html(`
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Booking ID:</strong> ${booking.id}</p>
                            <p><strong>Name:</strong> ${booking.name}</p>
                            <p><strong>Email:</strong> ${booking.email}</p>
                            <p><strong>Phone:</strong> ${booking.phone}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Tour:</strong> ${booking.tour_title}</p>
                            <p><strong>Date:</strong> ${formatDate(booking.booking_date)}</p>
                            <p><strong>Participants:</strong> ${booking.participants}</p>
                            <p><strong>Status:</strong> <span class="badge ${statusClass}">${booking.status}</span></p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>Special Requests:</strong></p>
                            <p>${booking.special_requests || 'None'}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>Created At:</strong> ${formatDateTime(booking.created_at)}</p>
                        </div>
                    </div>
                `);
                
                // Set up the confirm and cancel buttons based on current status
                if (booking.status === 'pending') {
                    $('#confirmBookingBtn').show().data('id', booking.id);
                    $('#cancelBookingBtn').show().data('id', booking.id);
                } else if (booking.status === 'confirmed') {
                    $('#confirmBookingBtn').hide();
                    $('#cancelBookingBtn').show().data('id', booking.id);
                } else {
                    $('#confirmBookingBtn').show().data('id', booking.id);
                    $('#cancelBookingBtn').hide();
                }
                
                // Show the modal
                $('#viewBookingModal').modal('show');
            } else {
                showAlert('error', 'Failed to load booking details: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading booking details: ' + error);
        }
    });
}

/**
 * Load enquiries data
 */
function loadEnquiries() {
    // Implementation for loading enquiries
    // This would be similar to the other load functions
    $('#enquiries-list').html('<tr><td colspan="6" class="text-center">Loading enquiries...</td></tr>');
    
    // Placeholder for now - would be replaced with actual API call
    setTimeout(() => {
        $('#enquiries-list').html('<tr><td colspan="6" class="text-center">No enquiries found</td></tr>');
    }, 1000);
}

/**
 * Load subscribers data
 */
function loadSubscribers() {
    // Implementation for loading subscribers
    // This would be similar to the other load functions
    $('#subscribers-list').html('<tr><td colspan="5" class="text-center">Loading subscribers...</td></tr>');
    
    // Placeholder for now - would be replaced with actual API call
    setTimeout(() => {
        $('#subscribers-list').html('<tr><td colspan="5" class="text-center">No subscribers found</td></tr>');
    }, 1000);
}

/**
 * Load chatbot logs data
 */
function loadChatbotLogs() {
    // Implementation for loading chatbot logs
    // This would be similar to the other load functions
    $('#chatbot-logs').html('<tr><td colspan="6" class="text-center">Loading chatbot logs...</td></tr>');
    
    // Placeholder for now - would be replaced with actual API call
    setTimeout(() => {
        $('#chatbot-logs').html('<tr><td colspan="6" class="text-center">No chatbot logs found</td></tr>');
    }, 1000);
}

/**
 * Set up event listeners for form submissions
 */
function setupFormSubmissions() {
    // Add Tour Form
    $('#saveTourBtn').on('click', function() {
        const formData = getFormData('#addTourForm');
        
        // Add featured flag
        formData.featured = $('#tourFeatured').is(':checked') ? 1 : 0;
        
        $.ajax({
            url: `${API_BASE_URL}?endpoint=tours`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showAlert('success', 'Tour added successfully');
                    $('#addTourModal').modal('hide');
                    $('#addTourForm')[0].reset();
                    loadTours();
                } else {
                    showAlert('error', 'Failed to add tour: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                showAlert('error', 'Error adding tour: ' + error);
            }
        });
    });
    
    // Update Tour Form
    $('#updateTourBtn').on('click', function() {
        const formData = getFormData('#editTourForm');
        
        // Add featured flag
        formData.featured = $('#editTourFeatured').is(':checked') ? 1 : 0;
        
        $.ajax({
            url: `${API_BASE_URL}?endpoint=tours`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showAlert('success', 'Tour updated successfully');
                    $('#editTourModal').modal('hide');
                    loadTours();
                } else {
                    showAlert('error', 'Failed to update tour: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                showAlert('error', 'Error updating tour: ' + error);
            }
        });
    });
    
    // Add Program Form
    $('#saveProgramBtn').on('click', function() {
        const formData = getFormData('#addProgramForm');
        
        $.ajax({
            url: `${API_BASE_URL}?endpoint=programs`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showAlert('success', 'Program added successfully');
                    $('#addProgramModal').modal('hide');
                    $('#addProgramForm')[0].reset();
                    loadPrograms();
                } else {
                    showAlert('error', 'Failed to add program: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                showAlert('error', 'Error adding program: ' + error);
            }
        });
    });
}

/**
 * Set up event listeners for action buttons
 */
function setupActionButtons() {
    // Confirm Booking Button
    $('#confirmBookingBtn').on('click', function() {
        const bookingId = $(this).data('id');
        updateBookingStatus(bookingId, 'confirmed');
    });
    
    // Cancel Booking Button
    $('#cancelBookingBtn').on('click', function() {
        const bookingId = $(this).data('id');
        updateBookingStatus(bookingId, 'cancelled');
    });
}

/**
 * Update booking status
 * @param {number} bookingId - The ID of the booking to update
 * @param {string} status - The new status ('confirmed' or 'cancelled')
 */
function updateBookingStatus(bookingId, status) {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=bookings`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            id: bookingId,
            status: status
        }),
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                showAlert('success', `Booking ${status} successfully`);
                $('#viewBookingModal').modal('hide');
                loadBookings();
                loadDashboardStats(); // Refresh dashboard stats
            } else {
                showAlert('error', `Failed to ${status} booking: ${response.message}`);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', `Error ${status} booking: ${error}`);
        }
    });
}

/**
 * Edit tour
 * @param {number} tourId - The ID of the tour to edit
 */
function editTour(tourId) {
    $.ajax({
        url: `${API_BASE_URL}?endpoint=tours&id=${tourId}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const tour = response.data;
                
                // Populate the edit form
                $('#editTourId').val(tour.id);
                $('#editTourTitle').val(tour.title);
                $('#editTourDestination').val(tour.destination);
                $('#editTourDuration').val(tour.duration);
                $('#editTourPrice').val(tour.price);
                $('#editTourDescription').val(tour.description);
                $('#editTourImageUrl').val(tour.image_url);
                $('#editTourFeatured').prop('checked', tour.featured == 1);
                
                // Show the modal
                $('#editTourModal').modal('show');
            } else {
                showAlert('error', 'Failed to load tour details: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            showAlert('error', 'Error loading tour details: ' + error);
        }
    });
}

/**
 * Delete tour
 * @param {number} tourId - The ID of the tour to delete
 */
function deleteTour(tourId) {
    if (confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
        $.ajax({
            url: `${API_BASE_URL}?endpoint=tours&id=${tourId}`,
            method: 'DELETE',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    showAlert('success', 'Tour deleted successfully');
                    loadTours();
                } else {
                    showAlert('error', 'Failed to delete tour: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                showAlert('error', 'Error deleting tour: ' + error);
            }
        });
    }
}

/**
 * Get form data as an object
 * @param {string} formSelector - The selector for the form
 * @returns {Object} - Form data as an object
 */
function getFormData(formSelector) {
    const formData = {};
    const form = $(formSelector).serializeArray();
    
    $.each(form, function(index, field) {
        formData[field.name] = field.value;
    });
    
    return formData;
}

/**
 * Show an alert message
 * @param {string} type - The type of alert ('success', 'error', 'warning', 'info')
 * @param {string} message - The message to display
 */
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Append the alert to the main content area
    $('.main-content').prepend(alertHtml);
    
    // Auto-dismiss after 5 seconds
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * Format a date and time string
 * @param {string} dateTimeString - The date and time string to format
 * @returns {string} - Formatted date and time string
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

/**
 * Get the appropriate Bootstrap class for a status
 * @param {string} status - The status ('pending', 'confirmed', 'cancelled')
 * @returns {string} - The Bootstrap class
 */
function getStatusClass(status) {
    switch(status) {
        case 'pending':
            return 'bg-warning text-dark';
        case 'confirmed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}