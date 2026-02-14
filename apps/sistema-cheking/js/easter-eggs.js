// easter eggs — cliques multiplos e modal de video

let guideClickCount = 0;
let guideClickTimer = null;
let submitClickCount = 0;
let submitClickTimer = null;

export function initEasterEggs() {
    const modal = document.getElementById('easterEggModal');
    const closeBtn = document.getElementById('closeModal');
    const playerContainer = document.getElementById('player');

    if (!modal || !closeBtn || !playerContainer) return;

    // guia de regras — 5 cliques rapidos abre o psy
    const guide = document.querySelector('.rules-guide summary');
    if (guide) {
        guide.addEventListener('click', () => {
            guideClickCount++;
            clearTimeout(guideClickTimer);
            guideClickTimer = setTimeout(() => { guideClickCount = 0; }, 1500);
            if (guideClickCount >= 5) {
                guideClickCount = 0;
                openModal('dQw4w9WgXcQ');
            }
        });
    }

    // botao submit — 7 cliques rapidos
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            submitClickCount++;
            clearTimeout(submitClickTimer);
            submitClickTimer = setTimeout(() => { submitClickCount = 0; }, 2000);
            if (submitClickCount >= 7) {
                e.preventDefault();
                submitClickCount = 0;
                openModal('9bZkp7q19f0');
            }
        });
    }

    // fechar modal
    closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    function openModal(videoId) {
        playerContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: #fff; margin-bottom: 1rem;">Você encontrou o segredo! 🕵️</h3>
                <p style="color: #ccc; margin-bottom: 2rem;">Mas seu navegador protegeu você da surpresa... Clique abaixo para ver:</p>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn-primary" style="background: #fff; color: #000; text-decoration: none; padding: 1rem 2rem; border-radius: 99px; font-weight: bold; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    Assistir Vídeo
                </a>
            </div>
        `;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => { playerContainer.innerHTML = ''; }, 300);
    }
}
