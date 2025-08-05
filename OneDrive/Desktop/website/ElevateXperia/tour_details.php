<?php
// Include database configuration
require_once 'php/db_config.php';

// Check if tour ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    // Redirect to tours page if no valid ID
    header('Location: tours.php');
    exit;
}

$tourId = intval($_GET['id']);

// Get tour details
$tourQuery = "SELECT * FROM tours WHERE id = ? AND status = 'active'";
$stmt = $conn->prepare($tourQuery);
$stmt->bind_param("i", $tourId);
$stmt->execute();
$result = $stmt->get_result();

// Check if tour exists
if ($result->num_rows === 0) {
    // Redirect to tours page if tour not found
    header('Location: tours.php');
    exit;
}

$tour = $result->fetch_assoc();

// Get related tours (same category or similar price range)
$relatedQuery = "SELECT id, title, image_url, duration, price FROM tours 
                WHERE id != ? AND status = 'active' 
                ORDER BY RAND() LIMIT 3";
$relatedStmt = $conn->prepare($relatedQuery);
$relatedStmt->bind_param("i", $tourId);
$relatedStmt->execute();
$relatedResult = $relatedStmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tour['title']); ?> - ElevateXperia</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Lightbox CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <style>
        .tour-header {
            position: relative;
            background-size: cover;
            background-position: center;
            height: 400px;
            color: white;
        }
        .tour-header-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
        }
        .tour-meta {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .tour-meta-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .tour-meta-icon {
            width: 40px;
            height: 40px;
            background-color: #e9ecef;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #0d6efd;
        }
        .tour-content {
            line-height: 1.8;
        }
        .tour-gallery img {
            border-radius: 10px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        }
        .tour-gallery img:hover {
            transform: scale(1.03);
        }
        .related-tour {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            height: 100%;
            transition: transform 0.3s ease;
        }
        .related-tour:hover {
            transform: translateY(-5px);
        }
        .related-tour-img {
            height: 150px;
            background-size: cover;
            background-position: center;
        }
        .booking-cta {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .itinerary-day {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #dee2e6;
        }
        .itinerary-day:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <!-- Include Header/Navigation -->
    <?php include 'includes/header.php'; ?>

    <!-- Tour Header -->
    <section class="tour-header" style="background-image: url('<?php echo !empty($tour['image_url']) ? htmlspecialchars($tour['image_url']) : 'images/tours/default-tour.jpg'; ?>')">
        <div class="tour-header-overlay">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <h1 class="display-4"><?php echo htmlspecialchars($tour['title']); ?></h1>
                        <p class="lead"><?php echo htmlspecialchars(substr($tour['description'], 0, 100)) . '...'; ?></p>
                        <?php if ($tour['featured'] == 1): ?>
                            <span class="badge bg-warning">Featured Tour</span>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Tour Details Section -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <!-- Tour Content -->
                <div class="col-lg-8">
                    <!-- Tour Meta Information -->
                    <div class="tour-meta" data-aos="fade-up">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="tour-meta-item">
                                    <div class="tour-meta-icon">
                                        <i class="far fa-clock"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-0">Duration</h6>
                                        <p class="mb-0"><?php echo htmlspecialchars($tour['duration']); ?></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="tour-meta-item">
                                    <div class="tour-meta-icon">
                                        <i class="fas fa-tag"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-0">Price</h6>
                                        <p class="mb-0">$<?php echo htmlspecialchars($tour['price']); ?> per person</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="tour-meta-item">
                                    <div class="tour-meta-icon">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-0">Location</h6>
                                        <p class="mb-0"><?php echo htmlspecialchars($tour['location'] ?? 'Multiple Locations'); ?></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="tour-meta-item">
                                    <div class="tour-meta-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-0">Group Size</h6>
                                        <p class="mb-0">Max <?php echo htmlspecialchars($tour['max_participants'] ?? '20'); ?> participants</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tour Description -->
                    <div class="mb-5" data-aos="fade-up">
                        <h3>Tour Overview</h3>
                        <div class="tour-content">
                            <?php echo nl2br(htmlspecialchars($tour['description'])); ?>
                        </div>
                    </div>

                    <!-- Tour Itinerary -->
                    <div class="mb-5" data-aos="fade-up">
                        <h3>Itinerary</h3>
                        <div class="itinerary-container mt-4">
                            <?php 
                            // This would ideally come from a separate itinerary table in the database
                            // For now, we'll create a sample itinerary based on the tour duration
                            $durationText = $tour['duration'];
                            $days = 1;
                            
                            if (strpos($durationText, 'day') !== false) {
                                $days = intval($durationText);
                            } elseif (strpos($durationText, 'week') !== false) {
                                $days = intval($durationText) * 7;
                            }
                            
                            // Limit to 7 days for display purposes
                            $days = min($days, 7);
                            
                            for ($i = 1; $i <= $days; $i++): 
                            ?>
                                <div class="itinerary-day">
                                    <h5>Day <?php echo $i; ?></h5>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    <ul>
                                        <li>Morning: Educational workshop and interactive sessions</li>
                                        <li>Afternoon: Guided tour of key locations</li>
                                        <li>Evening: Reflection and group discussion</li>
                                    </ul>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </div>

                    <!-- Tour Gallery -->
                    <div class="mb-5" data-aos="fade-up">
                        <h3>Tour Gallery</h3>
                        <div class="row tour-gallery mt-4">
                            <?php 
                            // This would ideally come from a separate gallery table in the database
                            // For now, we'll use placeholder images
                            for ($i = 1; $i <= 6; $i++): 
                            ?>
                                <div class="col-md-4">
                                    <a href="images/tours/placeholder-<?php echo $i; ?>.jpg" data-lightbox="tour-gallery" data-title="<?php echo htmlspecialchars($tour['title']); ?> - Image <?php echo $i; ?>">
                                        <img src="images/tours/placeholder-<?php echo $i; ?>.jpg" class="img-fluid" alt="Tour Image <?php echo $i; ?>">
                                    </a>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </div>

                    <!-- What's Included -->
                    <div class="mb-5" data-aos="fade-up">
                        <h3>What's Included</h3>
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <h5>Included</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Professional educational guide</li>
                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Transportation during the tour</li>
                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Accommodation as specified</li>
                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Entry fees to museums and attractions</li>
                                    <li class="list-group-item"><i class="fas fa-check text-success me-2"></i> Workshop materials</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h5>Not Included</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><i class="fas fa-times text-danger me-2"></i> International airfare</li>
                                    <li class="list-group-item"><i class="fas fa-times text-danger me-2"></i> Travel insurance</li>
                                    <li class="list-group-item"><i class="fas fa-times text-danger me-2"></i> Personal expenses</li>
                                    <li class="list-group-item"><i class="fas fa-times text-danger me-2"></i> Meals not specified</li>
                                    <li class="list-group-item"><i class="fas fa-times text-danger me-2"></i> Optional activities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <!-- Booking CTA -->
                    <div class="booking-cta mb-4" data-aos="fade-left">
                        <h3 class="text-center mb-3">Book This Tour</h3>
                        <div class="d-flex justify-content-center mb-4">
                            <h4 class="mb-0 me-2">$<?php echo htmlspecialchars($tour['price']); ?></h4>
                            <span class="text-muted align-self-end">per person</span>
                        </div>
                        <p class="text-center mb-4">Secure your spot on this educational journey and prepare for an unforgettable learning experience.</p>
                        <a href="book_tour_form.php?tour_id=<?php echo $tourId; ?>" class="btn btn-primary w-100 py-3">Book Now</a>
                        <div class="text-center mt-3">
                            <small class="text-muted">No payment required to reserve</small>
                        </div>
                    </div>

                    <!-- Tour Highlights -->
                    <div class="card mb-4" data-aos="fade-left">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Tour Highlights</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><i class="fas fa-star text-warning me-2"></i> Hands-on learning experiences</li>
                                <li class="list-group-item"><i class="fas fa-star text-warning me-2"></i> Expert educational guides</li>
                                <li class="list-group-item"><i class="fas fa-star text-warning me-2"></i> Interactive workshops</li>
                                <li class="list-group-item"><i class="fas fa-star text-warning me-2"></i> Networking opportunities</li>
                                <li class="list-group-item"><i class="fas fa-star text-warning me-2"></i> Certificate of completion</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Related Tours -->
                    <div data-aos="fade-left">
                        <h4>You May Also Like</h4>
                        <?php if ($relatedResult && $relatedResult->num_rows > 0): ?>
                            <?php while($relatedTour = $relatedResult->fetch_assoc()): ?>
                                <div class="related-tour mb-3">
                                    <div class="related-tour-img" style="background-image: url('<?php echo !empty($relatedTour['image_url']) ? htmlspecialchars($relatedTour['image_url']) : 'images/tours/default-tour.jpg'; ?>')"></div>
                                    <div class="p-3">
                                        <h5><?php echo htmlspecialchars($relatedTour['title']); ?></h5>
                                        <div class="d-flex justify-content-between mb-2">
                                            <small><i class="far fa-clock"></i> <?php echo htmlspecialchars($relatedTour['duration']); ?></small>
                                            <small class="fw-bold">$<?php echo htmlspecialchars($relatedTour['price']); ?></small>
                                        </div>
                                        <a href="tour_details.php?id=<?php echo $relatedTour['id']; ?>" class="btn btn-sm btn-outline-primary w-100">View Tour</a>
                                    </div>
                                </div>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <p>No related tours available at this time.</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5" data-aos="fade-up">Frequently Asked Questions</h2>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="accordion" id="tourFAQ" data-aos="fade-up">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    What is the booking process?
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#tourFAQ">
                                <div class="accordion-body">
                                    To book this tour, simply click the "Book Now" button and fill out the booking form. No payment is required at the time of booking. Our team will review your request and contact you to confirm availability and provide payment instructions.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    What is the cancellation policy?
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#tourFAQ">
                                <div class="accordion-body">
                                    Cancellations made 30 days or more before the tour date will receive a full refund minus a 10% administrative fee. Cancellations made 15-29 days before the tour date will receive a 50% refund. No refunds will be issued for cancellations made less than 15 days before the tour date.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Is this tour suitable for all age groups?
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#tourFAQ">
                                <div class="accordion-body">
                                    This tour is designed primarily for students and educators, but it can be adapted for different age groups. Please contact us if you have specific requirements or questions about the suitability for your group.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingFour">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    Can I customize this tour for my group?
                                </button>
                            </h2>
                            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#tourFAQ">
                                <div class="accordion-body">
                                    Yes, we offer customization options for groups of 10 or more participants. Please contact our team to discuss your specific learning objectives and requirements, and we'll be happy to create a tailored experience for your group.
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingFive">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    What should I bring on the tour?
                                </button>
                            </h2>
                            <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#tourFAQ">
                                <div class="accordion-body">
                                    We recommend bringing comfortable walking shoes, weather-appropriate clothing, a notebook and pen for taking notes, a water bottle, and any personal items you may need. A detailed packing list will be provided upon booking confirmation.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action -->
    <section class="py-5 bg-primary text-white text-center">
        <div class="container">
            <h2 data-aos="fade-up">Ready to embark on this educational journey?</h2>
            <p class="lead mb-4" data-aos="fade-up" data-aos-delay="100">Book your spot today and prepare for an unforgettable learning experience.</p>
            <a href="book_tour_form.php?tour_id=<?php echo $tourId; ?>" class="btn btn-light btn-lg px-5" data-aos="fade-up" data-aos-delay="200">Book Now</a>
        </div>
    </section>

    <!-- Include Footer -->
    <?php include 'includes/footer.php'; ?>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AOS Animation Library -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- Lightbox JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"></script>
    <!-- Custom JS -->
    <script>
        // Initialize AOS
        AOS.init();
        
        // Initialize Lightbox
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Image %1 of %2'
        });
    </script>
</body>
</html>