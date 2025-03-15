// Facts-specific functionality

// Add transitions to fact cards
document.addEventListener('DOMContentLoaded', function() {
    // Function to add animation to new fact cards
    function animateFactCards() {
        const factCards = document.querySelectorAll('.fact-card, .event-card, .joke-card');
        
        factCards.forEach((card, index) => {
            // Add a slight delay based on index for staggered animation
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Force reflow
                void card.offsetWidth;
                
                // Add transition
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Call this function when tabs change
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(animateFactCards, 100);
        });
    });
    
    // Call this function when random fact/joke buttons are clicked
    const randomFactBtn = document.getElementById('random-fact-btn');
    const randomJokeBtn = document.getElementById('random-joke-btn');
    
    if (randomFactBtn) {
        randomFactBtn.addEventListener('click', function() {
            setTimeout(animateFactCards, 100);
        });
    }
    
    if (randomJokeBtn) {
        randomJokeBtn.addEventListener('click', function() {
            setTimeout(animateFactCards, 100);
        });
    }
});

// Function to handle "Did you know?" feature
function addDidYouKnow() {
    const dictionaryTab = document.getElementById('dictionary');
    
    // Create the "Did you know?" element if it doesn't exist
    if (!document.getElementById('did-you-know')) {
        const didYouKnowElement = document.createElement('div');
        didYouKnowElement.id = 'did-you-know';
        didYouKnowElement.className = 'did-you-know';
        
        // Only create this if we have the data
        if (brewFacts && brewFacts.facts && brewFacts.facts.length > 0) {
            const randomFact = brewFacts.facts[Math.floor(Math.random() * brewFacts.facts.length)];
            
            didYouKnowElement.innerHTML = `
                <h3>Did you know?</h3>
                <p>${randomFact}</p>
            `;
            
            // Add it to the dictionary tab after the term details
            const termDetailsElement = document.getElementById('term-details');
            if (termDetailsElement.innerHTML !== '') {
                termDetailsElement.appendChild(didYouKnowElement);
            }
        }
    }
}

// Function to enhance the display of facts
function enhanceFactDisplay() {
    const facts = document.querySelectorAll('.fact-card');
    
    facts.forEach(fact => {
        // Add icon to facts
        if (!fact.querySelector('.fact-icon')) {
            const factText = fact.textContent;
            fact.innerHTML = `
                <i class="fas fa-beer fact-icon"></i>
                <p>${factText}</p>
            `;
        }
    });
}

// Function to enhance the display of jokes
function enhanceJokeDisplay() {
    const jokes = document.querySelectorAll('.joke-card');
    
    jokes.forEach(joke => {
        // Make sure each joke has its unique style
        joke.style.transform = `rotate(${Math.random() * 2 - 1}deg)`;
    });
}

// Add event listeners for tab changes to enhance content
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            if (tabId === 'facts') {
                setTimeout(enhanceFactDisplay, 200);
            } else if (tabId === 'jokes') {
                setTimeout(enhanceJokeDisplay, 200);
            }
        });
    });
    
    // Also call on initial load if facts tab is active
    if (document.querySelector('.tab-btn[data-tab="facts"]').classList.contains('active')) {
        setTimeout(enhanceFactDisplay, 200);
    }
    
    // Also call on initial load if jokes tab is active
    if (document.querySelector('.tab-btn[data-tab="jokes"]').classList.contains('active')) {
        setTimeout(enhanceJokeDisplay, 200);
    }
    
    // Call enhance functions when random buttons are clicked
    const randomFactBtn = document.getElementById('random-fact-btn');
    const randomJokeBtn = document.getElementById('random-joke-btn');
    
    if (randomFactBtn) {
        randomFactBtn.addEventListener('click', function() {
            setTimeout(enhanceFactDisplay, 200);
        });
    }
    
    if (randomJokeBtn) {
        randomJokeBtn.addEventListener('click', function() {
            setTimeout(enhanceJokeDisplay, 200);
        });
    }
}); 