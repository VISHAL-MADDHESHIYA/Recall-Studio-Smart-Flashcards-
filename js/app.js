/**
 * Recall Studio - Flashcard App Logic
 * Architecture: State-driven Vanilla JS with local persistence.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- State ---
    let state = {
        deck: [...flashcardData],
        currentDeck: [...flashcardData],
        currentIndex: 0,
        isFlipped: false,
        bookmarks: JSON.parse(localStorage.getItem('recall_bookmarks')) || [],
        stats: JSON.parse(localStorage.getItem('recall_stats')) || { reviewed: 0, gotIt: 0, review: 0 },
        theme: localStorage.getItem('recall_theme') || 'light',
        filters: { search: '', category: 'all', difficulty: 'all' }
    };

    // --- DOM Elements ---
    const dom = {
        body: document.documentElement,
        themeToggle: document.getElementById('theme-toggle'),
        searchInput: document.getElementById('search-input'),
        categoryFilter: document.getElementById('category-filter'),
        difficultyFilter: document.getElementById('difficulty-filter'),
        resetFilters: document.getElementById('reset-filters'),
        
        // Stats
        statReviewed: document.getElementById('stat-reviewed'),
        statGotIt: document.getElementById('stat-got-it'),
        statReview: document.getElementById('stat-review'),
        
        // Card
        container: document.getElementById('flashcard-container'),
        flashcard: document.getElementById('flashcard'),
        counter: document.getElementById('card-counter'),
        progressPct: document.getElementById('progress-percentage'),
        progressBar: document.getElementById('progress-bar'),
        emptyState: document.getElementById('empty-state'),
        
        // Card Front
        cardCategory: document.getElementById('card-category'),
        cardDifficulty: document.getElementById('card-difficulty'),
        cardQuestion: document.getElementById('card-question'),
        bookmarkBtn: document.getElementById('bookmark-btn'),
        hintBtn: document.getElementById('hint-btn'),
        hintText: document.getElementById('hint-text'),
        
        // Card Back
        cardCategoryBack: document.getElementById('card-category-back'),
        cardAnswer: document.getElementById('card-answer'),
        btnReview: document.getElementById('btn-review'),
        btnGotIt: document.getElementById('btn-got-it'),
        
        // Controls
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnFlip: document.getElementById('btn-flip'),
        btnShuffle: document.getElementById('btn-shuffle'),
        btnResetDeck: document.getElementById('btn-reset-deck'),
        
        // Modals
        summaryModal: document.getElementById('summary-modal'),
        resetModal: document.getElementById('reset-modal'),
        btnConfirmReset: document.getElementById('btn-confirm-reset'),
        btnRestartSession: document.getElementById('btn-restart-session')
    };

    // --- Initialization ---
    function init() {
        applyTheme(state.theme);
        populateCategories();
        applyFilters();
        updateStatsUI();
        lucide.createIcons();
    }

    // --- Theme Management ---
    function applyTheme(theme) {
        dom.body.setAttribute('data-theme', theme);
        state.theme = theme;
        localStorage.setItem('recall_theme', theme);
    }

    dom.themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'light' ? 'dark' : 'light');
    });

    // --- Filtering Logic ---
    function populateCategories() {
        const categories = [...new Set(flashcardData.map(card => card.category))];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            dom.categoryFilter.appendChild(option);
        });
    }

    function applyFilters() {
        state.filters.search = dom.searchInput.value.toLowerCase();
        state.filters.category = dom.categoryFilter.value;
        state.filters.difficulty = dom.difficultyFilter.value;

        state.currentDeck = state.deck.filter(card => {
            const matchesSearch = card.question.toLowerCase().includes(state.filters.search) || 
                                  card.answer.toLowerCase().includes(state.filters.search);
            const matchesCategory = state.filters.category === 'all' || card.category === state.filters.category;
            const matchesDifficulty = state.filters.difficulty === 'all' || card.difficulty === state.filters.difficulty;
            
            return matchesSearch && matchesCategory && matchesDifficulty;
        });

        state.currentIndex = 0;
        state.isFlipped = false;
        renderCard();
    }

    [dom.searchInput, dom.categoryFilter, dom.difficultyFilter].forEach(el => {
        el.addEventListener('input', applyFilters);
    });

    dom.resetFilters.addEventListener('click', () => {
        dom.searchInput.value = '';
        dom.categoryFilter.value = 'all';
        dom.difficultyFilter.value = 'all';
        applyFilters();
    });

    // --- Card Rendering ---
    function renderCard() {
        if (state.currentDeck.length === 0) {
            dom.container.classList.add('hidden');
            dom.emptyState.classList.remove('hidden');
            updateProgressUI();
            return;
        }

        dom.container.classList.remove('hidden');
        dom.emptyState.classList.add('hidden');

        const card = state.currentDeck[state.currentIndex];
        
        // Reset flip state
        dom.flashcard.classList.remove('flipped');
        state.isFlipped = false;
        
        // Front
        dom.cardCategory.textContent = card.category;
        dom.cardDifficulty.textContent = card.difficulty;
        dom.cardQuestion.textContent = card.question;
        
        // Back
        dom.cardCategoryBack.textContent = card.category;
        dom.cardAnswer.textContent = card.answer;
        
        // Hint
        dom.hintText.classList.add('hidden');
        dom.hintText.textContent = card.hint || "No hint available.";

        // Bookmark
        updateBookmarkUI();

        // Nav state
        dom.btnPrev.disabled = state.currentIndex === 0;
        dom.btnNext.disabled = state.currentIndex === state.currentDeck.length - 1;

        updateProgressUI();
        lucide.createIcons();
    }

    // --- Flip Logic ---
    function toggleFlip() {
        if (state.currentDeck.length === 0) return;
        state.isFlipped = !state.isFlipped;
        dom.flashcard.classList.toggle('flipped', state.isFlipped);
        
        // Announce to screen readers
        const status = state.isFlipped ? "Answer revealed" : "Question showing";
        announceToSR(status);
    }

    dom.btnFlip.addEventListener('click', toggleFlip);
    dom.container.addEventListener('click', (e) => {
        // Prevent flipping if clicking buttons inside the card
        if (e.target.closest('button')) return;
        toggleFlip();
    });

    // --- Navigation ---
    function nextCard() {
        if (state.currentIndex < state.currentDeck.length - 1) {
            state.currentIndex++;
            renderCard();
        } else if (state.stats.reviewed > 0) {
            showSummary();
        }
    }

    function prevCard() {
        if (state.currentIndex > 0) {
            state.currentIndex--;
            renderCard();
        }
    }

    dom.btnNext.addEventListener('click', nextCard);
    dom.btnPrev.addEventListener('click', prevCard);

    // --- Bookmarks ---
    function toggleBookmark() {
        const cardId = state.currentDeck[state.currentIndex].id;
        const index = state.bookmarks.indexOf(cardId);
        
        if (index === -1) {
            state.bookmarks.push(cardId);
        } else {
            state.bookmarks.splice(index, 1);
        }
        
        localStorage.setItem('recall_bookmarks', JSON.stringify(state.bookmarks));
        updateBookmarkUI();
    }

    function updateBookmarkUI() {
        if (state.currentDeck.length === 0) return;
        const cardId = state.currentDeck[state.currentIndex].id;
        const isBookmarked = state.bookmarks.includes(cardId);
        
        dom.bookmarkBtn.classList.toggle('active', isBookmarked);
        dom.bookmarkBtn.innerHTML = `<i data-lucide="bookmark" ${isBookmarked ? 'fill="currentColor"' : ''}></i>`;
        lucide.createIcons();
    }

    dom.bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark();
    });

    // --- Hint ---
    dom.hintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.hintText.classList.toggle('hidden');
    });

    // --- Study Mode (Got it / Review) ---
    function handleStudyAction(action) {
        if (!state.isFlipped) return; // Must flip first
        
        state.stats.reviewed++;
        if (action === 'gotIt') state.stats.gotIt++;
        if (action === 'review') state.stats.review++;
        
        saveStats();
        updateStatsUI();
        
        if (state.currentIndex < state.currentDeck.length - 1) {
            nextCard();
        } else {
            showSummary();
        }
    }

    dom.btnGotIt.addEventListener('click', (e) => { e.stopPropagation(); handleStudyAction('gotIt'); });
    dom.btnReview.addEventListener('click', (e) => { e.stopPropagation(); handleStudyAction('review'); });

    function saveStats() {
        localStorage.setItem('recall_stats', JSON.stringify(state.stats));
    }

    function updateStatsUI() {
        dom.statReviewed.textContent = state.stats.reviewed;
        dom.statGotIt.textContent = state.stats.gotIt;
        dom.statReview.textContent = state.stats.review;
    }

    // --- Progress UI ---
    function updateProgressUI() {
        const total = state.currentDeck.length;
        if (total === 0) {
            dom.counter.textContent = "0 of 0";
            dom.progressPct.textContent = "0%";
            dom.progressBar.style.width = "0%";
            dom.progressBar.parentElement.setAttribute('aria-valuenow', 0);
            return;
        }

        const current = state.currentIndex + 1;
        const pct = Math.round((current / total) * 100);
        
        dom.counter.textContent = `Card ${current} of ${total}`;
        dom.progressPct.textContent = `${pct}%`;
        dom.progressBar.style.width = `${pct}%`;
        dom.progressBar.parentElement.setAttribute('aria-valuenow', pct);
    }

    // --- Deck Controls ---
    dom.btnShuffle.addEventListener('click', () => {
        // Fisher-Yates Shuffle
        for (let i = state.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [state.currentDeck[i], state.currentDeck[j]] = [state.currentDeck[j], state.currentDeck[i]];
        }
        state.currentIndex = 0;
        state.isFlipped = false;
        renderCard();
    });

    dom.btnResetDeck.addEventListener('click', () => {
        dom.resetModal.classList.remove('hidden');
    });

    // --- Modals ---
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            dom.summaryModal.classList.add('hidden');
            dom.resetModal.classList.add('hidden');
        });
    });

    function showSummary() {
        document.getElementById('summary-total').textContent = state.stats.reviewed;
        document.getElementById('summary-got-it').textContent = state.stats.gotIt;
        document.getElementById('summary-review').textContent = state.stats.review;
        dom.summaryModal.classList.remove('hidden');
    }

    dom.btnRestartSession.addEventListener('click', () => {
        dom.summaryModal.classList.add('hidden');
        state.stats = { reviewed: 0, gotIt: 0, review: 0 };
        saveStats();
        updateStatsUI();
        state.currentIndex = 0;
        state.isFlipped = false;
        renderCard();
    });

    dom.btnConfirmReset.addEventListener('click', () => {
        // Clear localStorage
        localStorage.removeItem('recall_bookmarks');
        localStorage.removeItem('recall_stats');
        
        // Reset State
        state.bookmarks = [];
        state.stats = { reviewed: 0, gotIt: 0, review: 0 };
        state.deck = [...flashcardData];
        state.currentIndex = 0;
        state.isFlipped = false;
        
        // Reset UI
        dom.searchInput.value = '';
        dom.categoryFilter.value = 'all';
        dom.difficultyFilter.value = 'all';
        
        updateStatsUI();
        applyFilters();
        dom.resetModal.classList.add('hidden');
    });

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                nextCard();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevCard();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                toggleFlip();
                break;
            case 'Escape':
                dom.summaryModal.classList.add('hidden');
                dom.resetModal.classList.add('hidden');
                break;
        }
    });

    // --- Accessibility Helper ---
    function announceToSR(message) {
        const el = document.createElement('div');
        el.setAttribute('aria-live', 'polite');
        el.setAttribute('class', 'sr-only');
        el.style.position = 'absolute';
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.padding = '0';
        el.style.margin = '-1px';
        el.style.overflow = 'hidden';
        el.style.clip = 'rect(0, 0, 0, 0)';
        el.style.whiteSpace = 'nowrap';
        el.style.border = '0';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    // --- Start App ---
    init();
});