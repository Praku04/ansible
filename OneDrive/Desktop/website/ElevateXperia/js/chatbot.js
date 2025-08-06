// Chatbot functionality for ElevateXperia website
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot elements
    createChatbotElements();
    
    // Initialize chatbot functionality
    initializeChatbot();
});

// Function to create chatbot elements
function createChatbotElements() {
    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <div class="chatbot-icon" id="chatbotIcon">
            <i class="fas fa-comment-dots"></i>
        </div>
        <div class="chatbot-box" id="chatbotBox">
            <div class="chatbot-header">
                <h5>ElevateXperia Assistant</h5>
                <button class="chatbot-close" id="chatbotClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot-message">
                    <div class="message-content">Hello! I'm your ElevateXperia assistant. How can I help you today?</div>
                </div>
            </div>
            <div class="chatbot-input">
                <input type="text" id="chatbotInput" placeholder="Type your message...">
                <button id="chatbotSend">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add chatbot container to the body
    document.body.appendChild(chatbotContainer);
    
    // Add chatbot styles
    const chatbotStyles = document.createElement('style');
    chatbotStyles.innerHTML = `
        .chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
        }
        
        .chatbot-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .chatbot-icon i {
            color: white;
            font-size: 24px;
        }
        
        .chatbot-icon:hover {
            transform: scale(1.05);
        }
        
        .chatbot-box {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 450px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        
        .chatbot-header {
            padding: 15px;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chatbot-header h5 {
            margin: 0;
            font-weight: 600;
        }
        
        .chatbot-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
        
        .chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
        }
        
        .message {
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
        }
        
        .user-message {
            align-items: flex-end;
        }
        
        .bot-message {
            align-items: flex-start;
        }
        
        .message-content {
            padding: 10px 15px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
        }
        
        .user-message .message-content {
            background-color: var(--primary-color);
            color: white;
            border-bottom-right-radius: 5px;
        }
        
        .bot-message .message-content {
            background-color: #f1f1f1;
            color: #333;
            border-bottom-left-radius: 5px;
        }
        
        /* Typing indicator styles */
        .typing-indicator .message-content {
            padding: 10px 15px;
            display: flex;
            align-items: center;
        }
        
        .typing-indicator .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #888;
            margin: 0 2px;
            animation: typing-animation 1.4s infinite ease-in-out;
        }
        
        .typing-indicator .dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing-animation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-5px);
            }
        }
        
        .chatbot-input {
            display: flex;
            padding: 10px 15px;
            border-top: 1px solid #eee;
        }
        
        .chatbot-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }
        
        .chatbot-input button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chatbot-input button:hover {
            background-color: var(--secondary-color);
        }
    `;
    
    // Add styles to the head
    document.head.appendChild(chatbotStyles);
}

// Function to initialize chatbot functionality
function initializeChatbot() {
    // Get chatbot elements
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotBox = document.getElementById('chatbotBox');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    // Toggle chatbot box when icon is clicked
    chatbotIcon.addEventListener('click', function() {
        chatbotBox.style.display = chatbotBox.style.display === 'flex' ? 'none' : 'flex';
        if (chatbotBox.style.display === 'flex') {
            chatbotInput.focus();
        }
    });
    
    // Close chatbot box when close button is clicked
    chatbotClose.addEventListener('click', function() {
        chatbotBox.style.display = 'none';
    });
    
    // Send message when send button is clicked
    chatbotSend.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message when Enter key is pressed
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to send message
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message !== '') {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            chatbotInput.value = '';
            
            try {
                // Get bot response
                const response = await getBotResponse(message);
                addMessage(response, 'bot');
            } catch (error) {
                console.error('Error getting response:', error);
                addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
            }
        }
    }
    
    // Function to add message to chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom of messages
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Function to get bot response based on user message
async function getBotResponse(message) {
    try {
        // Show typing indicator
        showTypingIndicator();
        
        const response = await fetch('../php/chatbot_api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                session_id: generateSessionId()
            })
        });
        
        // Hide typing indicator
        hideTypingIndicator();
        
        if (response.ok) {
            const data = await response.json();
            return data.response;
        } else {
            console.error('Error:', response.statusText);
            return await getFallbackResponse(message);
        }
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        return await getFallbackResponse(message);
    }
}

// Generate a session ID if one doesn't exist
function generateSessionId() {
    if (!sessionStorage.getItem('chatSessionId')) {
        sessionStorage.setItem('chatSessionId', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    }
    return sessionStorage.getItem('chatSessionId');
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    typingIndicator.id = 'typingIndicator';
    
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Educational trip data
const educationalTripData = {
    'silicon_valley': {
        name: 'Silicon Valley Tech Tour',
        duration: '10 Days',
        cost: '$3,500 - $4,200',
        description: 'Visit top tech companies like Google, Apple, and Meta in the heart of innovation.',
        highlights: ['Google Campus Tour', 'Apple Park Visit', 'Meta HQ Experience', 'Stanford University Tour', 'Networking with Tech Professionals'],
        suitable_for: 'Computer Science, IT, and Engineering students',
        upcoming_dates: ['June 15-25, 2024', 'August 10-20, 2024', 'December 5-15, 2024']
    },
    'iit_tour': {
        name: 'IIT Campus Experience',
        duration: '7 Days',
        cost: '₹45,000 - ₹60,000',
        description: 'Explore India\'s premier engineering institutions and interact with faculty and students.',
        highlights: ['IIT Bombay Campus Tour', 'IIT Delhi Research Labs', 'IIT Madras Innovation Center', 'Interaction with IIT Professors', 'Student Project Exhibitions'],
        suitable_for: 'High school students and engineering aspirants',
        upcoming_dates: ['May 20-27, 2024', 'July 8-15, 2024', 'November 12-19, 2024']
    },
    'european_universities': {
        name: 'European Educational Excellence',
        duration: '14 Days',
        cost: '€4,200 - €5,500',
        description: 'Experience the academic heritage of Europe\'s oldest and most prestigious universities.',
        highlights: ['Oxford University', 'Cambridge University', 'Sorbonne University', 'ETH Zurich', 'Cultural Immersion Activities'],
        suitable_for: 'College students across all disciplines',
        upcoming_dates: ['April 10-24, 2024', 'July 5-19, 2024', 'September 15-29, 2024']
    },
    'leadership_program': {
        name: 'Global Leadership Program',
        duration: '12 Days',
        cost: '$4,800 - $5,500',
        description: 'Develop leadership skills through workshops and interactions with global leaders.',
        highlights: ['Leadership Workshops', 'Corporate Visits', 'Case Study Competitions', 'Networking Events', 'Personal Development Sessions'],
        suitable_for: 'Business, Management, and Entrepreneurship students',
        upcoming_dates: ['May 5-17, 2024', 'August 20-September 1, 2024', 'November 10-22, 2024']
    },
    'medical_immersion': {
        name: 'Medical Sciences Immersion',
        duration: '9 Days',
        cost: '$3,900 - $4,600',
        description: 'Gain insights into medical education and healthcare systems at leading institutions.',
        highlights: ['Hospital Visits', 'Medical School Tours', 'Healthcare Innovation Centers', 'Interaction with Medical Professionals', 'Medical Simulation Labs'],
        suitable_for: 'Pre-med and Medical students',
        upcoming_dates: ['June 1-10, 2024', 'September 5-14, 2024', 'December 10-19, 2024']
    }
};

// College and university data
const collegeData = {
    'harvard': {
        name: 'Harvard University',
        location: 'Cambridge, Massachusetts, USA',
        founded: 1636,
        famous_for: 'Ivy League research university, oldest institution of higher education in the US',
        notable_alumni: ['Barack Obama', 'Mark Zuckerberg', 'Bill Gates', 'John F. Kennedy'],
        tour_highlights: ['Harvard Yard', 'Widener Library', 'Harvard Museum of Natural History', 'Harvard Business School']
    },
    'oxford': {
        name: 'University of Oxford',
        location: 'Oxford, England',
        founded: 1096,
        famous_for: 'Oldest university in the English-speaking world, collegiate research university',
        notable_alumni: ['Stephen Hawking', 'J.R.R. Tolkien', 'Indira Gandhi', 'Bill Clinton'],
        tour_highlights: ['Bodleian Library', 'Christ Church College', 'Radcliffe Camera', 'Oxford University Museum of Natural History']
    },
    'iit_bombay': {
        name: 'Indian Institute of Technology Bombay',
        location: 'Mumbai, India',
        founded: 1958,
        famous_for: 'Premier engineering and technology institution in India',
        notable_alumni: ['Nandan Nilekani', 'Manohar Parrikar', 'Kanwal Rekhi'],
        tour_highlights: ['Academic Area', 'Research Park', 'Central Library', 'Gulmohar Restaurant', 'Powai Lake']
    },
    'mit': {
        name: 'Massachusetts Institute of Technology',
        location: 'Cambridge, Massachusetts, USA',
        founded: 1861,
        famous_for: 'World-leading science and technology research institution',
        notable_alumni: ['Kofi Annan', 'Buzz Aldrin', 'Richard Feynman', 'Jonah Peretti'],
        tour_highlights: ['MIT Media Lab', 'Great Dome', 'Stata Center', 'MIT Museum', 'Infinite Corridor']
    },
    'stanford': {
        name: 'Stanford University',
        location: 'Stanford, California, USA',
        founded: 1885,
        famous_for: 'Leading research and teaching institution, heart of Silicon Valley',
        notable_alumni: ['Sergey Brin', 'Larry Page', 'Elon Musk', 'Tiger Woods'],
        tour_highlights: ['Main Quad', 'Hoover Tower', 'Stanford Memorial Church', 'Cantor Arts Center']
    }
};

// Company visit data
const companyData = {
    'google': {
        name: 'Google',
        headquarters: 'Mountain View, California, USA',
        founded: 1998,
        famous_for: 'Search engine, Android, Google Workspace, AI research',
        visit_highlights: ['Googleplex Campus Tour', 'Innovation Workshops', 'Google Product Demos', 'Employee Panel Discussions']
    },
    'microsoft': {
        name: 'Microsoft',
        headquarters: 'Redmond, Washington, USA',
        founded: 1975,
        famous_for: 'Windows OS, Office Suite, Azure Cloud, Xbox',
        visit_highlights: ['Microsoft Visitor Center', 'Surface Lab Tours', 'Xbox Gaming Zone', 'AI & Research Division']
    },
    'apple': {
        name: 'Apple',
        headquarters: 'Cupertino, California, USA',
        founded: 1976,
        famous_for: 'iPhone, Mac, iPad, iOS, innovative design',
        visit_highlights: ['Apple Park Visitor Center', 'Product Design Showcase', 'Innovation Talks', 'Apple History Exhibition']
    },
    'tesla': {
        name: 'Tesla',
        headquarters: 'Austin, Texas, USA',
        founded: 2003,
        famous_for: 'Electric vehicles, clean energy, autonomous driving',
        visit_highlights: ['Factory Tour', 'Vehicle Test Drives', 'Sustainable Energy Presentations', 'Engineering Workshops']
    },
    'infosys': {
        name: 'Infosys',
        headquarters: 'Bangalore, India',
        founded: 1981,
        famous_for: 'IT services, consulting, outsourcing',
        visit_highlights: ['Infosys Campus Tour', 'Innovation Hub', 'Leadership Talks', 'Technology Demonstrations']
    }
};

// User data storage
let userData = {
    name: '',
    email: '',
    phone: '',
    interested_program: '',
    enquiry_stage: 0 // 0: not started, 1: asked name, 2: asked email, 3: asked phone, 4: asked program, 5: completed
};

// Real-time data integration
const realTimeDataSources = {
    weather: 'https://api.openweathermap.org/data/2.5/weather', // Replace with your API key in production
    exchange_rates: 'https://api.exchangerate-api.com/v4/latest/USD', // Replace with your API key in production
    flight_status: 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/', // Replace with your API key in production
    news: 'https://newsapi.org/v2/top-headlines?country=us&category=business', // Replace with your API key in production
    covid: 'https://disease.sh/v3/covid-19/countries/' // No API key required
};

// Cache for real-time data to avoid excessive API calls
const dataCache = {
    weather: { data: null, timestamp: 0, ttl: 3600000 }, // 1 hour TTL
    exchange_rates: { data: null, timestamp: 0, ttl: 86400000 }, // 24 hours TTL
    flight_status: { data: null, timestamp: 0, ttl: 300000 }, // 5 minutes TTL
    news: { data: null, timestamp: 0, ttl: 3600000 }, // 1 hour TTL
    covid: { data: null, timestamp: 0, ttl: 86400000 } // 24 hours TTL
};

// Function to fetch real-time data
async function fetchRealTimeData(dataType, params = {}) {
    // Check if we have cached data that's still valid
    const cache = dataCache[dataType];
    const now = Date.now();
    
    if (cache && cache.data && (now - cache.timestamp < cache.ttl)) {
        console.log(`Using cached ${dataType} data`);
        return cache.data;
    }
    
    // Prepare the API URL based on data type and parameters
    let apiUrl = realTimeDataSources[dataType];
    
    // Add parameters to the URL
    if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params).toString();
        apiUrl += (apiUrl.includes('?') ? '&' : '?') + queryParams;
    }
    
    try {
        console.log(`Fetching real-time ${dataType} data from ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update cache
        dataCache[dataType] = {
            data: data,
            timestamp: now,
            ttl: dataCache[dataType].ttl
        };
        
        return data;
    } catch (error) {
        console.error(`Error fetching ${dataType} data:`, error);
        return null;
    }
};

// Function to get weather information for a destination
async function getDestinationWeather(destination) {
    try {
        // Replace spaces with + for API compatibility
        const formattedDestination = destination.replace(/\s+/g, '+');
        
        // Use a mock API key - replace with your actual API key in production
        const params = {
            q: formattedDestination,
            units: 'metric',
            appid: 'YOUR_API_KEY_HERE' // Replace with actual API key in production
        };
        
        // For demo purposes, return mock data instead of making actual API call
        // In production, uncomment the following line and use your actual API key
        // const weatherData = await fetchRealTimeData('weather', params);
        
        // Mock data for demonstration
        const mockWeatherData = {
            name: destination,
            main: {
                temp: Math.round(15 + Math.random() * 15), // Random temperature between 15-30°C
                feels_like: Math.round(15 + Math.random() * 15),
                humidity: Math.round(40 + Math.random() * 40) // Random humidity between 40-80%
            },
            weather: [{
                main: ['Clear', 'Clouds', 'Rain', 'Sunny'][Math.floor(Math.random() * 4)],
                description: 'Weather condition description'
            }]
        };
        
        return mockWeatherData;
    } catch (error) {
        console.error('Error getting destination weather:', error);
        return null;
    }
}

// Function to get currency exchange rates
async function getExchangeRates(baseCurrency = 'USD') {
    try {
        // For demo purposes, return mock data instead of making actual API call
        // In production, uncomment the following line and use your actual API key
        // const exchangeData = await fetchRealTimeData('exchange_rates', { base: baseCurrency });
        
        // Mock data for demonstration
        const mockExchangeData = {
            base: baseCurrency,
            rates: {
                EUR: 0.85 + (Math.random() * 0.1 - 0.05), // Random rate around 0.85
                GBP: 0.75 + (Math.random() * 0.1 - 0.05), // Random rate around 0.75
                INR: 75 + (Math.random() * 5 - 2.5),      // Random rate around 75
                AUD: 1.35 + (Math.random() * 0.1 - 0.05), // Random rate around 1.35
                CAD: 1.25 + (Math.random() * 0.1 - 0.05)  // Random rate around 1.25
            },
            date: new Date().toISOString().split('T')[0] // Today's date
        };
        
        return mockExchangeData;
    } catch (error) {
        console.error('Error getting exchange rates:', error);
        return null;
    }
}

// Function to get latest news related to education or travel
async function getLatestNews() {
    try {
        // For demo purposes, return mock data instead of making actual API call
        // In production, uncomment the following line and use your actual API key
        // const newsData = await fetchRealTimeData('news', { category: 'education', apiKey: 'YOUR_API_KEY_HERE' });
        
        // Mock data for demonstration
        const mockNewsData = {
            status: 'ok',
            totalResults: 3,
            articles: [
                {
                    title: 'New Study Abroad Opportunities for STEM Students',
                    description: 'Universities are expanding study abroad programs specifically designed for STEM students.',
                    publishedAt: new Date().toISOString(),
                    url: 'https://example.com/news/1'
                },
                {
                    title: 'Top 10 Educational Destinations for 2024',
                    description: 'A new report ranks the best cities worldwide for educational tourism and immersion experiences.',
                    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    url: 'https://example.com/news/2'
                },
                {
                    title: 'How Educational Travel Enhances Career Prospects',
                    description: 'Research shows that students with international educational experiences are more competitive in the job market.',
                    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    url: 'https://example.com/news/3'
                }
            ]
        };
        
        return mockNewsData;
    } catch (error) {
        console.error('Error getting latest news:', error);
        return null;
    }
}

// Function to get COVID-19 information for a country
async function getCovidInfo(country) {
    try {
        // For demo purposes, return mock data instead of making actual API call
        // In production, uncomment the following line
        // const covidData = await fetchRealTimeData('covid', {}, country);
        
        // Mock data for demonstration
        const mockCovidData = {
            country: country,
            cases: Math.floor(10000 + Math.random() * 90000),
            deaths: Math.floor(100 + Math.random() * 900),
            recovered: Math.floor(9000 + Math.random() * 80000),
            active: Math.floor(1000 + Math.random() * 9000),
            critical: Math.floor(10 + Math.random() * 90),
            tests: Math.floor(100000 + Math.random() * 900000),
            updated: Date.now()
        };
        
        return mockCovidData;
    } catch (error) {
        console.error('Error getting COVID information:', error);
        return null;
    }
}

// Fallback function for when API is not available
async function getFallbackResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check if we're in the middle of collecting user information
    if (userData.enquiry_stage > 0 && userData.enquiry_stage < 5) {
        return handleUserDataCollection(message);
    }
    
    // Check for keywords and return appropriate response
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return 'Hello! How can I assist you with our educational tours today?';
    } else if (lowerMessage.includes('tour') || lowerMessage.includes('program')) {
        return 'We offer various educational tours including Immersion Programs, Leadership Walks, Campus Tours, and Corporate Visits. Would you like more information about any specific program?';
    } else if (lowerMessage.includes('immersion')) {
        return 'Our Immersion Programs provide hands-on experience in fields like Technology, Engineering, Medicine, and more. These programs typically last 1-2 weeks and include visits to top institutions and companies.';
    } else if (lowerMessage.includes('leadership')) {
        return 'Leadership Walks are designed to develop leadership skills through interactions with industry leaders, workshops, and real-world challenges. These programs are perfect for students looking to enhance their leadership capabilities.';
    } else if (lowerMessage.includes('campus')) {
        return 'We organize Campus Tours to prestigious institutions in India and abroad, including IITs, Harvard, Oxford, and more. These tours provide insights into academic life, admission processes, and career opportunities.';
    } else if (lowerMessage.includes('corporate') || lowerMessage.includes('company')) {
        return 'Our Corporate Visits take you to leading companies like Google, Microsoft, Tesla, and more. These visits offer insights into corporate culture, innovation processes, and career opportunities.';
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
        return getSpecificCostInformation(lowerMessage);
    } else if (lowerMessage.includes('college') || lowerMessage.includes('university')) {
        return getCollegeInformation(lowerMessage);
    } else if (lowerMessage.includes('company') || lowerMessage.includes('corporate')) {
        return getCompanyInformation(lowerMessage);
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('call')) {
        return 'You can reach us at +91 98765 43210 or email us at info@elevatexperia.com. Alternatively, you can fill out the contact form on our website.';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('office') || lowerMessage.includes('address')) {
        return 'Our office is located at 123 Education Street, New Delhi, India 110001. We are open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 10:00 AM to 4:00 PM.';
    } else if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('register')) {
        return 'To book a tour, please fill out the enquiry form on our website or contact us directly. Our team will get back to you with available dates and registration details.';
    } else if (lowerMessage.includes('enquiry') || lowerMessage.includes('inquiry') || lowerMessage.includes('interested')) {
        // Start collecting user information
        userData.enquiry_stage = 1;
        return 'I\'d be happy to help you with your enquiry. Could you please tell me your name?';
    } else if (lowerMessage.includes('thank')) {
        return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return 'Thank you for chatting with us! Feel free to reach out if you have any more questions. Have a great day!';
    } else {
        return 'I\'m not sure I understand. Could you please rephrase your question or ask about our educational tours, programs, booking process, or contact information?';
    }
}

// Function to handle user data collection
function handleUserDataCollection(message) {
    switch(userData.enquiry_stage) {
        case 1: // Collecting name
            userData.name = message;
            userData.enquiry_stage = 2;
            return `Thank you, ${userData.name}! Could you please share your email address so we can send you more information?`;
        
        case 2: // Collecting email
            if (isValidEmail(message)) {
                userData.email = message;
                userData.enquiry_stage = 3;
                return 'Great! Could you also provide your phone number for our records?';
            } else {
                return 'That doesn\'t look like a valid email address. Could you please check and try again?';
            }
        
        case 3: // Collecting phone
            if (isValidPhone(message)) {
                userData.phone = message;
                userData.enquiry_stage = 4;
                return 'Thank you! Which of our educational programs are you most interested in? (e.g., Silicon Valley Tour, IIT Campus Experience, European Universities, etc.)';
            } else {
                return 'That doesn\'t look like a valid phone number. Could you please check and try again?';
            }
        
        case 4: // Collecting program interest
            userData.interested_program = message;
            userData.enquiry_stage = 5;
            
            // Save user data (in a real implementation, this would go to a database)
            console.log('User Enquiry Data:', userData);
            
            return `Thank you for your interest in our ${userData.interested_program} program, ${userData.name}! Our team will contact you at ${userData.email} or ${userData.phone} with more information within 24 hours. Is there anything specific about this program you'd like to know now?`;
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone format
function isValidPhone(phone) {
    // Simple validation - at least 10 digits
    const phoneRegex = /\d{10,}/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
}

// Function to get specific cost information
async function getSpecificCostInformation(message) {
    let response = '';
    
    if (message.includes('silicon') || message.includes('valley') || message.includes('tech')) {
        const trip = educationalTripData.silicon_valley;
        response = `The ${trip.name} costs approximately ${trip.cost} per person. This ${trip.duration} program includes visits to ${trip.highlights.join(', ')}. Upcoming dates: ${trip.upcoming_dates.join(', ')}. Would you like more details?`;
        
        // Add real-time weather information if available
        try {
            const weatherData = await getDestinationWeather('San Francisco');
            if (weatherData) {
                response += `\n\nCurrent weather in Silicon Valley: ${weatherData.weather[0].main}, ${weatherData.main.temp}°C with ${weatherData.main.humidity}% humidity.`;
            }
        } catch (error) {
            console.error('Error getting weather data:', error);
        }
        
        // Add exchange rate information
        try {
            const exchangeData = await getExchangeRates('USD');
            if (exchangeData && exchangeData.rates.INR) {
                const costInUSD = parseInt(trip.cost.replace('$', '').split(' - ')[0]);
                const costInINR = Math.round(costInUSD * exchangeData.rates.INR);
                response += `\n\nBased on today's exchange rate (1 USD = ₹${exchangeData.rates.INR.toFixed(2)}), the program starts at approximately ₹${costInINR}.`;
            }
        } catch (error) {
            console.error('Error getting exchange rate data:', error);
        }
        
    } else if (message.includes('iit') || message.includes('campus experience')) {
        const trip = educationalTripData.iit_tour;
        response = `The ${trip.name} costs approximately ${trip.cost} per person. This ${trip.duration} program includes visits to ${trip.highlights.join(', ')}. Upcoming dates: ${trip.upcoming_dates.join(', ')}. Would you like more details?`;
        
        // Add real-time weather information if available
        try {
            const weatherData = await getDestinationWeather('Mumbai');
            if (weatherData) {
                response += `\n\nCurrent weather in Mumbai: ${weatherData.weather[0].main}, ${weatherData.main.temp}°C with ${weatherData.main.humidity}% humidity.`;
            }
        } catch (error) {
            console.error('Error getting weather data:', error);
        }
        
    } else if (message.includes('europe') || message.includes('european')) {
        const trip = educationalTripData.european_universities;
        response = `The ${trip.name} costs approximately ${trip.cost} per person. This ${trip.duration} program includes visits to ${trip.highlights.join(', ')}. Upcoming dates: ${trip.upcoming_dates.join(', ')}. Would you like more details?`;
        
        // Add real-time weather information if available
        try {
            const weatherData = await getDestinationWeather('London');
            if (weatherData) {
                response += `\n\nCurrent weather in London: ${weatherData.weather[0].main}, ${weatherData.main.temp}°C with ${weatherData.main.humidity}% humidity.`;
            }
        } catch (error) {
            console.error('Error getting weather data:', error);
        }
        
        // Add exchange rate information
        try {
            const exchangeData = await getExchangeRates('EUR');
            if (exchangeData && exchangeData.rates.INR) {
                const costInEUR = parseInt(trip.cost.replace('€', '').split(' - ')[0]);
                const costInINR = Math.round(costInEUR * exchangeData.rates.INR);
                response += `\n\nBased on today's exchange rate (1 EUR = ₹${exchangeData.rates.INR.toFixed(2)}), the program starts at approximately ₹${costInINR}.`;
            }
        } catch (error) {
            console.error('Error getting exchange rate data:', error);
        }
        
    } else if (message.includes('leadership')) {
        const trip = educationalTripData.leadership_program;
        response = `The ${trip.name} costs approximately ${trip.cost} per person. This ${trip.duration} program includes ${trip.highlights.join(', ')}. Upcoming dates: ${trip.upcoming_dates.join(', ')}. Would you like more details?`;
        
        // Add exchange rate information
        try {
            const exchangeData = await getExchangeRates('USD');
            if (exchangeData && exchangeData.rates.INR) {
                const costInUSD = parseInt(trip.cost.replace('$', '').split(' - ')[0]);
                const costInINR = Math.round(costInUSD * exchangeData.rates.INR);
                response += `\n\nBased on today's exchange rate (1 USD = ₹${exchangeData.rates.INR.toFixed(2)}), the program starts at approximately ₹${costInINR}.`;
            }
        } catch (error) {
            console.error('Error getting exchange rate data:', error);
        }
        
    } else if (message.includes('medical') || message.includes('medicine')) {
        const trip = educationalTripData.medical_immersion;
        response = `The ${trip.name} costs approximately ${trip.cost} per person. This ${trip.duration} program includes visits to ${trip.highlights.join(', ')}. Upcoming dates: ${trip.upcoming_dates.join(', ')}. Would you like more details?`;
        
        // Add exchange rate information
        try {
            const exchangeData = await getExchangeRates('USD');
            if (exchangeData && exchangeData.rates.INR) {
                const costInUSD = parseInt(trip.cost.replace('$', '').split(' - ')[0]);
                const costInINR = Math.round(costInUSD * exchangeData.rates.INR);
                response += `\n\nBased on today's exchange rate (1 USD = ₹${exchangeData.rates.INR.toFixed(2)}), the program starts at approximately ₹${costInINR}.`;
            }
        } catch (error) {
            console.error('Error getting exchange rate data:', error);
        }
        
    } else {
        // Get the latest news about educational travel
        try {
            const newsData = await getLatestNews();
            if (newsData && newsData.articles && newsData.articles.length > 0) {
                const latestArticle = newsData.articles[0];
                response = `Our program costs vary depending on the destination, duration, and inclusions. We offer programs ranging from ₹45,000 to ₹3,50,000. Please ask about a specific program for detailed pricing, or provide your contact information for a personalized quote.\n\nLatest Education News: ${latestArticle.title} - ${latestArticle.description}`;
            } else {
                response = 'Our program costs vary depending on the destination, duration, and inclusions. We offer programs ranging from ₹45,000 to ₹3,50,000. Please ask about a specific program for detailed pricing, or provide your contact information for a personalized quote.';
            }
        } catch (error) {
            console.error('Error getting news data:', error);
            response = 'Our program costs vary depending on the destination, duration, and inclusions. We offer programs ranging from ₹45,000 to ₹3,50,000. Please ask about a specific program for detailed pricing, or provide your contact information for a personalized quote.';
        }
    }
    
    return response;
}

// Function to get college information
function getCollegeInformation(message) {
    if (message.includes('harvard')) {
        const college = collegeData.harvard;
        return `${college.name} in ${college.location} was founded in ${college.founded} and is ${college.famous_for}. Notable alumni include ${college.notable_alumni.join(', ')}. Our tour includes visits to ${college.tour_highlights.join(', ')}. Would you like to know about our Harvard University tour packages?`;
    } else if (message.includes('oxford')) {
        const college = collegeData.oxford;
        return `${college.name} in ${college.location} was founded in ${college.founded} and is ${college.famous_for}. Notable alumni include ${college.notable_alumni.join(', ')}. Our tour includes visits to ${college.tour_highlights.join(', ')}. Would you like to know about our Oxford University tour packages?`;
    } else if (message.includes('iit') || message.includes('indian institute')) {
        const college = collegeData.iit_bombay;
        return `${college.name} in ${college.location} was founded in ${college.founded} and is ${college.famous_for}. Notable alumni include ${college.notable_alumni.join(', ')}. Our tour includes visits to ${college.tour_highlights.join(', ')}. Would you like to know about our IIT tour packages?`;
    } else if (message.includes('mit') || message.includes('massachusetts')) {
        const college = collegeData.mit;
        return `${college.name} in ${college.location} was founded in ${college.founded} and is ${college.famous_for}. Notable alumni include ${college.notable_alumni.join(', ')}. Our tour includes visits to ${college.tour_highlights.join(', ')}. Would you like to know about our MIT tour packages?`;
    } else if (message.includes('stanford')) {
        const college = collegeData.stanford;
        return `${college.name} in ${college.location} was founded in ${college.founded} and is ${college.famous_for}. Notable alumni include ${college.notable_alumni.join(', ')}. Our tour includes visits to ${college.tour_highlights.join(', ')}. Would you like to know about our Stanford University tour packages?`;
    } else {
        return 'We organize tours to prestigious institutions worldwide, including Harvard, Oxford, MIT, Stanford, IITs, and many more. Which specific university or college would you like to know more about?';
    }
}

// Function to get company information
function getCompanyInformation(message) {
    if (message.includes('google')) {
        const company = companyData.google;
        return `${company.name} is headquartered in ${company.headquarters} and was founded in ${company.founded}. They are famous for ${company.famous_for}. Our company visit includes ${company.visit_highlights.join(', ')}. Would you like to know about our Silicon Valley Tech Tour that includes Google?`;
    } else if (message.includes('microsoft')) {
        const company = companyData.microsoft;
        return `${company.name} is headquartered in ${company.headquarters} and was founded in ${company.founded}. They are famous for ${company.famous_for}. Our company visit includes ${company.visit_highlights.join(', ')}. Would you like to know about our tech tours that include Microsoft?`;
    } else if (message.includes('apple')) {
        const company = companyData.apple;
        return `${company.name} is headquartered in ${company.headquarters} and was founded in ${company.founded}. They are famous for ${company.famous_for}. Our company visit includes ${company.visit_highlights.join(', ')}. Would you like to know about our Silicon Valley Tech Tour that includes Apple?`;
    } else if (message.includes('tesla')) {
        const company = companyData.tesla;
        return `${company.name} is headquartered in ${company.headquarters} and was founded in ${company.founded}. They are famous for ${company.famous_for}. Our company visit includes ${company.visit_highlights.join(', ')}. Would you like to know about our tech tours that include Tesla?`;
    } else if (message.includes('infosys')) {
        const company = companyData.infosys;
        return `${company.name} is headquartered in ${company.headquarters} and was founded in ${company.founded}. They are famous for ${company.famous_for}. Our company visit includes ${company.visit_highlights.join(', ')}. Would you like to know about our Indian tech company tours that include Infosys?`;
    } else {
        return 'We organize visits to leading companies worldwide, including Google, Microsoft, Apple, Tesla, Infosys, and many more. Which specific company would you like to know more about?';
    }
}
}