<?php
// Include database configuration
require_once 'php/db_config.php';

// Get all active tours
$toursQuery = "SELECT id, title, description, duration, price, image_url, featured FROM tours WHERE status = 'active' ORDER BY featured DESC, title ASC";
$toursResult = $conn->query($toursQuery);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Educational Tours - ElevateXperia</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <style>
        .tour-card {
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .tour-card:hover {
            transform: translateY(-10px);
        }
        .tour-image {
            height: 200px;
            background-size: cover;
            background-position: center;
        }
        .tour-badge {
            position: absolute;
            top: 10px;
            right: 10px;
        }
        .tour-details {
            padding: 20px;
        }
        .tour-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            color: #6c757d;
        }
        .tour-price {
            font-size: 1.25rem;
            font-weight: bold;
            color: #0d6efd;
        }
        .filter-section {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <!-- Include Header/Navigation -->
    <?php include 'includes/header.php'; ?>

    <!-- Page Header -->
    <section class="page-header bg-primary text-white py-5 mb-5">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>Educational Tours</h1>
                    <p class="lead">Discover our immersive learning experiences designed to inspire and educate</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Tours Section -->
    <section class="tours-section py-5">
        <div class="container">
            <!-- Filter Section -->
            <div class="filter-section" data-aos="fade-up">
                <div class="row">
                    <div class="col-md-4 mb-3 mb-md-0">
                        <label for="durationFilter" class="form-label">Duration</label>
                        <select class="form-select" id="durationFilter">
                            <option value="all">All Durations</option>
                            <option value="1-3 days">1-3 Days</option>
                            <option value="4-7 days">4-7 Days</option>
                            <option value="1-2 weeks">1-2 Weeks</option>
                            <option value="2+ weeks">2+ Weeks</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <label for="priceFilter" class="form-label">Price Range</label>
                        <select class="form-select" id="priceFilter">
                            <option value="all">All Prices</option>
                            <option value="0-1000">Under $1,000</option>
                            <option value="1000-2000">$1,000 - $2,000</option>
                            <option value="2000-3000">$2,000 - $3,000</option>
                            <option value="3000+">$3,000+</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="searchTours" class="form-label">Search</label>
                        <input type="text" class="form-control" id="searchTours" placeholder="Search tours...">
                    </div>
                </div>
            </div>

            <!-- Tours Grid -->
            <div class="row" id="toursGrid">
                <?php if ($toursResult && $toursResult->num_rows > 0): ?>
                    <?php while($tour = $toursResult->fetch_assoc()): ?>
                        <div class="col-md-6 col-lg-4 mb-4 tour-item" 
                             data-duration="<?php echo htmlspecialchars($tour['duration']); ?>" 
                             data-price="<?php echo htmlspecialchars($tour['price']); ?>" 
                             data-title="<?php echo htmlspecialchars($tour['title']); ?>">
                            <div class="tour-card" data-aos="fade-up">
                                <div class="tour-image" style="background-image: url('<?php echo !empty($tour['image_url']) ? htmlspecialchars($tour['image_url']) : 'images/tours/default-tour.jpg'; ?>')">
                                    <?php if ($tour['featured'] == 1): ?>
                                        <span class="tour-badge badge bg-warning">Featured</span>
                                    <?php endif; ?>
                                </div>
                                <div class="tour-details">
                                    <h3><?php echo htmlspecialchars($tour['title']); ?></h3>
                                    <div class="tour-meta">
                                        <span><i class="far fa-clock"></i> <?php echo htmlspecialchars($tour['duration']); ?></span>
                                        <span class="tour-price">$<?php echo htmlspecialchars($tour['price']); ?></span>
                                    </div>
                                    <p><?php echo htmlspecialchars(substr($tour['description'], 0, 150)) . '...'; ?></p>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <a href="tour_details.php?id=<?php echo $tour['id']; ?>" class="btn btn-outline-primary">View Details</a>
                                        <a href="book_tour_form.php?tour_id=<?php echo $tour['id']; ?>" class="btn btn-primary">Book Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div class="col-12">
                        <div class="alert alert-info text-center">
                            <i class="fas fa-info-circle me-2"></i> No tours are currently available. Please check back later for new educational experiences.
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <!-- No Results Message -->
            <div id="noResults" class="alert alert-info text-center" style="display: none;">
                <i class="fas fa-search me-2"></i> No tours match your current filters. Please try different criteria.
            </div>

            <!-- Call to Action -->
            <div class="text-center mt-5" data-aos="fade-up">
                <h3>Can't find what you're looking for?</h3>
                <p>Contact us to discuss custom educational tours tailored to your specific learning objectives.</p>
                <a href="contact.php" class="btn btn-lg btn-primary mt-3">Contact Us</a>
            </div>
        </div>
    </section>

    <!-- Include Footer -->
    <?php include 'includes/footer.php'; ?>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- AOS Animation Library -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <!-- Custom JS -->
    <script>
        // Initialize AOS
        AOS.init();
        
        // Filter functionality
        document.addEventListener('DOMContentLoaded', function() {
            const durationFilter = document.getElementById('durationFilter');
            const priceFilter = document.getElementById('priceFilter');
            const searchInput = document.getElementById('searchTours');
            const tourItems = document.querySelectorAll('.tour-item');
            const noResults = document.getElementById('noResults');
            
            // Function to filter tours
            function filterTours() {
                const durationValue = durationFilter.value;
                const priceValue = priceFilter.value;
                const searchValue = searchInput.value.toLowerCase();
                
                let visibleCount = 0;
                
                tourItems.forEach(item => {
                    const duration = item.getAttribute('data-duration');
                    const price = parseFloat(item.getAttribute('data-price'));
                    const title = item.getAttribute('data-title').toLowerCase();
                    
                    // Check duration filter
                    let durationMatch = durationValue === 'all';
                    if (durationValue === '1-3 days' && duration.includes('day') && parseInt(duration) <= 3) durationMatch = true;
                    if (durationValue === '4-7 days' && duration.includes('day') && parseInt(duration) >= 4 && parseInt(duration) <= 7) durationMatch = true;
                    if (durationValue === '1-2 weeks' && duration.includes('week') && parseInt(duration) <= 2) durationMatch = true;
                    if (durationValue === '2+ weeks' && duration.includes('week') && parseInt(duration) > 2) durationMatch = true;
                    
                    // Check price filter
                    let priceMatch = priceValue === 'all';
                    if (priceValue === '0-1000' && price < 1000) priceMatch = true;
                    if (priceValue === '1000-2000' && price >= 1000 && price < 2000) priceMatch = true;
                    if (priceValue === '2000-3000' && price >= 2000 && price < 3000) priceMatch = true;
                    if (priceValue === '3000+' && price >= 3000) priceMatch = true;
                    
                    // Check search filter
                    const searchMatch = title.includes(searchValue);
                    
                    // Show/hide based on all filters
                    if (durationMatch && priceMatch && searchMatch) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide no results message
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
            
            // Add event listeners
            durationFilter.addEventListener('change', filterTours);
            priceFilter.addEventListener('change', filterTours);
            searchInput.addEventListener('input', filterTours);
        });
    </script>
</body>
</html>