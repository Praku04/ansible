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
    function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message !== '') {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            chatbotInput.value = '';
            
            // Get bot response (now async)
            getBotResponse(message).then(response => {
                addMessage(response, 'bot');
            }).catch(error => {
                console.error('Error getting response:', error);
                addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
            });
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
            return getFallbackResponse(message);
        }
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        return getFallbackResponse(message);
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

// Fallback function for when API is not available
function getFallbackResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
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
        return 'Our program costs vary depending on the destination, duration, and inclusions. Please fill out the enquiry form on our website or contact us directly for a customized quote.';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('call')) {
        return 'You can reach us at +91 98765 43210 or email us at info@elevatexperia.com. Alternatively, you can fill out the contact form on our website.';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('office') || lowerMessage.includes('address')) {
        return 'Our office is located at 123 Education Street, New Delhi, India 110001. We are open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 10:00 AM to 4:00 PM.';
    } else if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('register')) {
        return 'To book a tour, please fill out the enquiry form on our website or contact us directly. Our team will get back to you with available dates and registration details.';
    } else if (lowerMessage.includes('thank')) {
        return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return 'Thank you for chatting with us! Feel free to reach out if you have any more questions. Have a great day!';
    } else {
        return 'I\'m not sure I understand. Could you please rephrase your question or ask about our educational tours, programs, booking process, or contact information?';
    }
}
}