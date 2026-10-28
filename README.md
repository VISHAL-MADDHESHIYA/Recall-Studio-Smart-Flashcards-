# Recall Studio — Smart Flashcards & Learning Dashboard

A premium, fully accessible, and responsive Flashcard web application built with Vanilla HTML, CSS, and JavaScript.

## Features
- **20+ High-Quality Flashcards**: Covering JavaScript, CSS, HTML, and General Web concepts.
- **3D Flip Animation**: Smooth CSS `transform` and `perspective` animations.
- **Smart Navigation**: Next/Prev buttons, keyboard shortcuts (Arrows, Space, Enter), and touch support.
- **Study Mode**: "Got it" and "Need to Review" buttons to track your learning progress.
- **Advanced Filtering**: Search by keyword, category, or difficulty level.
- **Session Summary**: Automatically tracks and displays your stats when a deck is completed.
- **Bookmarking**: Save cards for later review.
- **Light/Dark Theme**: Toggle between themes, persisted via `localStorage`.
- **Accessibility First**: ARIA live regions, semantic HTML, focus indicators, and `prefers-reduced-motion` support.
- **Local Persistence**: Progress, bookmarks, and themes are saved automatically.

## Architecture & Folder Structure
```text
.
├── index.html          # Semantic HTML structure
├── css/
│   └── styles.css      # CSS Variables, 3D transforms, responsive layout
├── js/
│   ├── data.js         # Flashcard dataset
│   └── app.js          # State management, DOM manipulation, logic
└── README.md