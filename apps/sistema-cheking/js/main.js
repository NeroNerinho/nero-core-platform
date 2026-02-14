// entry point — liga tudo quando o DOM carrega

import { setSearchMode, handleSearchInput, handlePISelectChange } from './search.js';
import { handleFormSubmit } from './form.js';
import { initDarkMode, initScrollReveal } from './ui.js';
import { initEasterEggs } from './easter-eggs.js';

document.addEventListener('DOMContentLoaded', () => {

    // referencia dos listeners
    const form = document.getElementById('checkingForm');
    const searchInput = document.getElementById('search-input');
    const btnModePi = document.getElementById('btn-mode-pi');
    const btnModeCnpj = document.getElementById('btn-mode-cnpj');
    const resultsSelect = document.getElementById('pi-results-select');

    // modo inicial
    setSearchMode('pi');

    // busca
    if (searchInput) searchInput.addEventListener('input', handleSearchInput);

    // toggle pi/cnpj
    if (btnModePi) btnModePi.addEventListener('click', () => setSearchMode('pi'));
    if (btnModeCnpj) btnModeCnpj.addEventListener('click', () => setSearchMode('cnpj'));

    // dropdown de resultados cnpj
    if (resultsSelect) resultsSelect.addEventListener('change', handlePISelectChange);

    // submit
    if (form) form.addEventListener('submit', handleFormSubmit);

    // ui
    initDarkMode();
    initScrollReveal();

    // fun stuff
    initEasterEggs();
});
