// busca de PI e CNPJ — debounce, mascaras, renderizacao de resultados

import {
    API_ENDPOINT, MEDIA_TYPE_CONFIG,
    getSearchMode, setSearchModeValue,
    getDebounceTimer, setDebounceTimer,
    getCurrentPIStatus, setCurrentPIStatus,
    resolveMeioCode
} from './config.js';
import { fillFormFields, clearFormFields } from './form.js';
import { hideUploadGroups, generateUploadFields } from './upload.js';
import { normalizeOOHAddresses } from './ooh.js';

const form = document.getElementById('checkingForm');
const searchInput = document.getElementById('search-input');
const searchLabel = document.getElementById('search-label');
const searchStatus = document.getElementById('searchStatus');
const btnModePi = document.getElementById('btn-mode-pi');
const btnModeCnpj = document.getElementById('btn-mode-cnpj');

// alterna modo de busca
export function setSearchMode(mode) {
    setSearchModeValue(mode);
    searchInput.value = '';
    searchStatus.innerText = '';
    const sel = document.getElementById('pi-results-select');
    if (sel) sel.style.display = 'none';
    clearFormFields();
    hideUploadGroups();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }

    if (mode === 'pi') {
        btnModePi.classList.add('active');
        btnModeCnpj.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Número do PI *`;
        searchInput.placeholder = 'Digite o número do PI (ex: 12345/24)';
        searchInput.name = 'n_pi';
    } else {
        btnModeCnpj.classList.add('active');
        btnModePi.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            CNPJ do Veículo *`;
        searchInput.placeholder = '00.000.000/0000-00';
        searchInput.name = 'cnpj';
    }
}

// debounce na digitacao
export function handleSearchInput(e) {
    let val = e.target.value;
    if (getSearchMode() === 'cnpj') {
        val = maskCNPJ(val);
        e.target.value = val;
    }

    clearTimeout(getDebounceTimer());
    setDebounceTimer(setTimeout(() => {
        if (val.length >= 3) {
            performSearch(val);
        } else {
            searchStatus.innerText = '';
            const sel = document.getElementById('pi-results-select');
            if (sel) sel.style.display = 'none';
            clearFormFields();
            hideUploadGroups();
        }
    }, 500));
}

function maskCNPJ(val) {
    return val.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// chamada pra api
async function performSearch(query) {
    searchStatus.innerText = 'Buscando...';
    searchStatus.style.color = 'var(--text-muted)';

    const mode = getSearchMode();
    const cleanQuery = mode === 'cnpj' ? query.replace(/\D/g, '') : query.trim();

    try {
        const payload = {
            action: mode === 'cnpj' ? 'buscar_pis_cnpj' : 'buscar_pi',
            [mode === 'cnpj' ? 'cnpj' : 'n_pi']: cleanQuery
        };

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network error');
        const data = await response.json();

        if (mode === 'cnpj' && data.success && data.pis) {
            renderPIList(data.pis, query);
            searchStatus.innerText = `${data.pis.length} PI(s) encontrada(s). Selecione:`;
            searchStatus.style.color = 'var(--text)';
        } else if (data.success && data.n_pi) {
            processSearchResult(data);
        } else {
            throw new Error(data.message || 'Not found');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        let msg = 'Erro na conexão com o servidor.';
        if (error.message && error.message !== 'Network error' && error.message !== 'Failed to fetch') msg = error.message;
        searchStatus.innerText = msg;
        searchStatus.style.color = '#ef4444';
        clearFormFields();
        hideUploadGroups();
        const sel = document.getElementById('pi-results-select');
        if (sel) sel.style.display = 'none';
    }
}

// processa resultado da busca (compartilhado entre PI direto e CNPJ)
function processSearchResult(data) {
    searchStatus.innerText = 'PI Encontrada!';
    searchStatus.style.color = '#10b981';

    const status = {
        can_submit: data.can_submit !== false,
        is_complement: data.is_complement === true,
        enderecos: [],
        total_enderecos: 0
    };

    if (data.enderecos || data.enderecos_raw) {
        const normalized = normalizeOOHAddresses(data.enderecos || data.enderecos_raw || data);
        status.enderecos = normalized;
        status.total_enderecos = data.total_enderecos || normalized.length;
    }

    const st = (data.status_checking || '').toLowerCase();
    let forceBlock = false, blockMsg = '';

    if (st && st !== 'não recebido' && st !== 'null') {
        forceBlock = true;
        if (st === 'ok') { blockMsg = 'PI com Checking Confirmado. (Envio Bloqueado)'; searchStatus.style.color = '#15803d'; }
        else if (st === 'falha') { blockMsg = 'PI com Checking Recusado. (Envio Bloqueado)'; searchStatus.style.color = '#b91c1c'; }
        else if (st === 'com problema' || st === 'complemento') { blockMsg = 'PI com Checking Arquivado. (Envio Bloqueado)'; searchStatus.style.color = '#b45309'; }
        else { blockMsg = `PI Finalizada (${data.status_checking}). Envio bloqueado.`; searchStatus.style.color = '#ef4444'; }
    }

    if (forceBlock) { status.can_submit = false; searchStatus.innerText = blockMsg; }

    setCurrentPIStatus(status);

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!status.can_submit) {
        if (!forceBlock) { searchStatus.innerText = data.message || data.status_message || 'Limite atingido.'; searchStatus.style.color = '#ef4444'; }
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
    } else {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        searchStatus.innerText = 'PI Disponível para envio.';
        searchStatus.style.color = '#10b981';
    }

    fillFormFields(data);
    const resolved = resolveMeioCode(data.meio);
    generateUploadFields(resolved, status.enderecos, { blocked: forceBlock, message: blockMsg, status: st });

    const sel = document.getElementById('pi-results-select');
    if (sel) sel.style.display = 'none';
}

// renderiza dropdown de PIs (modo cnpj)
function renderPIList(list) {
    const sel = document.getElementById('pi-results-select');
    if (!sel) return;

    sel.innerHTML = '<option value="" hidden>Selecione uma PI...</option>';
    sel.piDataMap = {};

    list.forEach(item => {
        const piNum = item.n_pi || item.id;
        const st = (item.status_checking || '').toLowerCase();
        let canSubmit = item.can_submit !== false;
        if (st && st !== 'não recebido' && st !== 'null') canSubmit = false;

        const option = document.createElement('option');
        option.value = piNum;
        let label = `PI: ${piNum} - ${item.campanha || 'Campanha'} (${item.status_checking || 'Não recebido'})`;
        if (!canSubmit) label += ' [Bloqueado]';
        else if (item.is_complement) label += ' [Complemento]';
        option.innerText = label;
        if (!canSubmit) option.disabled = true;

        sel.appendChild(option);
        sel.piDataMap[piNum] = item;
    });

    sel.style.display = 'block';
    sel.focus();
}

// quando seleciona PI no dropdown — refaz busca completa pra pegar enderecos OOH
export async function handlePISelectChange(e) {
    const selected = e.target.value;
    if (!selected) return;
    const sel = document.getElementById('pi-results-select');
    const item = sel.piDataMap[selected];
    if (!item) return;

    // preenche o campo de busca com o numero da PI selecionada
    searchInput.value = item.n_pi || selected;

    // refaz busca como busca_pi pra trazer dados completos (incluindo enderecos OOH)
    searchStatus.innerText = 'Carregando dados da PI...';
    searchStatus.style.color = 'var(--text-muted)';

    try {
        const payload = {
            action: 'buscar_pi',
            n_pi: (item.n_pi || selected).trim()
        };

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network error');
        const data = await response.json();

        if (data.success && data.n_pi) {
            processSearchResult(data);
        } else {
            // fallback pros dados do cache se a rebusca falhar
            processSearchResult(item);
        }
    } catch (error) {
        console.warn('Rebusca falhou, usando dados do cache:', error);
        processSearchResult(item);
    }
}
