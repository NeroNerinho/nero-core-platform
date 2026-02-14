// configuracoes globais e estado compartilhado do app

// endpoint da api (n8n webhook que processa tudo)
export const API_ENDPOINT = 'https://n8n.grupoom.com.br/webhook/CheckingCentral';

// mapeamento dos tipos de meio com aliases e configuracoes
export const MEDIA_TYPE_CONFIG = {
    "AT": { label: "Ativação", fields: 1, aliases: ['PY', 'EV', 'MA'] },
    "BD": { label: "Busdoor/Taxidoor", fields: 1, aliases: ['BP'] },
    "CI": { label: "Cinema", fields: 1, aliases: ['CN', 'CP'] },
    "DO": { label: "Digital Out of Home", fields: 3, hasInsertions: true, aliases: ['PH'] },
    "FL": { label: "Frontlight", fields: 1, aliases: ['PF', 'GD'] },
    "IN": { label: "Internet", fields: 1, aliases: ['IA', 'IB', 'ID', 'IS', 'IV', 'MS', 'PN', 'PW'] },
    "JO": { label: "Jornal", fields: 1, aliases: ['JN', 'PJ', 'GS', 'GO', 'FT'] },
    "MT": { label: "Metrô", fields: 2, hasMarking: true, aliases: ['PM'] },
    "ME": { label: "Mídia Externa", fields: 2, hasMarking: true, aliases: ['EP'] },
    "MN": { label: "Mídia Interna", fields: 1, aliases: ['PI'] },
    "OD": { label: "Outdoor", fields: 1, aliases: ['PO'] },
    "RD": { label: "Rádio", fields: 1, aliases: ['RA', 'RF', 'PD', 'PA'] },
    "RV": { label: "Revista", fields: 1, aliases: ['RE', 'PS'] },
    "TV": { label: "TV", fields: 1, hasInsertions: true, aliases: ['TA', 'PT', 'PV'] },
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

// estado global mutavel — getters/setters pra manter controle
let _searchMode = 'pi';
let _debounceTimer = null;
let _currentPIStatus = { can_submit: true, is_complement: false };

export function getSearchMode() { return _searchMode; }
export function setSearchModeValue(mode) { _searchMode = mode; }

export function getDebounceTimer() { return _debounceTimer; }
export function setDebounceTimer(timer) { _debounceTimer = timer; }

export function getCurrentPIStatus() { return _currentPIStatus; }
export function setCurrentPIStatus(status) { _currentPIStatus = status; }
export function updateCurrentPIStatus(partial) {
    _currentPIStatus = { ..._currentPIStatus, ...partial };
}

// resolve codigo de meio pra chave primaria (procura nos aliases)
export function resolveMeioCode(code) {
    if (!code) return 'DEFAULT';
    const upper = code.trim().toUpperCase();
    if (MEDIA_TYPE_CONFIG[upper]) return upper;
    for (const [key, config] of Object.entries(MEDIA_TYPE_CONFIG)) {
        if (config.aliases && config.aliases.includes(upper)) return key;
    }
    return upper;
}
