// Sidebar DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarCloseInner = document.getElementById('sidebarCloseInner');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Sidebar mobile events
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
}
if (sidebarCloseInner) {
    sidebarCloseInner.addEventListener('click', closeSidebar);
}
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Calculate the true static top position of an element by summing its previous siblings' heights
function getTrueScrollTop(element) {
    let offsetTop = 0;
    let sibling = element.previousElementSibling;
    while (sibling) {
        offsetTop += sibling.getBoundingClientRect().height;
        sibling = sibling.previousElementSibling;
    }
    // For mobile view, offset the scroll by the height of the sticky top navbar (64px)
    if (window.innerWidth <= 768) {
        offsetTop = Math.max(0, offsetTop - 64);
    }
    return offsetTop;
}

// Handle smooth navigation scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Bypass browser sticky anchor jump bugs
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const scrollTarget = getTrueScrollTop(targetElement);
            
            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.content-section');
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
        const sectionTop = getTrueScrollTop(section);
        // Offset boundary trigger slightly early for active styling activation
        const threshold = window.innerWidth <= 768 ? sectionTop - 100 : sectionTop - 50;
        if (scrollPosition >= threshold) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Reset viewport settings on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
        sidebarOverlay.classList.remove('active');
        sidebar.classList.remove('open');
    }
});

// Toggle project card flip state when the card body is clicked
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('click', (event) => {
        if (event.target.closest('.project-github-link')) {
            return;
        }
        card.classList.toggle('is-flipped');
    });
});
