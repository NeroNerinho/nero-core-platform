// normalizacao de enderecos ooh e geracao de cards

// (local escapeHtml to avoid circular dependency)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// normaliza qualquer formato de endereco pra [{id, endereco, campos_upload}]
export function normalizeOOHAddresses(rawData) {
    if (!rawData) return [];
    let lines = [];

    if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].endereco) {
        lines = rawData.map(item => (typeof item.endereco === 'string' ? item.endereco : String(item.endereco)));
    } else if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'string') {
        lines = rawData;
    } else if (typeof rawData === 'string') {
        lines = parseRawAddressText(rawData);
    } else if (typeof rawData === 'object' && !Array.isArray(rawData)) {
        const fields = ['enderecos_raw', 'enderecos', 'endereco', 'addresses', 'campos'];
        for (const f of fields) {
            if (rawData[f]) return normalizeOOHAddresses(rawData[f]);
        }
        return [];
    } else {
        return [];
    }

    const valid = lines
        .map(l => l.trim())
        .filter(isValidAddress)
        .map(l => cleanAddressPrefix(l));

    return valid.map((endereco, index) => {
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

function parseRawAddressText(text) {
    if (!text) return [];
    let clean = text.replace(/<[^>]+>/g, '');
    clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return clean.split('\n');
}

// validacao restrita de endereco brasileiro
function isValidAddress(line) {
    if (!line || line.length < 5) return false;
    const cleaned = cleanAddressPrefix(line);
    if (!cleaned || cleaned.length < 5) return false;

    const upper = cleaned.toUpperCase().trim();
    const upperNoPunct = upper.replace(/[:.;,*#=\-–—]+/g, ' ').trim();

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

    const headerExact = [
        'ENDEREÇO', 'ENDERECO', 'ENDEREÇOS', 'ENDERECOS',
        'ENDEREÇO(S)', 'ENDERECO(S)', 'LOCAIS', 'LOCAL',
        'PONTOS', 'PONTO DE EXIBIÇÃO', 'PONTO DE EXIBICAO',
        'LISTA DE ENDEREÇOS', 'LISTA DE ENDERECOS',
        'PONTOS DE OUTDOOR', 'PONTOS DE FRONTLIGHT',
        'RELAÇÃO DE ENDEREÇOS', 'RELACAO DE ENDERECOS'
    ];
    if (headerExact.includes(upperNoPunct)) return false;

    const trashPatterns = [
        /^\*{2,}/, /^FACE\b/i, /^SENTIDO\b/i, /^LADO\b/i,
        /^POSIÇÃO/i, /^POSICAO/i, /^OBS[:.]/i, /^NOTA[:.]/i,
        /^ATENÇÃO/i, /^ATENCAO/i, /^IMPORTANTE/i,
        /^PRÓXIMO\s+(A|AO|DA|DO|DE)\b/i, /^PROXIMO\s+(A|AO|DA|DO|DE)\b/i,
        /^EM\s+FRENTE/i, /^ENTRE\s/i, /^APÓS\b/i, /^APOS\b/i, /^ANTES\b/i,
        /^\d+\s*(M|METROS?|CM)\b/i, /^\d+[.,]\d+\s*[xX]\s*\d+/,
        /^(HORIZONTAL|VERTICAL|DIAGONAL)/i,
        /^(DIGITAL|ANALÓGICO|ANALOGICO|ESTÁTICO|ESTATICO)/i,
        /^(CHAPA|LONA|BACKLIGHT|FRONTLIGHT|PAINEL)/i,
        /^(ILUMINAD[OA]|SEM\s+ILUMINA)/i, /^\d+\s*UN(IDADES?)?/i,
        /^(PERÍODO|PERIODO)\b/i,
    ];
    if (trashPatterns.some(regex => regex.test(cleaned))) return false;
    if (/^\d+$/.test(cleaned)) return false;
    if (/^[\s=\-_*#.;:,\/\\()\[\]{}]+$/.test(cleaned)) return false;
    if (cleaned.length < 8 && !/\b(R\.|AV\.|AL\.|TV\.)\b/i.test(cleaned)) return false;

    const streetTypes = [
        /\b(RUA|R\.)\s+\S/i, /\b(AVENIDA|AV\.)\s+\S/i,
        /\b(ALAMEDA|AL\.)\s+\S/i, /\b(TRAVESSA|TV\.)\s+\S/i,
        /\b(RODOVIA|ROD\.)\s+\S/i, /\b(ESTRADA|EST\.)\s+\S/i,
        /\b(PRAÇA|PÇA\.?)\s+\S/i, /\bPRACA\s+\S/i,
        /\b(LARGO|VIELA|BECO)\s+\S/i, /\b(VILA)\s+\S/i,
        /\b(MARGINAL|MG\.?)\s+\S/i, /\b(VIADUTO|VD\.)\s+\S/i,
        /\b(PONTE)\s+\S/i,
        /\b(ANEL)\s+(VIÁRIO|VIARIO|RODOVIÁRIO|RODOVIARIO)/i,
        /\b(TRECHO|TREVO)\s+\S/i, /\b(CONTORNO)\s+\S/i,
        /\b(BR|SP|RJ|MG|MS|PR|SC|RS|BA|GO|MT|PA|CE|PE|MA|PI|AM|RN|ES|SE|AL|TO|RO|RR|AP|AC|DF)\s*[-]\s*\d{2,3}/i,
        /\bKM\s*\d/i, /\b\d{5}\s*[-]?\s*\d{3}\b/,
        /\bN[°ºo]?\s*\d{1,5}\b/i,
        /\bESQ(UINA)?\.?\s+(R\.|RUA|AV\.|AVENIDA)/i,
        /\b(CRUZAMENTO|ROTATÓRIA|ROTATORIA)\s+(COM|DA|DE|DO)\s+\S/i,
        /[-\/]\s*(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\s*$/i,
    ];

    return streetTypes.some(regex => regex.test(cleaned));
}

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

// gera cards de endereco com upload perto/longe
export function generateOOHAddressFields(enderecos, meioCode) {
    const container = document.getElementById('ooh-addresses-container');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'block';

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
            <span class="ooh-subtitle">${enderecos.length} endereço(s) — 1 foto de perto + 1 de longe por endereço</span>
        </div>
    `;
    container.appendChild(header);

    enderecos.forEach((end, index) => {
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
    card.style.animation = `cardSlide 0.4s var(--ease-out, ease-out) ${index * 0.08}s both`;
    card.dataset.enderecoId = endereco.id;

    const pertoName = endereco.campos_upload?.foto_perto?.field_name || `foto_perto_${endereco.id}`;
    const longeName = endereco.campos_upload?.foto_longe?.field_name || `foto_longe_${endereco.id}`;

    card.innerHTML = `
        <div class="address-card__content">
            <div class="address-header">
                <div class="address-number">${index + 1}</div>
                <div class="address-info">
                    <h4 class="address-title">Endereço de Veiculação</h4>
                    <p class="address-text">${escapeHtml(endereco.endereco)}</p>
                </div>
            </div>
            <div class="upload-pair">
                <div class="upload-field-ooh">
                    <label for="${pertoName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        Foto de Perto *
                    </label>
                    <input type="file" id="${pertoName}" name="${pertoName}" accept=".pdf,.jpg,.jpeg,.png,.heic" required data-endereco-id="${endereco.id}" data-tipo="perto" />
                    <span class="file-info" id="info-${pertoName}"></span>
                </div>
                <div class="upload-field-ooh">
                    <label for="${longeName}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        Foto de Longe *
                    </label>
                    <input type="file" id="${longeName}" name="${longeName}" accept=".pdf,.jpg,.jpeg,.png,.heic" required data-endereco-id="${endereco.id}" data-tipo="longe" />
                    <span class="file-info" id="info-${longeName}"></span>
                </div>
            </div>
        </div>
    `;
    return card;
}

function handleOOHFileChange(e) {
    const file = e.target.files[0];
    const infoSpan = document.getElementById(`info-${e.target.id}`);
    if (file && infoSpan) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        infoSpan.textContent = `${file.name} (${sizeMB} MB)`;
        infoSpan.className = 'file-info success';
    } else if (infoSpan) {
        infoSpan.textContent = '';
        infoSpan.className = 'file-info';
    }
}
