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

// Add event listener for sharing facts
document.addEventListener('DOMContentLoaded', function() {
    // Add social share buttons to each fact
    function addShareToFactCards() {
        const factCards = document.querySelectorAll('.fact-card');
        
        factCards.forEach(card => {
            // Only add share button if it doesn't already have one
            if (!card.querySelector('.fact-share')) {
                const shareButton = document.createElement('button');
                shareButton.className = 'fact-share';
                shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                
                shareButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const factText = card.textContent.replace('Share', '').trim();
                    shareFactOrJoke(factText);
                });
                
                card.appendChild(shareButton);
            }
        });
        
        // Do the same for joke cards
        const jokeCards = document.querySelectorAll('.joke-card');
        
        jokeCards.forEach(card => {
            if (!card.querySelector('.fact-share')) {
                const shareButton = document.createElement('button');
                shareButton.className = 'fact-share';
                shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                
                shareButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const jokeText = card.textContent.replace('Share', '').trim();
                    shareFactOrJoke(jokeText);
                });
                
                card.appendChild(shareButton);
            }
        });
    }
    
    // Call this function when tabs change
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(addShareToFactCards, 200);
        });
    });
    
    // Call this function when random fact/joke buttons are clicked
    const randomFactBtn = document.getElementById('random-fact-btn');
    const randomJokeBtn = document.getElementById('random-joke-btn');
    
    if (randomFactBtn) {
        randomFactBtn.addEventListener('click', function() {
            setTimeout(addShareToFactCards, 200);
        });
    }
    
    if (randomJokeBtn) {
        randomJokeBtn.addEventListener('click', function() {
            setTimeout(addShareToFactCards, 200);
        });
    }
});

// Function to share a fact or joke
function shareFactOrJoke(text) {
    const shareData = {
        title: 'Brewtionary',
        text: text + ' | via Brewtionary',
        url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .catch(err => {
                console.log('Error sharing:', err);
                copyToClipboard(text + ' | via Brewtionary');
            });
    } else {
        copyToClipboard(text + ' | via Brewtionary');
    }
} 