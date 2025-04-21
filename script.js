import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    setupCardInteractions();
    setupDemoInteractions();
    populateCalendarVisual();
});

// Conversation history for various LLM-powered features
const conversationHistories = {
    personalAssistant: [],
    tutor: [],
    mentalHealth: [],
    storyCollaboration: []
};

function initializeAnimations() {
    // Initial animations for page load
    gsap.from('header', { 
        y: -50, 
        opacity: 0, 
        duration: 1, 
        ease: 'power3.out' 
    });
    
    gsap.from('.card', { 
        y: 50, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: 'power2.out' 
    });
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Add a pulsing effect to the header icons on hover
        const icon = card.querySelector('.icon');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, { 
                scale: 1.2, 
                duration: 0.5, 
                repeat: -1, 
                yoyo: true 
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(icon, { 
                scale: 1, 
                duration: 0.5, 
                repeat: 0 
            });
        });
    });
}

function setupDemoInteractions() {
    setupPersonalAssistantDemo();
    setupTutorDemo();
    setupMentalHealthDemo();
    setupSpeechDemo();
    setupQuizDemo();
    setupTranslationDemo();
    setupArtGenerationDemo();
    setupStoryCollaborationDemo();
}

async function setupPersonalAssistantDemo() {
    const userInput = document.querySelector('#personal-assistant-input');
    const sendButton = document.querySelector('#personal-assistant-send');
    const chatContainer = document.querySelector('#personal-assistant-chat');
    
    if (userInput && sendButton && chatContainer) {
        sendButton.addEventListener('click', async () => {
            const userMessage = userInput.value.trim();
            if (!userMessage) return;
            
            // Add user message to UI
            addMessageToChat(chatContainer, userMessage, 'user');
            userInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            chatContainer.appendChild(typingIndicator);
            
            // Update conversation history
            const newMessage = {
                role: "user",
                content: userMessage
            };
            conversationHistories.personalAssistant.push(newMessage);
            
            // Limit history to last 10 messages
            conversationHistories.personalAssistant = 
                conversationHistories.personalAssistant.slice(-10);
            
            try {
                // Get response from LLM
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI personal assistant. You help with scheduling, reminders, and planning. Be concise and practical. If the user asks about scheduling or planning something, always acknowledge it and confirm you've noted it."
                        },
                        ...conversationHistories.personalAssistant
                    ]
                });
                
                // Remove typing indicator
                chatContainer.removeChild(typingIndicator);
                
                // Add AI response to UI
                addMessageToChat(chatContainer, completion.content, 'ai');
                
                // Update conversation history with AI response
                conversationHistories.personalAssistant.push(completion);
                
                // If message mentions scheduling, update calendar visual
                if (userMessage.toLowerCase().includes('schedule') || 
                    userMessage.toLowerCase().includes('appointment') || 
                    userMessage.toLowerCase().includes('meeting')) {
                    updateCalendarWithNewEvent(userMessage);
                }
            } catch (error) {
                console.error('Error getting LLM response:', error);
                chatContainer.removeChild(typingIndicator);
                addMessageToChat(chatContainer, "Sorry, I encountered an error processing your request.", 'ai');
            }
        });
        
        // Allow pressing Enter to send message
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendButton.click();
            }
        });
    }
}

function addMessageToChat(container, message, sender) {
    const messageElement = document.createElement('p');
    messageElement.className = sender === 'user' ? 'user-message' : 'ai-message';
    messageElement.textContent = message;
    
    // Animate message appearance
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(10px)';
    container.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function updateCalendarWithNewEvent(message) {
    // Simple event extraction based on common patterns
    const datePattern = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today)/i;
    const timePattern = /(\d{1,2}(:\d{2})?\s*(am|pm)?)/i;
    
    const dateMatch = message.match(datePattern);
    const timeMatch = message.match(timePattern);
    
    if (dateMatch && timeMatch) {
        const calendarDays = document.querySelectorAll('.calendar-day');
        let targetDay;
        
        switch (dateMatch[0].toLowerCase()) {
            case 'monday': targetDay = 2; break;
            case 'tuesday': targetDay = 3; break;
            case 'wednesday': targetDay = 4; break;
            case 'thursday': targetDay = 5; break;
            case 'friday': targetDay = 6; break;
            case 'saturday': targetDay = 7; break;
            case 'sunday': targetDay = 1; break;
            case 'tomorrow': targetDay = new Date().getDay() + 1; break;
            case 'today': targetDay = new Date().getDay(); break;
        }
        
        calendarDays.forEach(day => {
            const dayNum = parseInt(day.getAttribute('data-day'), 10);
            if (dayNum % 7 === targetDay % 7) {
                // Create event
                day.classList.add('has-event');
                
                // Extract potential event type (meeting, appointment, etc.)
                const eventTypes = ['meeting', 'appointment', 'call', 'reminder', 'event'];
                let eventType = 'Event';
                for (const type of eventTypes) {
                    if (message.toLowerCase().includes(type)) {
                        eventType = type.charAt(0).toUpperCase() + type.slice(1);
                        break;
                    }
                }
                
                // Add or update event indicator
                let indicator = day.querySelector('.event-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'event-indicator';
                    day.appendChild(indicator);
                }
                
                indicator.textContent = `${eventType} ${timeMatch[0]}`;
            }
        });
    }
}

async function setupTutorDemo() {
    const userQuestion = document.querySelector('#tutor-question');
    const askButton = document.querySelector('#tutor-ask');
    const responsesContainer = document.querySelector('#tutor-responses');
    
    if (userQuestion && askButton && responsesContainer) {
        askButton.addEventListener('click', async () => {
            const question = userQuestion.value.trim();
            if (!question) return;
            
            // Add user question to UI
            addMessageToChat(responsesContainer, question, 'user');
            userQuestion.value = '';
            
            // Show loading state
            const loadingElement = document.createElement('div');
            loadingElement.className = 'typing-indicator';
            loadingElement.innerHTML = '<span></span><span></span><span></span>';
            responsesContainer.appendChild(loadingElement);
            
            // Update conversation history
            conversationHistories.tutor.push({
                role: "user",
                content: question
            });
            
            try {
                // Get response from LLM
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a patient, knowledgeable tutor. Explain concepts clearly and at an appropriate level. Include examples where helpful. Be encouraging. If asked about math, science, language, or academic topics, provide a thorough but accessible explanation."
                        },
                        ...conversationHistories.tutor
                    ]
                });
                
                // Remove loading indicator
                responsesContainer.removeChild(loadingElement);
                
                // Add AI response to UI
                addMessageToChat(responsesContainer, completion.content, 'ai');
                
                // Update conversation history
                conversationHistories.tutor.push(completion);
            } catch (error) {
                console.error('Error getting LLM response:', error);
                responsesContainer.removeChild(loadingElement);
                addMessageToChat(responsesContainer, "Sorry, I couldn't generate a response right now.", 'ai');
            }
        });
        
        // Allow pressing Enter to send question
        userQuestion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                askButton.click();
            }
        });
    }
}

async function setupMentalHealthDemo() {
    const journalEntry = document.querySelector('#journal-entry');
    const submitButton = document.querySelector('#journal-submit');
    const feedbackContainer = document.querySelector('#journal-feedback');
    
    if (journalEntry && submitButton && feedbackContainer) {
        submitButton.addEventListener('click', async () => {
            const entry = journalEntry.value.trim();
            if (!entry) return;
            
            // Show loading indicator
            feedbackContainer.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            
            try {
                // Get reflective feedback from LLM
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a supportive, thoughtful mental health assistant. Provide reflective, empathetic responses to journal entries. Never diagnose. Focus on validation, gentle insights, and positive reinforcement. Keep responses brief (2-3 sentences)."
                        },
                        {
                            role: "user",
                            content: entry
                        }
                    ]
                });
                
                // Display the reflection
                feedbackContainer.innerHTML = `
                    <div class="reflection-card">
                        <h4>Reflection</h4>
                        <p>${completion.content}</p>
                    </div>
                `;
                
                // Animate feedback appearance
                gsap.from(feedbackContainer.querySelector('.reflection-card'), {
                    y: 20,
                    opacity: 0,
                    duration: 0.5
                });
            } catch (error) {
                console.error('Error getting LLM response:', error);
                feedbackContainer.innerHTML = '<p class="error-message">Unable to generate reflection right now.</p>';
            }
        });
    }
}

function setupSpeechDemo() {
    const speechButton = document.querySelector('.speech-btn');
    const speechText = document.querySelector('.speech-text');
    
    if (speechButton && speechText) {
        speechButton.addEventListener('click', () => {
            // Simulate speech recording and conversion
            speechButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"></path>
                </svg>
                Recording...
            `;
            
            speechButton.classList.add('recording');
            
            // Simulate recording for 3 seconds
            setTimeout(() => {
                speechButton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"></path>
                    </svg>
                    Record Speech
                `;
                
                speechButton.classList.remove('recording');
                speechText.textContent = "I need to schedule a meeting with the marketing team next week to discuss our new product launch strategy.";
                
                // Animate the text appearance
                gsap.from(speechText, { 
                    opacity: 0, 
                    y: 10, 
                    duration: 0.5 
                });
            }, 3000);
        });
    }
}

function setupQuizDemo() {
    const quizOptions = document.querySelectorAll('.quiz-options input');
    
    quizOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            // Reset all options
            quizOptions.forEach(opt => {
                opt.parentElement.style.fontWeight = 'normal';
                opt.parentElement.style.color = 'inherit';
            });
            
            // Highlight selected option
            if (e.target.checked) {
                const correctAnswer = e.target.parentElement.textContent.trim() === 'Paris';
                
                if (correctAnswer) {
                    e.target.parentElement.style.fontWeight = 'bold';
                    e.target.parentElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() || 'green';
                } else {
                    e.target.parentElement.style.fontWeight = 'bold';
                    e.target.parentElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || 'red';
                }
            }
        });
    });
}

function setupTranslationDemo() {
    const translationInput = document.querySelector('.translation-input textarea');
    const translationOutput = document.querySelector('.translation-output p');
    const inputLangSelect = document.querySelector('.translation-input .language-select');
    const outputLangSelect = document.querySelector('.translation-output .language-select');
    
    if (translationInput && translationOutput && inputLangSelect && outputLangSelect) {
        // Simple translation pairs for demo purposes
        const translations = {
            'Hello, how are you today?': {
                'es': '¡Hola! ¿Cómo estás hoy?',
                'fr': 'Bonjour, comment allez-vous aujourd\'hui?',
                'de': 'Hallo, wie geht es Ihnen heute?',
                'zh': '你好，今天过得怎么样？'
            }
        };
        
        // Update translation when input or languages change
        const updateTranslation = () => {
            const inputText = translationInput.value.trim();
            const fromLang = inputLangSelect.value;
            const toLang = outputLangSelect.value;
            
            if (inputText in translations && toLang in translations[inputText]) {
                translationOutput.textContent = translations[inputText][toLang];
            } else {
                translationOutput.textContent = `[Translation from ${fromLang} to ${toLang}]`;
            }
        };
        
        translationInput.addEventListener('input', updateTranslation);
        inputLangSelect.addEventListener('change', updateTranslation);
        outputLangSelect.addEventListener('change', updateTranslation);
    }
}

async function setupArtGenerationDemo() {
    const artPromptInput = document.querySelector('.art-prompt input');
    const artPlaceholder = document.querySelector('.art-placeholder');
    const generateButton = document.querySelector('#generate-art-btn');
    
    if (artPromptInput && artPlaceholder && generateButton) {
        generateButton.addEventListener('click', async () => {
            const prompt = artPromptInput.value.trim();
            if (!prompt) return;
            
            // Show loading indicator
            artPlaceholder.innerHTML = `
                <div class="art-loading">
                    <svg width="50" height="50" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#cccccc" stroke-width="4"></circle>
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#4285f4" stroke-width="4" stroke-dasharray="125.6" stroke-dashoffset="50" class="loading-circle"></circle>
                    </svg>
                    <p>Generating art...</p>
                </div>
            `;
            
            try {
                // Generate image using the imageGen API
                const result = await websim.imageGen({
                    prompt: prompt,
                    aspect_ratio: "1:1"
                });
                
                // Display the generated image
                artPlaceholder.innerHTML = `
                    <div class="generated-art">
                        <img src="${result.url}" alt="AI generated art based on: ${prompt}">
                    </div>
                `;
                
                // Animate image appearance
                gsap.from(artPlaceholder.querySelector('img'), {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.5
                });
            } catch (error) {
                console.error('Error generating image:', error);
                artPlaceholder.innerHTML = `
                    <div class="error-message">
                        <p>Error generating image. Please try again.</p>
                    </div>
                `;
            }
        });
    }
}

async function setupStoryCollaborationDemo() {
    const storyTextarea = document.querySelector('.story-starter textarea');
    const storyContinueBtn = document.querySelector('#story-continue-btn');
    const storyContinuation = document.querySelector('.story-continuation');
    const storyPrompt = document.querySelector('.story-prompt');
    
    if (storyTextarea && storyContinueBtn && storyContinuation && storyPrompt) {
        // Setup initial context
        conversationHistories.storyCollaboration = [
            {
                role: "system",
                content: "You are a creative writing assistant specializing in collaborative storytelling. Continue the story in an engaging, descriptive way that builds on both the original prompt and the user's contributions. Keep your continuations to 2-3 sentences."
            },
            {
                role: "user",
                content: "Story beginning: " + storyPrompt.textContent
            },
            {
                role: "assistant",
                content: storyContinuation.textContent
            }
        ];
        
        storyContinueBtn.addEventListener('click', async () => {
            const userContinuation = storyTextarea.value.trim();
            if (!userContinuation) return;
            
            // Update UI to show loading
            storyContinueBtn.disabled = true;
            storyContinueBtn.textContent = "Thinking...";
            
            // Add user contribution to conversation history
            conversationHistories.storyCollaboration.push({
                role: "user",
                content: userContinuation
            });
            
            try {
                // Get AI continuation from LLM
                const completion = await websim.chat.completions.create({
                    messages: conversationHistories.storyCollaboration
                });
                
                // Update UI with new continuation
                gsap.to(storyContinuation, { 
                    opacity: 0, 
                    duration: 0.3,
                    onComplete: () => {
                        storyContinuation.textContent = completion.content;
                        storyTextarea.value = "";
                        gsap.to(storyContinuation, { 
                            opacity: 1, 
                            duration: 0.5 
                        });
                    }
                });
                
                // Add AI response to conversation history
                conversationHistories.storyCollaboration.push(completion);
                
                // Reset button state
                storyContinueBtn.disabled = false;
                storyContinueBtn.textContent = "Continue Story";
            } catch (error) {
                console.error('Error getting story continuation:', error);
                storyContinuation.textContent = "I'm having trouble continuing the story right now. Please try again later.";
                storyContinueBtn.disabled = false;
                storyContinueBtn.textContent = "Continue Story";
            }
        });
    }
}

function populateCalendarVisual() {
    const calendarVisual = document.querySelector('.calendar-visual');
    
    if (calendarVisual) {
        // Create simple calendar grid with events
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const calendarHTML = `
            <div class="calendar-header">
                <div class="month">October 2023</div>
                <div class="days-row">
                    ${days.map(day => `<div class="day-name">${day}</div>`).join('')}
                </div>
            </div>
            <div class="calendar-grid">
                ${Array(35).fill(0).map((_, i) => {
                    const day = i - 1 + 1; // Adjust for month starting position
                    const hasEvent = day === 10 || day === 13; // Tuesday and Friday
                    const eventClass = hasEvent ? 'has-event' : '';
                    const eventText = day === 10 ? 'Doctor 10am' : day === 13 ? 'Meeting 2pm' : '';
                    return day > 0 && day <= 31 ? 
                        `<div class="calendar-day ${eventClass}" data-day="${day}">
                            <div class="day-number">${day}</div>
                            ${eventClass ? `<div class="event-indicator">${eventText}</div>` : ''}
                        </div>` : 
                        `<div class="calendar-day empty"></div>`;
                }).join('')}
            </div>
        `;
        
        calendarVisual.innerHTML = calendarHTML;
        
        // Add styles directly to the calendar
        const style = document.createElement('style');
        style.textContent = `
            .calendar-header {
                display: flex;
                flex-direction: column;
                background: #f0f8ff;
                padding: 5px;
                border-bottom: 1px solid #ddd;
            }
            .month {
                font-weight: bold;
                text-align: center;
                margin-bottom: 5px;
            }
            .days-row {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                text-align: center;
                font-size: 8px;
            }
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                grid-template-rows: repeat(5, 1fr);
                height: calc(100% - 40px);
            }
            .calendar-day {
                position: relative;
                border-right: 1px solid #eee;
                border-bottom: 1px solid #eee;
                padding: 2px;
                font-size: 8px;
            }
            .day-number {
                position: absolute;
                top: 2px;
                left: 2px;
            }
            .has-event {
                background-color: rgba(66, 133, 244, 0.1);
            }
            .event-indicator {
                position: absolute;
                bottom: 2px;
                left: 2px;
                right: 2px;
                background-color: rgba(66, 133, 244, 0.7);
                color: white;
                font-size: 7px;
                padding: 1px 2px;
                border-radius: 2px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .empty {
                background-color: #f9f9f9;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Utility function to debounce input events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}