
// sistema de checking opusmultipla
// logica principal, integracao com api e controle de formulario


// endpoint da api (n8n webhook que processa tudo no backend)
const API_ENDPOINT = 'https://n8n.grupoom.com.br/webhook/CheckingCentral';

// mapeamento dos tipos de meio com seus aliases e configuracoes
// cada meio tem: label pro usuario, quantidade de campos de upload,
// flags opcionais (hasInsertions, hasMarking) e aliases que resolvem pro mesmo meio
const MEDIA_TYPE_CONFIG = {

    // ativacao (inclui eventos e midia alternativa)
    "AT": { label: "Ativação", fields: 1, aliases: ['PY', 'EV', 'MA'] },

    // busdoor / taxidoor
    "BD": { label: "Busdoor/Taxidoor", fields: 1, aliases: ['BP'] },

    // cinema
    "CI": { label: "Cinema", fields: 1, aliases: ['CN', 'CP'] },

    // dooh (painel de led, monitores etc)
    "DO": { label: "Digital Out of Home", fields: 3, hasInsertions: true, aliases: ['PH'] },

    // frontlight (GD = gigadoor, tratado como frontlight)
    "FL": { label: "Frontlight", fields: 1, aliases: ['PF', 'GD'] },

    // internet / digital
    "IN": { label: "Internet", fields: 1, aliases: ['IA', 'IB', 'ID', 'IS', 'IV', 'MS', 'PN', 'PW'] },

    // jornal (inclui graficas e fotolito)
    "JO": { label: "Jornal", fields: 1, aliases: ['JN', 'PJ', 'GS', 'GO', 'FT'] },

    // metro (MT eh a chave, MO virou material de escritorio)
    "MT": { label: "Metrô", fields: 2, hasMarking: true, aliases: ['PM'] },

    // midia externa (mub)
    "ME": { label: "Mídia Externa", fields: 2, hasMarking: true, aliases: ['EP'] },

    // midia interna (MN eh a chave, MI virou material de informatica)
    "MN": { label: "Mídia Interna", fields: 1, aliases: ['PI'] },

    // outdoor
    "OD": { label: "Outdoor", fields: 1, aliases: ['PO'] },

    // radio (inclui producao de audio)
    "RD": { label: "Rádio", fields: 1, aliases: ['RA', 'RF', 'PD', 'PA'] },

    // revista
    "RV": { label: "Revista", fields: 1, aliases: ['RE', 'PS'] },

    // tv
    "TV": { label: "TV", fields: 1, hasInsertions: true, aliases: ['TA', 'PT', 'PV'] },

    // fallback pra tudo que nao se encaixa acima
    "DEFAULT": {
        label: "Outros Serviços",
        fields: 1,
        aliases: [
            'AS', 'BR', 'BV', 'CA', 'CR', 'CS', 'DE', 'FE', 'FI',
            'FO', 'FP', 'IL', 'IP', 'LO', 'MD', 'MI', 'ML', 'MO',
            'OU', 'PB', 'PC', 'PQ', 'RL', 'RP', 'RT', 'TO', 'TR', 'VE'
        ]
    }
};

// estado global do formulario
let searchMode = 'pi';
let debounceTimer = null;
let currentPIStatus = { can_submit: true, is_complement: false };
let submitClickCount = 0;
let guideClickCount = 0;

// referencia dos elementos do dom (pega tudo uma vez so)
const form = document.getElementById('checkingForm');
const searchInput = document.getElementById('search-input');
const searchLabel = document.getElementById('search-label');
const searchStatus = document.getElementById('searchStatus');
const resultsSelect = document.getElementById('pi-results-select');
const uploadPlaceholder = document.getElementById('upload-empty-state');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressContainer = document.getElementById('progressContainer');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const btnModePi = document.getElementById('btn-mode-pi');
const btnModeCnpj = document.getElementById('btn-mode-cnpj');

// ============================================================
// inicializacao principal
// garante que tudo roda apenas quando o DOM estiver pronto
// ============================================================

// ============================================================
// inicializacao principal
// garante que tudo roda apenas quando o DOM estiver pronto
// ============================================================

function initAll() {
    console.log('Inicializando checking system...');
    initForm();
    initDarkMode();
    initEasterEggs();
    initScrollReveal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

function initForm() {
    if (btnModePi) btnModePi.addEventListener('click', () => setSearchMode('pi'));
    if (btnModeCnpj) btnModeCnpj.addEventListener('click', () => setSearchMode('cnpj'));
    if (searchInput) searchInput.addEventListener('input', handleSearchInput);
    if (form) form.addEventListener('submit', handleFormSubmit);
    if (resultsSelect) {
        resultsSelect.addEventListener('change', handlePISelectChange);
    }
}

// ============================================================
// easter eggs
// ============================================================
function initEasterEggs() {
    const mediaGuideSummary = document.querySelector('.rules-guide summary') ||
        document.querySelector('.media-guide summary') ||
        document.querySelector('details summary');

    const modal = document.getElementById('easterEggModal');
    const closeBtn = document.getElementById('closeModal');
    const playerDiv = document.getElementById('player');

    // Define helper function first (hoisted inside this scope)
    function closeEasterEgg() {
        if (modal && playerDiv) {
            modal.classList.remove('active');
            playerDiv.innerHTML = '';
            document.body.style.overflow = '';
        }
    }

    // Expose globally just in case provided APIs call it
    window.closeEasterEgg = closeEasterEgg;

    if (mediaGuideSummary) {
        mediaGuideSummary.addEventListener('click', (e) => {
            guideClickCount++;
            if (guideClickCount >= 5) {
                openEasterEgg('N47uBLxC3Kg'); // Video 1
                guideClickCount = 0;
            }
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeEasterEgg);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeEasterEgg();
        });
    }

    // torna disponivel globalmente
    window.openEasterEgg = (videoId) => {
        if (!/^[a-zA-Z0-9_-]+$/.test(videoId)) {
            console.error('Video ID invalido');
            return;
        }
        if (modal && playerDiv) {
            modal.classList.add('active');
            playerDiv.innerHTML = `
                <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
            document.body.style.overflow = 'hidden';
        }
    };
}

// ============================================================
// dark mode toggle
// ============================================================
function initDarkMode() {
    console.log('Iniciando Dark Mode...');
    const toggle = document.getElementById('darkModeToggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');

    if (!toggle) {
        console.error('Botao Dark Mode nao encontrado!');
        return;
    }

    function setDarkMode(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        if (iconSun && iconMoon) {
            iconSun.style.display = isDark ? 'none' : 'block';
            iconMoon.style.display = isDark ? 'block' : 'none';
        }
        localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    }

    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
        setDarkMode(stored === 'true');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
    }

    toggle.addEventListener('click', () => {
        console.log('Botao Dark Mode clicado!');
        const isDark = document.documentElement.classList.contains('dark');
        console.log('Alternando para:', !isDark ? 'Escuro' : 'Claro');
        setDarkMode(!isDark);
    });
}

// ============================================================
// scroll reveal
// ============================================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.06}s`;
            observer.observe(el);
        });
    } else {
        // fallback
        reveals.forEach(el => el.classList.add('reveal--visible'));
    }
}

// ============================================================
// helper methods
// ============================================================
// pega um codigo qualquer e encontra a chave primaria na config

function resolveMeioCode(code) {
    if (!code) return 'DEFAULT';
    const upper = code.trim().toUpperCase();

    // ja eh chave primaria?
    if (MEDIA_TYPE_CONFIG[upper]) return upper;

    // procura nos aliases
    for (const [key, config] of Object.entries(MEDIA_TYPE_CONFIG)) {
        if (config.aliases && config.aliases.includes(upper)) {
            return key;
        }
    }
    return upper;
}


// modo de busca (PI ou CNPJ)
// alterna entre os dois modos e reseta o formulario

function setSearchMode(mode) {
    searchMode = mode;
    searchInput.value = '';
    searchStatus.innerText = '';
    if (resultsSelect) resultsSelect.style.display = 'none';
    clearFormFields();
    hideUploadGroups();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }

    if (mode === 'pi') {
        btnModePi.classList.add('active');
        btnModeCnpj.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            Número do PI *        `;
        searchInput.placeholder = 'Digite o número do PI (ex: 12345/24)';
        searchInput.name = 'n_pi';
    } else {
        btnModeCnpj.classList.add('active');
        btnModePi.classList.remove('active');
        searchLabel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            CNPJ do Veículo *
        `;
        searchInput.placeholder = '00.000.000/0000-00';
        searchInput.name = 'cnpj';
    }
}

// busca com debounce
// espera 500ms sem digitacao antes de disparar a request

function handleSearchInput(e) {
    let val = e.target.value;

    if (searchMode === 'cnpj') {
        val = maskCNPJ(val);
        e.target.value = val;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (val.length >= 3) {
            performSearch(val);
        } else {
            searchStatus.innerText = '';
            if (resultsSelect) resultsSelect.style.display = 'none';
            clearFormFields();
            hideUploadGroups();
        }
    }, 500);
}

// mascara de cnpj (00.000.000/0000-00)
function maskCNPJ(val) {
    return val.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// chamada pra api de busca
// manda pro n8n e processa a resposta

async function performSearch(query) {
    searchStatus.innerText = 'Buscando...';
    searchStatus.style.color = 'var(--text-muted)';

    const cleanQuery = searchMode === 'cnpj' ? query.replace(/\D/g, '') : query.trim();

    try {
        const payload = {
            action: searchMode === 'cnpj' ? 'buscar_pis_cnpj' : 'buscar_pi',
            [searchMode === 'cnpj' ? 'cnpj' : 'n_pi']: cleanQuery
        };

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Network error');
        const data = await response.json();

        if (searchMode === 'cnpj' && data.success && data.pis) {
            // cnpj retorna lista de PIs
            renderPIList(data.pis, query);
            searchStatus.innerText = `${data.pis.length} PI(s) encontrada(s). Selecione na lista abaixo:`;
            searchStatus.style.color = 'var(--text)';
        } else if (data.success && data.n_pi) {
            // busca direta por PI - resultado unico
            searchStatus.innerText = 'PI Encontrada!';
            searchStatus.style.color = '#10b981';

            currentPIStatus = {
                can_submit: data.can_submit !== false,
                is_complement: data.is_complement === true,
                enderecos: [],
                total_enderecos: 0
            };

            // normaliza enderecos independente do formato que vier do backend
            if (data.enderecos || data.enderecos_raw) {
                const normalized = normalizeOOHAddresses(data.enderecos || data.enderecos_raw || data);
                currentPIStatus.enderecos = normalized;
                currentPIStatus.total_enderecos = data.total_enderecos || normalized.length;
            }

            // logica de bloqueio: qualquer status definido = PI finalizada = bloqueia envio
            const st = (data.status_checking || '').toLowerCase();
            let forceBlock = false;
            let blockMsg = '';

            if (st && st !== 'não recebido' && st !== 'null') {
                forceBlock = true;
                if (st === 'ok') {
                    blockMsg = 'PI com Checking Confirmado. (Envio Bloqueado)';
                    searchStatus.style.color = '#15803d';
                } else if (st === 'falha') {
                    blockMsg = 'PI com Checking Recusado. (Envio Bloqueado)';
                    searchStatus.style.color = '#b91c1c';
                } else if (st === 'com problema' || st === 'complemento') {
                    blockMsg = 'PI com Checking Arquivado. (Envio Bloqueado)';
                    searchStatus.style.color = '#b45309';
                } else {
                    blockMsg = `PI Finalizada (${data.status_checking}). Envio bloqueado.`;
                    searchStatus.style.color = '#ef4444';
                }
            }

            if (forceBlock) {
                currentPIStatus.can_submit = false;
                searchStatus.innerText = blockMsg;
            }

            if (!currentPIStatus.can_submit) {
                if (!forceBlock) {
                    searchStatus.innerText = data.message || 'Limite de checkings atingido.';
                    searchStatus.style.color = '#ef4444';
                }
                form.querySelector('button[type="submit"]').disabled = true;
                form.querySelector('button[type="submit"]').style.opacity = '0.5';
            } else {
                form.querySelector('button[type="submit"]').disabled = false;
                form.querySelector('button[type="submit"]').style.opacity = '1';
                searchStatus.innerText = 'PI Disponível para envio.';
                searchStatus.style.color = '#10b981';
            }

            fillFormFields(data);
            const resolvedMeio = resolveMeioCode(data.meio);
            generateUploadFields(resolvedMeio, currentPIStatus.enderecos, {
                blocked: forceBlock,
                message: blockMsg,
                status: st
            });

            // esconde o select se tava no modo cnpj
            const resultsSelect = document.getElementById('pi-results-select');
            if (resultsSelect) resultsSelect.style.display = 'none';

        } else {
            throw new Error(data.message || 'Not found');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        let msg = 'Erro na conexão com o servidor.';
        if (error.message && error.message !== 'Network error' && error.message !== 'Failed to fetch') {
            msg = error.message;
        }
        searchStatus.innerText = msg;
        searchStatus.style.color = '#ef4444';
        clearFormFields();
        hideUploadGroups();
        const resultsSelect = document.getElementById('pi-results-select');
        if (resultsSelect) resultsSelect.style.display = 'none';
    }
}

// ============================================================
// renderiza lista de PIs (modo CNPJ)
// usa select nativo, guarda mapa de dados pra recuperar depois
// ============================================================

function renderPIList(list, cnpjSearched = null) {
    const resultsSelect = document.getElementById('pi-results-select');
    if (!resultsSelect) return;

    resultsSelect.innerHTML = '<option value="" hidden>Selecione uma PI...</option>';
    resultsSelect.piDataMap = {};

    list.forEach(item => {
        const piNum = item.n_pi || item.id;
        const st = (item.status_checking || '').toLowerCase();
        let canSubmit = item.can_submit !== false;

        // mesma regra: se tem status definido, bloqueia
        if (st && st !== 'não recebido' && st !== 'null') {
            canSubmit = false;
        }

        const isComplement = item.is_complement === true;
        const option = document.createElement('option');
        option.value = piNum;

        let label = `PI: ${piNum} - ${item.campanha || 'Campanha'} (${item.status_checking || 'Não recebido'})`;
        if (!canSubmit) label += ' [Finalizado/Bloqueado]';
        else if (isComplement) label += ' [Complemento]';

        option.innerText = label;
        if (!canSubmit) option.disabled = true;

        resultsSelect.appendChild(option);
        resultsSelect.piDataMap[piNum] = item;
    });

    resultsSelect.style.display = 'block';
    resultsSelect.focus();
}

// quando seleciona uma PI no dropdown
function handlePISelectChange(e) {
    const selectedPI = e.target.value;
    if (!selectedPI) return;
    const resultsSelect = document.getElementById('pi-results-select');
    const item = resultsSelect.piDataMap[selectedPI];
    if (item) selectPI(item);
}

// ============================================================
// seleciona uma PI e preenche o formulario
// mesma logica do performSearch mas partindo de um item da lista
// ============================================================

function selectPI(data) {
    if (searchMode === 'pi') {
        searchInput.value = data.n_pi;
    }

    currentPIStatus = {
        can_submit: data.can_submit !== false,
        is_complement: data.is_complement === true,
        enderecos: [],
        total_enderecos: 0
    };

    if (data.enderecos || data.enderecos_raw) {
        const normalized = normalizeOOHAddresses(data.enderecos || data.enderecos_raw || data);
        currentPIStatus.enderecos = normalized;
        currentPIStatus.total_enderecos = data.total_enderecos || normalized.length;
    }

    const st = (data.status_checking || '').toLowerCase();
    let forceBlock = false;
    let blockMsg = '';

    if (st && st !== 'não recebido' && st !== 'null') {
        forceBlock = true;
        if (st === 'ok') {
            blockMsg = 'PI com Checking Confirmado. (Envio Bloqueado)';
            searchStatus.style.color = '#15803d';
        } else if (st === 'falha') {
            blockMsg = 'PI com Checking Recusado. (Envio Bloqueado)';
            searchStatus.style.color = '#b91c1c';
        } else if (st === 'com problema' || st === 'complemento') {
            blockMsg = 'PI com Checking Arquivado. (Envio Bloqueado)';
            searchStatus.style.color = '#b45309';
        } else {
            blockMsg = `PI Finalizada (${data.status_checking}). Envio bloqueado.`;
            searchStatus.style.color = '#ef4444';
        }
    }

    if (forceBlock) {
        currentPIStatus.can_submit = false;
        searchStatus.innerText = blockMsg;
    }

    if (!currentPIStatus.can_submit) {
        if (!forceBlock) {
            searchStatus.innerText = data.status_message || 'Limite de checkings atingido.';
            searchStatus.style.color = '#ef4444';
        }
        form.querySelector('button[type="submit"]').disabled = true;
        form.querySelector('button[type="submit"]').style.opacity = '0.5';
    } else {
        searchStatus.innerText = 'PI Disponível para envio!';
        searchStatus.style.color = '#10b981';
        form.querySelector('button[type="submit"]').disabled = false;
        form.querySelector('button[type="submit"]').style.opacity = '1';
    }

    fillFormFields(data);
    const resolvedMeio = resolveMeioCode(data.meio);
    generateUploadFields(resolvedMeio, currentPIStatus.enderecos, {
        blocked: forceBlock,
        message: blockMsg,
        status: st
    });
}

// ============================================================
// preenche os campos do formulario com os dados da PI
// ============================================================

function fillFormFields(data) {
    document.getElementById('cliente').value = data.cliente || '';
    document.getElementById('campanha').value = data.campanha || '';
    document.getElementById('produto').value = data.produto || '';
    document.getElementById('periodo').value = data.periodo || '';
    document.getElementById('veiculo').value = data.veiculo || '';

    // badge de status visual
    const statusBadge = document.getElementById('status-badge');
    const statusInput = document.getElementById('status-checking');

    if (statusBadge) {
        const st = data.status_checking || 'Não recebido';
        const stLower = st.toLowerCase();
        statusBadge.innerText = st;
        if (statusInput) statusInput.value = st;

        statusBadge.className = 'status-badge';
        if (stLower === 'ok') statusBadge.classList.add('ok');
        else if (stLower === 'falha') statusBadge.classList.add('falha');
        else if (stLower === 'com problema' || stLower === 'complemento') statusBadge.classList.add('problema');
    }

    // campo de meio (hidden + visivel)
    const meioHidden = document.getElementById('meio');
    const meioDesc = document.getElementById('meio-desc');
    const resolved = resolveMeioCode(data.meio);
    meioHidden.value = resolved;

    if (MEDIA_TYPE_CONFIG[resolved]) {
        meioDesc.value = MEDIA_TYPE_CONFIG[resolved].label;
    } else {
        meioDesc.value = data.meio || '—';
    }
}

// limpa todos os campos preenchidos
function clearFormFields() {
    ['cliente', 'campanha', 'produto', 'periodo', 'veiculo', 'status-checking', 'meio', 'meio-desc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
        statusBadge.innerText = '—';
        statusBadge.className = 'status-badge';
    }
}

// ============================================================
// controle dos grupos de upload
// esconde tudo e desabilita inputs pra nao irem no formdata
// ============================================================

function hideUploadGroups() {
    document.querySelectorAll('.upload-group').forEach(el => {
        el.style.display = 'none';
        el.querySelectorAll('input').forEach(inp => {
            inp.required = false;
            inp.disabled = true; // o segredo: input disabled nao vai no FormData
        });
    });
    uploadPlaceholder.style.display = 'block';

    document.querySelectorAll('.extra-field').forEach(el => {
        el.style.display = 'none';
        el.querySelectorAll('input').forEach(i => i.disabled = true);
    });

    const oohContainer = document.getElementById('ooh-addresses-container');
    if (oohContainer) {
        oohContainer.innerHTML = '';
        oohContainer.style.display = 'none';
    }
}

// ============================================================
// gera os campos de upload baseado no tipo de meio selecionado
// ============================================================

function generateUploadFields(meioCode, enderecos = null, blockingInfo = null) {
    hideUploadGroups();

    // se a PI ta bloqueada, mostra mensagem visual no lugar dos uploads
    if (blockingInfo && blockingInfo.blocked) {
        if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';

        const existingMsg = document.getElementById('upload-blocking-message');
        if (existingMsg) existingMsg.remove();

        const msgContainer = document.createElement('div');
        msgContainer.id = 'upload-blocking-message';
        msgContainer.style.textAlign = 'center';
        msgContainer.style.padding = '3rem 2rem';
        msgContainer.style.background = 'var(--bg-subtle)';
        msgContainer.style.borderRadius = '16px';
        msgContainer.style.border = '2px dashed var(--border)';

        let iconColor = '#64748b';
        let bgColor = '#f1f5f9';
        let title = 'Checking Finalizado';

        if (blockingInfo.status === 'ok') {
            iconColor = '#15803d';
            bgColor = '#dcfce7';
            title = 'Checking Confirmado';
        } else if (blockingInfo.status === 'falha') {
            iconColor = '#b91c1c';
            bgColor = '#fee2e2';
            title = 'Checking Recusado';
        } else if (blockingInfo.status === 'com problema' || blockingInfo.status === 'complemento') {
            iconColor = '#b45309';
            bgColor = '#fef3c7';
            title = 'Checking Arquivado';
        }

        msgContainer.innerHTML = `
            <div style="background: ${bgColor}; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${blockingInfo.status === 'ok'
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                : (blockingInfo.status === 'falha'
                    ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                    : '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>')
            }
                </svg>
            </div>
            <h3 style="color: ${iconColor}; margin-bottom: 0.5rem; font-size: 1.5rem; font-weight: 700;">${title}</h3>
            <p style="color: var(--text-muted); font-size: 1.1rem;">${blockingInfo.message}</p>
        `;

        const uploadContainer = document.querySelector('.upload-container');
        if (uploadContainer) uploadContainer.appendChild(msgContainer);
        return; // para aqui, nao gera campos
    }

    // limpa mensagem de bloqueio se existir
    const existingMsg = document.getElementById('upload-blocking-message');
    if (existingMsg) existingMsg.remove();

    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';

    // caso especial: ooh com enderecos (uninter)
    const cliente = document.getElementById('cliente').value || '';
    const isUninter = cliente.toUpperCase().includes('UNINTER');

    if (['OD', 'FL'].includes(meioCode) && isUninter && enderecos && enderecos.length > 0) {
        generateOOHAddressFields(enderecos, meioCode);
        uploadPlaceholder.style.display = 'none';
        return;
    }

    // busca o grupo de upload que bate com o meio
    let found = false;
    const groups = document.querySelectorAll('.upload-group');

    groups.forEach(group => {
        const targets = group.dataset.meio.split(' ');
        if (targets.includes(meioCode)) {
            group.style.display = 'block';
            group.querySelectorAll('input[type="file"]').forEach(inp => {
                inp.required = true;
                inp.disabled = false;
            });
            found = true;
        }
    });

    // se nao achou nenhum grupo especifico, cai no default
    if (!found) {
        const defaultGroup = document.querySelector('.upload-group[data-meio="DEFAULT"]');
        if (defaultGroup) {
            defaultGroup.style.display = 'block';
            defaultGroup.querySelectorAll('input').forEach(i => {
                i.required = true;
                i.disabled = false;
            });
        }
    }

    // mostra campos extras (insercoes, marcacao) se o meio exigir
    const config = MEDIA_TYPE_CONFIG[meioCode];
    if (config) {
        if (config.hasInsertions) {
            const field = document.getElementById('field-ins-total');
            if (field) {
                field.style.display = 'block';
                field.querySelectorAll('input').forEach(i => i.disabled = false);
            }
        }
        if (config.hasMarking) {
            const field = document.getElementById('field-marc-veiculo');
            if (field) {
                field.style.display = 'block';
                field.querySelectorAll('input').forEach(i => i.disabled = false);
            }
        }
    }
}

// ============================================================
// envio do formulario via XHR (pra ter progresso de upload)
// ============================================================

async function handleFormSubmit(e) {
    if (e) e.preventDefault();

    // easter egg check
    submitClickCount++;
    if (submitClickCount >= 3) {
        if (typeof window.openEasterEgg === 'function') {
            window.openEasterEgg('HB2bnfMb1tQ'); // Video 2
        }
        submitClickCount = 0;
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    progressContainer.style.display = 'block';
    progressContainer.classList.add('active');

    const formData = new FormData(form);
    formData.append('action', 'enviar_checking');
    formData.append('is_complemento', currentPIStatus.is_complement);

    // metadata ooh (se tiver enderecos)
    if (currentPIStatus.enderecos && currentPIStatus.enderecos.length > 0) {
        formData.append('enderecos_metadata', JSON.stringify(currentPIStatus.enderecos));
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT, true);

    // progresso do upload em tempo real
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = percentComplete + '%';
            progressText.innerText = percentComplete + '%';
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            const resp = JSON.parse(xhr.responseText);
            successMessage.innerText = resp.message || 'Checking enviado com sucesso!';
            successMessage.style.display = 'block';
            form.reset();
            clearFormFields();
            hideUploadGroups();
            setSearchMode('pi');
            currentPIStatus = { can_submit: true, is_complement: false };
            setTimeout(() => {
                progressContainer.style.display = 'none';
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            errorMessage.innerText = 'Erro ao enviar. Tente novamente.';
            errorMessage.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Checking';
    };

    xhr.onerror = function () {
        errorMessage.innerText = 'Erro de conexão/rede.';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Enviar Checking';
    };

    xhr.send(formData);
}

// ============================================================
// normalizador de enderecos ooh
// aceita qualquer formato (array, string, xml, objeto)
// sempre retorna: [{id, endereco, campos_upload}]
// ============================================================

function normalizeOOHAddresses(rawData) {
    if (!rawData) return [];
    let lines = [];

    // caso 1: array de objetos com campo 'endereco'
    if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].endereco) {
        lines = rawData.map(item => (typeof item.endereco === 'string' ? item.endereco : String(item.endereco)));
    }
    // caso 2: array de strings
    else if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'string') {
        lines = rawData;
    }
    // caso 3: string unica (pode ter \n, xml etc)
    else if (typeof rawData === 'string') {
        lines = parseRawAddressText(rawData);
    }
    // caso 4: objeto com campo que contenha enderecos
    else if (typeof rawData === 'object' && !Array.isArray(rawData)) {
        const possibleFields = ['enderecos_raw', 'enderecos', 'endereco', 'addresses', 'campos'];
        for (const field of possibleFields) {
            if (rawData[field]) return normalizeOOHAddresses(rawData[field]);
        }
        return [];
    }
    else {
        return [];
    }

    const validLines = lines
        .map(l => l.trim())
        .filter(isValidAddress)
        .map(l => cleanAddressPrefix(l));

    return validLines.map((endereco, index) => {
        const id = `end_${String(index + 1).padStart(3, '0')}`;
        return {
            id,
            endereco,
            campos_upload: {
                foto_perto: { field_name: `foto_perto_${id}`, required: true },
                foto_longe: { field_name: `foto_longe_${id}`, required: true }
            }
        };
    });
}

// parser de texto bruto — limpa tags xml/html e separa por linha
function parseRawAddressText(text) {
    if (!text) return [];
    let clean = text.replace(/<[^>]+>/g, '');
    clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return clean.split('\n');
}

// ============================================================
// validacao de endereco brasileiro
// whitelist estrita: so aceita se tiver indicador real de logradouro
// rejeita lixo tipo "Face mais da esquerda", "SENTIDO CENTRO" etc
// ============================================================

function isValidAddress(line) {
    if (!line || line.length < 5) return false;

    const cleaned = cleanAddressPrefix(line);
    if (!cleaned || cleaned.length < 5) return false;

    const upper = cleaned.toUpperCase().trim();
    const upperNoPunct = upper.replace(/[:.;,*#=\-–—]+/g, ' ').trim();

    // blacklist: metadata de PI/campanha
    const metadataStarts = [
        'CLIENTE', 'PERÍODO', 'PERIODO', 'FORMATO', 'QUANTIDADE',
        'PRODUTO', 'CAMPANHA', 'VEÍCULO', 'VEICULO', 'VEICULAR',
        'OBSERVAÇÃO', 'OBSERVACAO', 'OBS', 'CONTRATO', 'REFERÊNCIA',
        'REFERENCIA', 'TIPO', 'MATERIAL', 'DIMENSÃO', 'DIMENSAO',
        'PRAÇA', 'PRACA', 'IMPRESSÃO', 'IMPRESSAO', 'ILUMINAÇÃO',
        'ILUMINACAO', 'EXIBIÇÃO', 'EXIBICAO', 'MEDIDA', 'VALOR',
        'TOTAL', 'SUBTOTAL', 'DESCONTO', 'CUSTO', 'BONIFICAÇÃO',
        'BONIFICACAO', 'TABELA', 'NEGOCIAÇÃO', 'NEGOCIACAO',
        'VIGÊNCIA', 'VIGENCIA', 'INÍCIO', 'INICIO', 'TÉRMINO',
        'TERMINO', 'FIM', 'DATA', 'VALIDADE'
    ];
    if (metadataStarts.some(kw => upperNoPunct.startsWith(kw))) return false;

    // blacklist: cabecalhos de secao
    const headerExact = [
        'ENDEREÇO', 'ENDERECO', 'ENDEREÇOS', 'ENDERECOS',
        'ENDEREÇO(S)', 'ENDERECO(S)', 'LOCAIS', 'LOCAL',
        'PONTOS', 'PONTO DE EXIBIÇÃO', 'PONTO DE EXIBICAO',
        'LISTA DE ENDEREÇOS', 'LISTA DE ENDERECOS',
        'PONTOS DE OUTDOOR', 'PONTOS DE FRONTLIGHT',
        'RELAÇÃO DE ENDEREÇOS', 'RELACAO DE ENDERECOS'
    ];
    if (headerExact.includes(upperNoPunct)) return false;

    // blacklist: padroes de lixo (notas, descricoes de face etc)
    const trashPatterns = [
        /^\*{2,}/,
        /^FACE\b/i,
        /^SENTIDO\b/i,
        /^LADO\b/i,
        /^POSIÇÃO/i,
        /^POSICAO/i,
        /^OBS[:.]/i,
        /^NOTA[:.]/i,
        /^ATENÇÃO/i,
        /^ATENCAO/i,
        /^IMPORTANTE/i,
        /^PRÓXIMO\s+(A|AO|DA|DO|DE)\b/i,
        /^PROXIMO\s+(A|AO|DA|DO|DE)\b/i,
        /^EM\s+FRENTE/i,
        /^ENTRE\s/i,
        /^APÓS\b/i,
        /^APOS\b/i,
        /^ANTES\b/i,
        /^\d+\s*(M|METROS?|CM)\b/i,
        /^\d+[.,]\d+\s*[xX]\s*\d+/,
        /^(HORIZONTAL|VERTICAL|DIAGONAL)/i,
        /^(DIGITAL|ANALÓGICO|ANALOGICO|ESTÁTICO|ESTATICO)/i,
        /^(CHAPA|LONA|BACKLIGHT|FRONTLIGHT|PAINEL)/i,
        /^(ILUMINAD[OA]|SEM\s+ILUMINA)/i,
        /^\d+\s*UN(IDADES?)?/i,
        /^(PERÍODO|PERIODO)\b/i,
    ];
    if (trashPatterns.some(regex => regex.test(cleaned))) return false;

    if (/^\d+$/.test(cleaned)) return false;
    if (/^[\s=\-_*#.;:,\/\\()\[\]{}]+$/.test(cleaned)) return false;
    if (cleaned.length < 8 && !/\b(R\.|AV\.|AL\.|TV\.)\b/i.test(cleaned)) return false;

    // whitelist: tipos de logradouro brasileiro
    const streetTypes = [
        /\b(RUA|R\.)\s+\S/i,
        /\b(AVENIDA|AV\.)\s+\S/i,
        /\b(ALAMEDA|AL\.)\s+\S/i,
        /\b(TRAVESSA|TV\.)\s+\S/i,
        /\b(RODOVIA|ROD\.)\s+\S/i,
        /\b(ESTRADA|EST\.)\s+\S/i,
        /\b(PRAÇA|PÇA\.?)\s+\S/i,
        /\bPRACA\s+\S/i,
        /\b(LARGO|VIELA|BECO)\s+\S/i,
        /\b(VILA)\s+\S/i,
        /\b(MARGINAL|MG\.?)\s+\S/i,
        /\b(VIADUTO|VD\.)\s+\S/i,
        /\b(PONTE)\s+\S/i,
        /\b(ANEL)\s+(VIÁRIO|VIARIO|RODOVIÁRIO|RODOVIARIO)/i,
        /\b(TRECHO|TREVO)\s+\S/i,
        /\b(CONTORNO)\s+\S/i,
        /\b(BR|SP|RJ|MG|MS|PR|SC|RS|BA|GO|MT|PA|CE|PE|MA|PI|AM|RN|ES|SE|AL|TO|RO|RR|AP|AC|DF)\s*[-]\s*\d{2,3}/i,
        /\bKM\s*\d/i,
        /\b\d{5}\s*[-]?\s*\d{3}\b/,
        /\bN[°ºo]?\s*\d{1,5}\b/i,
        /\bESQ(UINA)?\.?\s+(R\.|RUA|AV\.|AVENIDA)/i,
        /\b(CRUZAMENTO|ROTATÓRIA|ROTATORIA)\s+(COM|DA|DE|DO)\s+\S/i,
        /[-\/]\s*(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\s*$/i,
    ];

    return streetTypes.some(regex => regex.test(cleaned));
}

// remove prefixos que antecedem o endereco real (PONTO:, ***, 01., etc)
function cleanAddressPrefix(line) {
    if (!line) return '';
    let clean = line;
    clean = clean.replace(/^\*+\s*/, '');
    clean = clean.replace(/^\d{1,3}\s*[).:\-–—]\s*/, '');
    clean = clean.replace(/^PONTO\s*\d*\s*[:.;\-–—]?\s*/i, '');
    clean = clean.replace(/^END(ER(E[CÇ]O)?)?\.?\s*:?\s*/i, '');
    clean = clean.replace(/^LOCAL\s*[:.;\-–—]\s*/i, '');
    return clean.trim();
}

// ============================================================
// campos dinamicos de endereco ooh
// gera um card pra cada endereco com upload de foto perto + longe
// ============================================================

function generateOOHAddressFields(enderecos, meioCode) {
    const container = document.getElementById('ooh-addresses-container');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'block';

    const validEnderecos = enderecos;

    const header = document.createElement('div');
    header.className = 'ooh-header';
    header.innerHTML = `
        <div class="ooh-header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        </div>
        <div class="ooh-header-text">
            <span class="ooh-title">${meioCode === 'OD' ? 'Outdoor' : 'Frontlight'} - Endereços para Checking</span>
            <span class="ooh-subtitle">${validEnderecos.length} endereço(s) encontrado(s) - Envie 1 foto de perto e 1 de longe para cada</span>
        </div>
    `;
    container.appendChild(header);

    validEnderecos.forEach((end, index) => {
        const card = createAddressCard(end, index);
        container.appendChild(card);
    });

    container.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', handleOOHFileChange);
    });
}

function createAddressCard(endereco, index) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.dataset.enderecoId = endereco.id;

    const pertoFieldName = endereco.campos_upload?.foto_perto?.field_name || `foto_perto_${endereco.id}`;
    const longeFieldName = endereco.campos_upload?.foto_longe?.field_name || `foto_longe_${endereco.id}`;

    card.innerHTML = `
        <div class="address-header">
            <div class="address-number">${index + 1}</div>
            <div class="address-text">${escapeHtml(endereco.endereco)}</div>
        </div>
        <div class="upload-pair">
            <div class="upload-field-ooh">
                <label for="${pertoFieldName}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Foto de Perto *
                </label>
                <input type="file" id="${pertoFieldName}" name="${pertoFieldName}" accept="image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic" required data-endereco-id="${endereco.id}" data-tipo="perto" />
                <span class="file-info" id="info-${pertoFieldName}"></span>
            </div>
            <div class="upload-field-ooh">
                <label for="${longeFieldName}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Foto de Longe *
                </label>
                <input type="file" id="${longeFieldName}" name="${longeFieldName}" accept="image/jpeg,image/png,image/heic,.jpg,.jpeg,.png,.heic" required data-endereco-id="${endereco.id}" data-tipo="longe" />
                <span class="file-info" id="info-${longeFieldName}"></span>
            </div>
        </div>
    `;
    return card;
}

// feedback visual quando seleciona arquivo (nome + tamanho)
function handleOOHFileChange(e) {
    const file = e.target.files[0];
    const infoSpan = document.getElementById(`info-${e.target.id}`);
    if (file && infoSpan) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const isValid = sizeMB <= 10;
        infoSpan.textContent = `${file.name} (${sizeMB} MB)`;
        infoSpan.className = `file-info ${isValid ? 'success' : 'error'}`;
        if (!isValid) infoSpan.textContent += ' - Arquivo muito grande!';
    } else if (infoSpan) {
        infoSpan.textContent = '';
        infoSpan.className = 'file-info';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// easter eggs
// clica 5x no guia de midia = video 1
// clica 3x no botao enviar = video 2
// ============================================================

// fim do arquivo

// ============================================================
// dark mode toggle
// salva preferencia no localStorage, respeita prefers-color-scheme
// ============================================================

// (listeners removidos - movidos para init principal acima)

// ============================================================
// scroll reveal
// anima as secoes conforme aparecem na viewport
// usa IntersectionObserver — mesma ideia do framer-motion mas vanilla
// ============================================================

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.06}s`;
            observer.observe(el);
        });
    } else {
        reveals.forEach(el => el.classList.add('reveal--visible'));
    }
}
