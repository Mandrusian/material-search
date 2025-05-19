document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const voiceSearchButton = document.getElementById('voiceSearch');
    const searchResults = document.getElementById('searchResults');
    const greetingText = document.getElementById('greeting-text');
    const dateTimeElement = document.getElementById('date-time');
    const engineButtons = document.querySelectorAll('.engine-btn');

    let currentEngine = 'duckduckgo';
    let recognition = null;

    // Function to generate AI summary from search results
    const generateAISummary = (items) => {
        if (!items || items.length === 0) return '';

        // Combine snippets from top results
        const combinedText = items.slice(0, 3).map(item => item.snippet).join(' ');
        
        // Extract key information
        const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const keySentences = sentences.slice(0, 3);
        
        // Create a summary
        return `
            <div class="ai-summary">
                <h3><i class="fas fa-robot"></i> AI Summary</h3>
                <p>${keySentences.join('. ')}.</p>
                <div class="summary-meta">
                    <span>Based on top ${Math.min(items.length, 3)} results</span>
                </div>
            </div>
        `;
    };

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            performSearch();
        };
    }

    // Update greeting based on time of day
    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            greetingText.textContent = 'Good Morning';
        } else if (hour < 18) {
            greetingText.textContent = 'Good Afternoon';
        } else {
            greetingText.textContent = 'Good Evening';
        }
    };

    // Update date and time
    const updateDateTime = () => {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    };

    // Initialize date/time and greeting
    updateGreeting();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Handle search engine selection
    engineButtons.forEach(button => {
        button.addEventListener('click', () => {
            engineButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentEngine = button.dataset.engine;
        });
    });

    // Function to perform search
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;

        let searchUrl;
        switch (currentEngine) {
            case 'google':
                searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                break;
            case 'bing':
                searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                break;
            case 'duckduckgo':
            default:
                searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                break;
        }

        // Open search in new tab
        window.open(searchUrl, '_blank');
    };

    // Search on button click
    searchButton.addEventListener('click', performSearch);

    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Voice search
    voiceSearchButton.addEventListener('click', () => {
        if (recognition) {
            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    });

    // Focus the search input when the page loads
    searchInput.focus();

    // Add keyboard shortcut (Ctrl/Cmd + K) to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}); 