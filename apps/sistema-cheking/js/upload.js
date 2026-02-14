// gerenciamento de campos de upload dinamicos

import { MEDIA_TYPE_CONFIG } from './config.js';
import { generateOOHAddressFields } from './ooh.js';

const uploadPlaceholder = document.getElementById('upload-empty-state');

// escapa html pra evitar xss
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// esconde todos os upload groups e desabilita inputs
export function hideUploadGroups() {
    document.querySelectorAll('.upload-group').forEach(el => {
        el.style.display = 'none';
        el.querySelectorAll('input').forEach(inp => {
            inp.required = false;
            inp.disabled = true;
        });
    });
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';

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

// gera campos de upload baseado no tipo de meio
export function generateUploadFields(meioCode, enderecos = null, blockingInfo = null) {
    hideUploadGroups();

    // PI bloqueada — mostra mensagem visual
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

        let iconColor = '#64748b', bgColor = '#f1f5f9', title = 'Checking Finalizado';
        if (blockingInfo.status === 'ok') { iconColor = '#15803d'; bgColor = '#dcfce7'; title = 'Checking Confirmado'; }
        else if (blockingInfo.status === 'falha') { iconColor = '#b91c1c'; bgColor = '#fee2e2'; title = 'Checking Recusado'; }
        else if (blockingInfo.status === 'com problema' || blockingInfo.status === 'complemento') { iconColor = '#b45309'; bgColor = '#fef3c7'; title = 'Checking Arquivado'; }

        msgContainer.innerHTML = `
            <div style="background:${bgColor};width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${blockingInfo.status === 'ok'
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                : blockingInfo.status === 'falha'
                    ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                    : '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'}
                </svg>
            </div>
            <h3 style="color:${iconColor};margin-bottom:0.5rem;font-size:1.5rem;font-weight:700;">${title}</h3>
            <p style="color:var(--text-muted);font-size:1.1rem;">${blockingInfo.message}</p>
        `;

        const uploadContainer = document.querySelector('.upload-container');
        if (uploadContainer) uploadContainer.appendChild(msgContainer);
        return;
    }

    const existingMsg = document.getElementById('upload-blocking-message');
    if (existingMsg) existingMsg.remove();
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';

    // caso especial: ooh uninter
    const cliente = document.getElementById('cliente').value || '';
    const isUninter = cliente.toUpperCase().includes('UNINTER');

    if (['OD', 'FL'].includes(meioCode) && isUninter && enderecos && enderecos.length > 0) {
        generateOOHAddressFields(enderecos, meioCode);
        uploadPlaceholder.style.display = 'none';
        return;
    }

    // procura grupo de upload que bate com o meio
    let found = false;
    document.querySelectorAll('.upload-group').forEach(group => {
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

    // fallback pro default
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

    // campos extras condicionais
    const config = MEDIA_TYPE_CONFIG[meioCode];
    if (config) {
        if (config.hasInsertions) {
            const field = document.getElementById('field-ins-total');
            if (field) { field.style.display = 'block'; field.querySelectorAll('input').forEach(i => i.disabled = false); }
        }
        if (config.hasMarking) {
            const field = document.getElementById('field-marc-veiculo');
            if (field) { field.style.display = 'block'; field.querySelectorAll('input').forEach(i => i.disabled = false); }
        }
    }
}
