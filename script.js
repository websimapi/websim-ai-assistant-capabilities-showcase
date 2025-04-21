import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    setupCardInteractions();
    setupDemoInteractions();
    populateCalendarVisual();
});

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
    setupSpeechDemo();
    setupQuizDemo();
    setupTranslationDemo();
    setupArtDemo();
    setupStoryDemo();
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
                    e.target.parentElement.style.color = var(--secondary-color, 'green');
                } else {
                    e.target.parentElement.style.fontWeight = 'bold';
                    e.target.parentElement.style.color = var(--accent-color, 'red');
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

function setupArtDemo() {
    const artPromptInput = document.querySelector('.art-prompt input');
    const artPlaceholder = document.querySelector('.art-placeholder');
    
    if (artPromptInput && artPlaceholder) {
        artPromptInput.addEventListener('input', debounce(() => {
            // Simulate art generation
            gsap.to(artPlaceholder, { 
                opacity: 0, 
                duration: 0.3,
                onComplete: () => {
                    // Change the placeholder color based on the prompt
                    const prompt = artPromptInput.value.toLowerCase();
                    let gradientColors = ['#e0e0e0', '#b0b0b0'];
                    
                    if (prompt.includes('city') || prompt.includes('urban')) {
                        gradientColors = ['#3f87a6', '#ebf8e1'];
                    } else if (prompt.includes('nature') || prompt.includes('forest')) {
                        gradientColors = ['#588157', '#a3b18a'];
                    } else if (prompt.includes('sunset') || prompt.includes('sky')) {
                        gradientColors = ['#f94144', '#f9c74f'];
                    } else if (prompt.includes('ocean') || prompt.includes('sea')) {
                        gradientColors = ['#023e8a', '#90e0ef'];
                    }
                    
                    // Update the SVG with a new gradient background
                    artPlaceholder.innerHTML = `
                        <svg viewBox="0 0 200 150" width="200" height="150">
                            <defs>
                                <linearGradient id="artGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:${gradientColors[0]};stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:${gradientColors[1]};stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <rect width="200" height="150" fill="url(#artGradient)"/>
                            <text x="100" y="75" text-anchor="middle" fill="#ffffff">AI-Generated Art</text>
                        </svg>
                    `;
                    
                    gsap.to(artPlaceholder, { opacity: 1, duration: 0.3 });
                }
            });
        }, 500));
    }
}

function setupStoryDemo() {
    const storyTextarea = document.querySelector('.story-starter textarea');
    const storyPrompt = document.querySelector('.story-prompt');
    const storyContinuation = document.querySelector('.story-continuation');
    
    if (storyTextarea && storyPrompt && storyContinuation) {
        storyTextarea.addEventListener('input', debounce(() => {
            const userContinuation = storyTextarea.value.trim();
            
            if (userContinuation.length > 0) {
                // Simulate AI continuing the story based on user input
                setTimeout(() => {
                    const aiResponse = "One day, Ada discovered an unusual pattern in the data—a rhythmic pulse that seemed almost... alive. It was unlike anything she had encountered before. Could this be the purpose she was seeking? She followed the digital breadcrumbs deeper into the forest, unaware that this journey would forever change not just her existence, but the very nature of consciousness itself.";
                    
                    // Animate the new continuation
                    gsap.to(storyContinuation, { 
                        opacity: 0, 
                        duration: 0.3,
                        onComplete: () => {
                            storyContinuation.textContent = aiResponse;
                            gsap.to(storyContinuation, { 
                                opacity: 1, 
                                duration: 0.5 
                            });
                        }
                    });
                }, 1500);
            }
        }, 1000));
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

