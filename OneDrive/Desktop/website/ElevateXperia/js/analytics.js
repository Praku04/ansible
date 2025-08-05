// Google Analytics Integration for ElevateXperia

// Initialize Analytics with your Measurement ID
function initializeAnalytics(measurementId) {
    // Create script elements for Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    // Create the gtag initialization script
    const gtagInitScript = document.createElement('script');
    gtagInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', {
            'page_title': document.title,
            'page_path': window.location.pathname,
            'cookie_domain': window.location.hostname
        });
    `;
    
    // Add scripts to the document head
    document.head.appendChild(gaScript);
    document.head.appendChild(gtagInitScript);
    
    console.log('Google Analytics initialized with ID:', measurementId);
}

// Track custom events
function trackEvent(eventCategory, eventAction, eventLabel = null, eventValue = null) {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    const eventParams = {
        'event_category': eventCategory,
        'event_label': eventLabel,
        'value': eventValue
    };
    
    // Remove null values
    Object.keys(eventParams).forEach(key => {
        if (eventParams[key] === null) {
            delete eventParams[key];
        }
    });
    
    gtag('event', eventAction, eventParams);
    console.log('Event tracked:', eventCategory, eventAction, eventLabel, eventValue);
}

// Track page views
function trackPageView(pagePath, pageTitle = null) {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    const pageParams = {
        'page_path': pagePath,
        'page_title': pageTitle || document.title
    };
    
    gtag('config', window.measurementId, pageParams);
    console.log('Page view tracked:', pagePath, pageTitle);
}

// Track form submissions
function trackFormSubmission(formName, formId) {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    gtag('event', 'form_submission', {
        'event_category': 'Forms',
        'event_label': formName,
        'form_id': formId
    });
    
    console.log('Form submission tracked:', formName, formId);
}

// Track outbound links
function trackOutboundLink(url, linkText = '') {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    gtag('event', 'click', {
        'event_category': 'Outbound Links',
        'event_label': linkText || url,
        'transport_type': 'beacon',
        'event_callback': function() {
            document.location = url;
        }
    });
    
    console.log('Outbound link tracked:', url, linkText);
}

// Track file downloads
function trackDownload(fileUrl, fileName = '') {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    
    gtag('event', 'download', {
        'event_category': 'Downloads',
        'event_label': fileName || fileUrl,
        'file_extension': fileExtension
    });
    
    console.log('Download tracked:', fileUrl, fileName);
}

// Track scroll depth
function initScrollTracking() {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    const scrollDepths = [25, 50, 75, 90];
    let scrollDepthTriggered = {};
    
    scrollDepths.forEach(depth => {
        scrollDepthTriggered[depth] = false;
    });
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTriggered[depth]) {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Scroll Depth',
                    'event_label': `${depth}%`,
                    'non_interaction': true
                });
                
                scrollDepthTriggered[depth] = true;
                console.log(`Scroll depth ${depth}% tracked`);
            }
        });
    }, { passive: true });
    
    console.log('Scroll tracking initialized');
}

// Track time on page
function initTimeOnPageTracking() {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    const timeIntervals = [30, 60, 120, 180, 300]; // seconds
    let timeIntervalsTriggered = {};
    const startTime = new Date();
    
    timeIntervals.forEach(interval => {
        timeIntervalsTriggered[interval] = false;
    });
    
    const timeTrackingInterval = setInterval(function() {
        const currentTime = new Date();
        const timeOnPage = Math.floor((currentTime - startTime) / 1000); // in seconds
        
        timeIntervals.forEach(interval => {
            if (timeOnPage >= interval && !timeIntervalsTriggered[interval]) {
                gtag('event', 'time_on_page', {
                    'event_category': 'Time on Page',
                    'event_label': `${interval} seconds`,
                    'non_interaction': true
                });
                
                timeIntervalsTriggered[interval] = true;
                console.log(`Time on page ${interval} seconds tracked`);
            }
        });
    }, 1000);
    
    // Clear interval when page is unloaded
    window.addEventListener('beforeunload', function() {
        clearInterval(timeTrackingInterval);
    });
    
    console.log('Time on page tracking initialized');
}

// Track conversion goals
function trackConversion(conversionType, conversionValue = 0, currency = 'USD') {
    if (typeof gtag !== 'function') {
        console.error('Google Analytics not initialized');
        return;
    }
    
    gtag('event', 'conversion', {
        'event_category': 'Conversions',
        'event_label': conversionType,
        'value': conversionValue,
        'currency': currency
    });
    
    console.log('Conversion tracked:', conversionType, conversionValue, currency);
}

// Initialize all tracking features
function initializeAllTracking(measurementId) {
    // Store measurement ID globally
    window.measurementId = measurementId;
    
    // Initialize Google Analytics
    initializeAnalytics(measurementId);
    
    // Initialize scroll depth tracking
    initScrollTracking();
    
    // Initialize time on page tracking
    initTimeOnPageTracking();
    
    // Track outbound links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.hostname !== window.location.hostname && !target.hasAttribute('data-no-track')) {
            e.preventDefault();
            trackOutboundLink(target.href, target.textContent.trim());
            setTimeout(function() {
                window.location.href = target.href;
            }, 100);
        }
    });
    
    // Track file downloads
    const downloadExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'];
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target) {
            const href = target.href.toLowerCase();
            const extension = href.split('.').pop();
            if (downloadExtensions.includes(extension) && !target.hasAttribute('data-no-track')) {
                trackDownload(href, target.textContent.trim() || target.getAttribute('download'));
            }
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form && !form.hasAttribute('data-no-track')) {
            trackFormSubmission(form.getAttribute('name') || form.getAttribute('id') || 'Unknown Form', form.getAttribute('id') || '');
        }
    });
    
    console.log('All tracking features initialized');
}

// Export functions for use in other scripts
window.ElevateAnalytics = {
    initialize: initializeAllTracking,
    trackEvent: trackEvent,
    trackPageView: trackPageView,
    trackFormSubmission: trackFormSubmission,
    trackOutboundLink: trackOutboundLink,
    trackDownload: trackDownload,
    trackConversion: trackConversion
};

// Auto-initialize if measurement ID is provided in a data attribute
document.addEventListener('DOMContentLoaded', function() {
    const analyticsId = document.body.getAttribute('data-analytics-id');
    if (analyticsId) {
        initializeAllTracking(analyticsId);
    } else {
        console.log('No Analytics ID found. Add data-analytics-id attribute to the body tag to auto-initialize.');
    }
});