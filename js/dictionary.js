// Dictionary-specific functionality

// Check URL hash when page loads to directly show a term if specified
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const termName = window.location.hash.substring(1).replace(/-/g, ' ');
        
        // Wait a bit for data to load
        setTimeout(() => {
            if (dictionaryData.length > 0) {
                const term = dictionaryData.find(item => 
                    item.term.toLowerCase() === termName.toLowerCase()
                );
                
                if (term) {
                    searchTerm(term.term);
                }
            }
        }, 500);
    }
});

// Function to generate a fun beer-related tip
function getRandomBeerTip() {
    const tips = [
        "Serve beer in a clean glass to enjoy its full flavor and aroma.",
        "Different beer styles are best enjoyed at different temperatures.",
        "Darker beers aren't necessarily stronger or heavier than lighter beers.",
        "Take small sips and let the beer linger in your mouth to taste all flavors.",
        "The ideal serving temperature for most ales is between 45-55°F (7-13°C).",
        "Lagers are typically best served colder, around 38-45°F (3-7°C).",
        "Strong beers are often better when served in smaller glasses.",
        "A proper beer pour typically includes a 1-1.5 inch head of foam.",
        "Beer and food pairing can enhance both the beer and the meal."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
}

// Add beer flavor wheel functionality (can be expanded later)
function createFlavorWheel() {
    // This function can be implemented later for an interactive flavor wheel visualization
    console.log("Flavor wheel feature to be implemented in future updates.");
}

// Add explanation tooltips for technical terms
document.addEventListener('DOMContentLoaded', function() {
    // Add tooltips to technical terms in definitions
    const addTooltipsToDefinitions = () => {
        const termDefinitions = document.querySelectorAll('.term-definition');
        
        termDefinitions.forEach(definitionElement => {
            // This is a simplified version - a more complex implementation would 
            // identify technical terms in definitions and add tooltips
            console.log("Tooltips feature to be implemented in future updates.");
        });
    };

    // Run this when a term detail is displayed
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addTooltipsToDefinitions();
            }
        });
    });

    const termDetailsElement = document.getElementById('term-details');
    observer.observe(termDetailsElement, { childList: true });
}); 