// Global variables to store our data
let dictionaryData = [];
let brewFacts = {};

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Fetch dictionary data
    fetch('dictionary.json')
        .then(response => response.json())
        .then(data => {
            dictionaryData = data;
            showFeaturedTerm();
            initializeSearch();
        })
        .catch(error => console.error('Error loading dictionary data:', error));

    // Fetch facts data
    fetch('brewfacts.json')
        .then(response => response.json())
        .then(data => {
            brewFacts = data;
            displayFacts();
            displayEvents();
            displayJokes();
        })
        .catch(error => console.error('Error loading facts data:', error));

    // Initialize the tab functionality
    initializeTabs();

    // Initialize share button
    document.getElementById('share-app').addEventListener('click', shareApp);

    // Add event listener for random term button
    const randomTermBtn = document.getElementById('random-term-btn');
    if (randomTermBtn) {
        randomTermBtn.addEventListener('click', showRandomTerm);
    }
});

// Function to initialize tab switching
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// Function to display a random featured term on the home page
function showFeaturedTerm() {
    if (dictionaryData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * dictionaryData.length);
    const featuredTerm = dictionaryData[randomIndex];
    const featuredTermElement = document.getElementById('featured-term');
    
    featuredTermElement.innerHTML = `
        <h3>Featured Term: ${featuredTerm.term}</h3>
        <p>${featuredTerm.definition}</p>
        <div class="related-terms">
            ${featuredTerm.related_terms.map(term => 
                `<span class="related-term" data-term="${term}">${term}</span>`
            ).join('')}
        </div>
    `;
    
    // Add event listeners to related terms
    const relatedTerms = featuredTermElement.querySelectorAll('.related-term');
    relatedTerms.forEach(term => {
        term.addEventListener('click', function() {
            const termName = this.getAttribute('data-term');
            searchTerm(termName);
        });
    });

    // Make the entire featured term clickable
    featuredTermElement.addEventListener('click', function() {
        showTermDetails(featuredTerm);
    });
}

// Function to display beer facts
function displayFacts() {
    if (!brewFacts.facts || brewFacts.facts.length === 0) return;
    
    const factsContainer = document.getElementById('facts-container');
    factsContainer.innerHTML = '';
    
    // Show 3 random facts initially
    const factIndices = [];
    const numberOfFacts = Math.min(3, brewFacts.facts.length);
    
    // Get unique random indices
    while (factIndices.length < numberOfFacts) {
        const randomIndex = Math.floor(Math.random() * brewFacts.facts.length);
        if (!factIndices.includes(randomIndex)) {
            factIndices.push(randomIndex);
        }
    }
    
    // Create fact cards with staggered animation
    factIndices.forEach((index, i) => {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card animated';
        factCard.style.animationDelay = `${i * 0.15}s`;
        
        factCard.innerHTML = `
            <i class="fas fa-beer fact-icon"></i>
            <p>${brewFacts.facts[index]}</p>
        `;
        
        factsContainer.appendChild(factCard);
    });
    
    // Add event listener to random fact button
    document.getElementById('random-fact-btn').addEventListener('click', showRandomFact);
}

// Function to display a random fact
function showRandomFact() {
    if (!brewFacts.facts || brewFacts.facts.length === 0) return;
    
    const factsContainer = document.getElementById('facts-container');
    factsContainer.innerHTML = '';
    
    const randomIndex = Math.floor(Math.random() * brewFacts.facts.length);
    const factCard = document.createElement('div');
    factCard.className = 'fact-card animated';
    factCard.innerHTML = `
        <i class="fas fa-beer fact-icon"></i>
        <p>${brewFacts.facts[randomIndex]}</p>
    `;
    factsContainer.appendChild(factCard);
}

// Function to display beer history events
function displayEvents() {
    if (!brewFacts.events || brewFacts.events.length === 0) return;
    
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';
    
    // Sort events chronologically (assuming the year is at the beginning)
    const sortedEvents = [...brewFacts.events].sort((a, b) => {
        const yearA = parseInt(a.match(/\d{3,4}/)[0]);
        const yearB = parseInt(b.match(/\d{3,4}/)[0]);
        return yearA - yearB;
    });
    
    // Add a timeline wrapper
    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-wrapper';
    eventsContainer.appendChild(timelineWrapper);
    
    sortedEvents.forEach((event, index) => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card animated';
        
        // Add delay based on index for staggered animation
        eventCard.style.animationDelay = `${index * 0.1}s`;
        
        // Extract the year
        const yearMatch = event.match(/\d{3,4}/);
        const year = yearMatch ? yearMatch[0] : '';
        
        // Remove the year from the text
        const text = event.replace(`In ${year}, `, '');
        
        eventCard.innerHTML = `
            <div class="event-year">${year}</div>
            <div class="event-text">${text}</div>
        `;
        
        timelineWrapper.appendChild(eventCard);
    });
}

// Function to display beer jokes
function displayJokes() {
    if (!brewFacts.jokes || brewFacts.jokes.length === 0) return;
    
    const jokesContainer = document.getElementById('jokes-container');
    jokesContainer.innerHTML = '';
    
    // Display first joke with animation
    const jokeCard = document.createElement('div');
    jokeCard.className = 'joke-card animated';
    
    // Add a slight random rotation for a fun effect
    const rotation = Math.random() * 2 - 1; // Between -1 and 1 degrees
    jokeCard.style.transform = `rotate(${rotation}deg)`;
    
    jokeCard.innerHTML = `
        <p>${brewFacts.jokes[0]}</p>
    `;
    
    jokesContainer.appendChild(jokeCard);
    
    // Add event listener to joke button
    document.getElementById('random-joke-btn').addEventListener('click', showRandomJoke);
}

// Function to display a random joke
function showRandomJoke() {
    if (!brewFacts.jokes || brewFacts.jokes.length === 0) return;
    
    const jokesContainer = document.getElementById('jokes-container');
    jokesContainer.innerHTML = '';
    
    const randomIndex = Math.floor(Math.random() * brewFacts.jokes.length);
    const jokeCard = document.createElement('div');
    jokeCard.className = 'joke-card animated';
    jokeCard.textContent = brewFacts.jokes[randomIndex];
    
    // Add a slight random rotation for a fun effect
    const rotation = Math.random() * 2 - 1; // Between -1 and 1 degrees
    jokeCard.style.transform = `rotate(${rotation}deg)`;
    
    jokesContainer.appendChild(jokeCard);
}

// Function to share the app (Web Share API if available, fallback to clipboard)
function shareApp() {
    const shareData = {
        title: 'Brewtionary',
        text: 'Unlock the language of beer with Brewtionary - the ultimate beer terminology guide!',
        url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
        navigator.share(shareData)
            .catch(err => {
                console.log('Error sharing:', err);
                copyToClipboard(window.location.href);
            });
    } else {
        copyToClipboard(window.location.href);
    }
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Link copied to clipboard! Share it with your friends.');
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            // Fallback
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = text;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Link copied to clipboard! Share it with your friends.');
        });
}

// Function to show toast notifications
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('toast-notification');
    const toastMessage = toastElement.querySelector('.toast-message');
    const toastIcon = toastElement.querySelector('.toast-icon');
    const toastCloseBtn = toastElement.querySelector('.toast-close');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    toastIcon.className = 'toast-icon';
    toastElement.className = 'toast-notification';
    
    switch(type) {
        case 'success':
            toastIcon.classList.add('fas', 'fa-check-circle');
            toastElement.classList.add('success');
            break;
        case 'error':
            toastIcon.classList.add('fas', 'fa-exclamation-circle');
            toastElement.classList.add('error');
            break;
        case 'info':
            toastIcon.classList.add('fas', 'fa-info-circle');
            toastElement.classList.add('info');
            break;
        default:
            toastIcon.classList.add('fas', 'fa-check-circle');
    }
    
    // Show toast
    toastElement.classList.add('show');
    
    // Add close button functionality
    toastCloseBtn.onclick = function() {
        toastElement.classList.remove('show');
    };
    
    // Automatically hide toast after 3 seconds
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
}

// Close toast on button click
document.querySelector('.toast-close').addEventListener('click', () => {
    document.getElementById('toast-notification').classList.remove('visible');
});

// Add pulse animation to the random buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.classList.add('pulse');
    
    // Remove pulse on hover to avoid conflict with hover animation
    btn.addEventListener('mouseenter', () => {
        btn.classList.remove('pulse');
    });
    
    // Add pulse back when mouse leaves
    btn.addEventListener('mouseleave', () => {
        setTimeout(() => {
            btn.classList.add('pulse');
        }, 300);
    });
});

// Smooth tab transitions
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get tab ID
        const tabId = button.dataset.tab;
        
        // Add exit animation to current active tab
        const activeTab = document.querySelector('.tab-content.active');
        activeTab.style.opacity = '0';
        activeTab.style.transform = 'translateY(20px)';
        
        // Change active tab after animation
        setTimeout(() => {
            // Remove active class from all tabs and buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            });
            
            // Add active class to selected tab and button
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Add entrance animation to new active tab
            setTimeout(() => {
                document.getElementById(tabId).style.opacity = '1';
                document.getElementById(tabId).style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    });
});

// Share functionality
document.getElementById('share-app').addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Brewtionary - Unlock the Language of Beer',
                text: 'Check out this awesome beer dictionary app!',
                url: window.location.href
            });
            showToast('Thanks for sharing!', 'success');
        } catch (error) {
            console.error('Error sharing:', error);
            // User probably canceled
        }
    } else {
        // Fallback for browsers that don't support Web Share API
        const dummyInput = document.createElement('input');
        dummyInput.value = window.location.href;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        document.execCommand('copy');
        document.body.removeChild(dummyInput);
        showToast('Link copied to clipboard!', 'success');
    }
});

// Add animation classes to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.result-card, .fact-card, .event-card, .joke-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            if (!element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        }
    });
};

// Run animation check on scroll
window.addEventListener('scroll', animateOnScroll);

// Mobile improvements for search
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Make search input expand on small screens when focused
if (window.innerWidth <= 480) {
    searchInput.addEventListener('focus', () => {
        searchInput.style.width = '80%';
        searchBtn.style.width = '20%';
    });
    
    searchInput.addEventListener('blur', () => {
        if (searchInput.value === '') {
            searchInput.style.width = '70%';
            searchBtn.style.width = '30%';
        }
    });
}

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Brewtionary! 🍺', 'info');
    }, 1000);
    
    // Run initial animations
    animateOnScroll();
    
    // Set opacity for tabs (needed for transitions)
    document.querySelector('.tab-content.active').style.opacity = '1';
    document.querySelector('.tab-content.active').style.transform = 'translateY(0)';
});

// Function to show a random term
function showRandomTerm() {
    if (dictionaryData.length === 0) {
        console.error('Dictionary data not loaded');
        showToast('Failed to load random term', 'error');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * dictionaryData.length);
    const randomTerm = dictionaryData[randomIndex];
    
    // Use the existing searchTerm function to display the term details
    searchTerm(randomTerm.term);
} 