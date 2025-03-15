// Variables for search functionality
let searchTimeout;
const searchDelay = 300; // Delay in milliseconds for search suggestions

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Add event listener for input
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Hide suggestions if input is empty
        if (query === '') {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        // Set a timeout for suggestions (debounce)
        searchTimeout = setTimeout(function() {
            showSearchSuggestions(query);
        }, searchDelay);
    });
    
    // Add event listener for search button
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query !== '') {
            searchTerms(query);
        }
    });
    
    // Add event listener for enter key
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const query = this.value.trim();
            if (query !== '') {
                searchTerms(query);
            }
        }
    });
    
    // Add event listener to hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Function to show search suggestions
function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Filter dictionary terms based on query
    const filteredTerms = dictionaryData.filter(item => {
        return item.term.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 5); // Limit to 5 suggestions
    
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    // If there are suggestions, show them
    if (filteredTerms.length > 0) {
        filteredTerms.forEach(term => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = term.term;
            
            // Add event listener to suggestion item
            suggestionItem.addEventListener('click', function() {
                document.getElementById('search-input').value = term.term;
                suggestionsContainer.style.display = 'none';
                searchTerm(term.term);
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Function to search for terms
function searchTerms(query) {
    const searchResultsElement = document.getElementById('search-results');
    const termDetailsElement = document.getElementById('term-details');
    const welcomeMessageElement = document.querySelector('.welcome-message');
    
    // Hide welcome message and term details
    welcomeMessageElement.style.display = 'none';
    termDetailsElement.innerHTML = '';
    
    // Filter dictionary terms based on query
    const filteredTerms = dictionaryData.filter(item => {
        return item.term.toLowerCase().includes(query.toLowerCase()) || 
               item.definition.toLowerCase().includes(query.toLowerCase());
    });
    
    // Display search results
    if (filteredTerms.length > 0) {
        searchResultsElement.innerHTML = '';
        
        filteredTerms.forEach(term => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.innerHTML = `
                <h3>${term.term}</h3>
                <p>${term.definition.substring(0, 100)}${term.definition.length > 100 ? '...' : ''}</p>
            `;
            
            // Add event listener to show full details when clicking a result
            resultCard.addEventListener('click', function() {
                showTermDetails(term);
            });
            
            searchResultsElement.appendChild(resultCard);
        });
    } else {
        searchResultsElement.innerHTML = `
            <div class="no-results">
                <p>No results found for "${query}".</p>
                <p>Try a different search term or check your spelling.</p>
            </div>
        `;
    }
    
    // Switch to dictionary tab if not already active
    const dictionaryTab = document.querySelector('.tab-btn[data-tab="dictionary"]');
    dictionaryTab.click();
}

// Function to search for a specific term
function searchTerm(termName) {
    const term = dictionaryData.find(item => 
        item.term.toLowerCase() === termName.toLowerCase()
    );
    
    if (term) {
        showTermDetails(term);
        
        // Switch to dictionary tab if not already active
        const dictionaryTab = document.querySelector('.tab-btn[data-tab="dictionary"]');
        dictionaryTab.click();
    } else {
        searchTerms(termName);
    }
}

// Function to show term details
function showTermDetails(term) {
    const termDetailsElement = document.getElementById('term-details');
    const searchResultsElement = document.getElementById('search-results');
    const welcomeMessageElement = document.querySelector('.welcome-message');
    
    // Hide welcome message and search results
    welcomeMessageElement.style.display = 'none';
    searchResultsElement.innerHTML = '';
    
    // Create icon content (emoji representation based on term's name)
    let iconContent = '🍺'; // Default beer emoji
    
    if (term.term.toLowerCase().includes('hop')) iconContent = '🌿';
    else if (term.term.toLowerCase().includes('yeast')) iconContent = '🧫';
    else if (term.term.toLowerCase().includes('malt')) iconContent = '🌾';
    else if (term.term.toLowerCase().includes('stout') || term.term.toLowerCase().includes('porter')) iconContent = '🖤';
    else if (term.term.toLowerCase().includes('ipa') || term.term.toLowerCase().includes('ale')) iconContent = '🍻';
    else if (term.term.toLowerCase().includes('lager') || term.term.toLowerCase().includes('pilsner')) iconContent = '🥤';
    
    // Display term details
    termDetailsElement.innerHTML = `
        <div class="term-header">
            <div class="term-icon">${iconContent}</div>
            <h2>${term.term}</h2>
        </div>
        <div class="term-pronunciation">Pronunciation: ${term.pronunciation}</div>
        <div class="term-definition">${term.definition}</div>
        <div class="related-terms">
            <strong>Related Terms:</strong>
            ${term.related_terms.map(relatedTerm => 
                `<span class="related-term" data-term="${relatedTerm}">${relatedTerm}</span>`
            ).join('')}
        </div>
    `;
    
    // Add event listeners to related terms
    const relatedTerms = termDetailsElement.querySelectorAll('.related-term');
    relatedTerms.forEach(termElement => {
        termElement.addEventListener('click', function() {
            const termName = this.getAttribute('data-term');
            searchTerm(termName);
        });
    });
    
    // Update the URL hash to allow direct linking to terms
    window.location.hash = term.term.toLowerCase().replace(/\s+/g, '-');
    
    // Update search input value
    document.getElementById('search-input').value = term.term;
    
    // Add a "Did you know?" section
    addDidYouKnow();
} 