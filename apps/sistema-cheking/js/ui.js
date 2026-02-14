// dark mode toggle e scroll reveal

// inicializa dark mode
export function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');

    if (!toggle) return;

    const setDarkMode = (isDark) => {
        document.body.classList.toggle('dark', isDark);
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'none' : 'block';
            moonIcon.style.display = isDark ? 'block' : 'none';
        }
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    };

    // checa preferencia salva ou do sistema
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        setDarkMode(true);
    }

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        setDarkMode(!isDark);
    });
}

// scroll reveal (substituto do framer-motion pra vanilla js)
export function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.06}s`;
        observer.observe(el);
    });
}
