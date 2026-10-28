const flashcardData = [
    // JavaScript
    { id: "js-1", category: "JavaScript", difficulty: "Beginner", question: "What is the difference between let, const, and var?", answer: "var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned.", hint: "Think about scope and mutability." },
    { id: "js-2", category: "JavaScript", difficulty: "Intermediate", question: "Explain closures in JavaScript.", answer: "A closure is a function that remembers its outer variables even after the outer function has returned.", hint: "Inner function accessing outer function's scope." },
    { id: "js-3", category: "JavaScript", difficulty: "Advanced", question: "What is the event loop?", answer: "A mechanism that allows JS to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.", hint: "Call stack, Web APIs, Task Queue." },
    { id: "js-4", category: "JavaScript", difficulty: "Intermediate", question: "What does `===` do compared to `==`?", answer: "`===` is strict equality (checks type and value). `==` is loose equality (performs type coercion).", hint: "Type coercion." },
    { id: "js-5", category: "JavaScript", difficulty: "Advanced", question: "What is the difference between `null` and `undefined`?", answer: "`undefined` means a variable has been declared but not assigned a value. `null` is an assignment value representing no value.", hint: "One is default, one is intentional." },
    
    // CSS
    { id: "css-1", category: "CSS", difficulty: "Beginner", question: "What is the Box Model in CSS?", answer: "Content, Padding, Border, and Margin.", hint: "Think of layers around a box." },
    { id: "css-2", category: "CSS", difficulty: "Intermediate", question: "What is the difference between Flexbox and Grid?", answer: "Flexbox is 1-dimensional (row or column). Grid is 2-dimensional (rows and columns simultaneously).", hint: "1D vs 2D layouts." },
    { id: "css-3", category: "CSS", difficulty: "Advanced", question: "How does `position: sticky` work?", answer: "It acts like relative positioning until a scroll threshold is met, then acts like fixed positioning.", hint: "Hybrid of relative and fixed." },
    { id: "css-4", category: "CSS", difficulty: "Intermediate", question: "What is `z-index` and how does it work?", answer: "It determines the stacking order of positioned elements. Higher values appear on top. It only works on positioned elements.", hint: "Stacking context." },
    { id: "css-5", category: "CSS", difficulty: "Beginner", question: "What are pseudo-classes?", answer: "Keywords added to selectors that specify a special state of the selected element(s), like `:hover` or `:focus`.", hint: "They start with a colon." },

    // HTML
    { id: "html-1", category: "HTML", difficulty: "Beginner", question: "What is the purpose of the `alt` attribute on images?", answer: "It provides alternative text for screen readers and displays text if the image fails to load.", hint: "Accessibility and fallback." },
    { id: "html-2", category: "HTML", difficulty: "Intermediate", question: "What are semantic HTML elements?", answer: "Elements that clearly describe their meaning to both the browser and the developer (e.g., `<header>`, `<article>`, `<footer>`).", hint: "Meaningful tags." },
    { id: "html-3", category: "HTML", difficulty: "Beginner", question: "What is the difference between block-level and inline elements?", answer: "Block elements start on a new line and take full width. Inline elements do not start on a new line and only take necessary width.", hint: "Layout behavior." },
    { id: "html-4", category: "HTML", difficulty: "Intermediate", question: "What does `defer` do in a `<script>` tag?", answer: "It tells the browser to execute the script after the HTML parser has finished.", hint: "Loading order." },
    { id: "html-5", category: "HTML", difficulty: "Advanced", question: "What is the Shadow DOM?", answer: "A web standard that encapsulates styling and markup, keeping it separate from the main document DOM.", hint: "Web components." },

    // General Web
    { id: "gen-1", category: "General", difficulty: "Beginner", question: "What is the difference between localStorage and sessionStorage?", answer: "localStorage persists until explicitly deleted. sessionStorage persists only for the duration of the page session.", hint: "Duration of data." },
    { id: "gen-2", category: "General", difficulty: "Intermediate", question: "What is CORS?", answer: "Cross-Origin Resource Sharing. It is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.", hint: "Cross-domain requests." },
    { id: "gen-3", category: "General", difficulty: "Advanced", question: "What is a JWT?", answer: "JSON Web Token. It is a compact, URL-safe means of representing claims to be transferred between two parties.", hint: "Authentication token." },
    { id: "gen-4", category: "General", difficulty: "Intermediate", question: "Explain the concept of Responsive Web Design.", answer: "An approach where a website's layout and content adapt to different screen sizes and devices, usually using fluid grids, flexible images, and media queries.", hint: "Mobile-first." },
    { id: "gen-5", category: "General", difficulty: "Beginner", question: "What is an API?", answer: "Application Programming Interface. It is a set of rules that allows different software applications to communicate with each other.", hint: "Software bridge." }
];