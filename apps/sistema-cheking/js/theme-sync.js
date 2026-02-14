/**
 * theme-sync.js
 * Synchronizes the design identity with the control panel (nero27-theme).
 */

function applyTheme() {
    const theme = localStorage.getItem('nero27-theme') || 'dark';
    const root = document.documentElement;

    // Clear old theme classes
    const themeClasses = [
        'theme-abstracao', 'theme-geometria', 'theme-cyberpunk', 'theme-darkness',
        'theme-retro', 'theme-renascimento', 'theme-ux-precision', 'theme-noir',
        'theme-antique', 'theme-quantum-sync', 'theme-blueprint', 'theme-terminal'
    ];

    root.classList.remove(...themeClasses);
    document.body.classList.remove('dark', 'light');

    // Light themes mapping
    const lightThemes = ['renascimento', 'ux-precision', 'antique', 'light'];
    const isLight = lightThemes.includes(theme);

    document.body.classList.add(isLight ? 'light' : 'dark');

    if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
        root.classList.add(`theme-${theme}`);
    }
}

// Initial apply
applyTheme();

// Listen for storage changes (when changing theme in the dashboard tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'nero27-theme') {
        applyTheme();
    }
});
