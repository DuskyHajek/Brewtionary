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
    
    // Display first 5 facts
    brewFacts.facts.slice(0, 5).forEach(fact => {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card';
        factCard.textContent = fact;
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
    factCard.className = 'fact-card';
    factCard.textContent = brewFacts.facts[randomIndex];
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
    
    sortedEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        // Extract the year
        const yearMatch = event.match(/\d{3,4}/);
        const year = yearMatch ? yearMatch[0] : '';
        
        // Remove the year from the text
        const text = event.replace(`In ${year}, `, '');
        
        eventCard.innerHTML = `
            <div class="event-year">${year}</div>
            <div class="event-text">${text}</div>
        `;
        
        eventsContainer.appendChild(eventCard);
    });
}

// Function to display beer jokes
function displayJokes() {
    if (!brewFacts.jokes || brewFacts.jokes.length === 0) return;
    
    const jokesContainer = document.getElementById('jokes-container');
    jokesContainer.innerHTML = '';
    
    // Display first joke
    const jokeCard = document.createElement('div');
    jokeCard.className = 'joke-card';
    jokeCard.textContent = brewFacts.jokes[0];
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
    jokeCard.className = 'joke-card';
    jokeCard.textContent = brewFacts.jokes[randomIndex];
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