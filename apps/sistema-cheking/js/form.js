// preenchimento e envio do formulario

import { MEDIA_TYPE_CONFIG, resolveMeioCode, getCurrentPIStatus, setCurrentPIStatus } from './config.js';
import { hideUploadGroups } from './upload.js';
import { setSearchMode } from './search.js';
import { API_ENDPOINT } from './config.js';

// referencias dom
const form = document.getElementById('checkingForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressContainer = document.getElementById('progressContainer');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// preenche campos com dados da PI
export function fillFormFields(data) {
    document.getElementById('cliente').value = data.cliente || '';
    document.getElementById('campanha').value = data.campanha || '';
    document.getElementById('produto').value = data.produto || '';
    document.getElementById('periodo').value = data.periodo || '';
    document.getElementById('veiculo').value = data.veiculo || '';

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

// limpa campos
export function clearFormFields() {
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

// envio via xhr (pra barra de progresso)
export function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-btn__text').innerText = 'Enviando...';

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    progressContainer.style.display = 'block';
    progressContainer.classList.add('active');

    const formData = new FormData(form);
    formData.append('action', 'enviar_checking');
    formData.append('is_complemento', getCurrentPIStatus().is_complement);

    if (getCurrentPIStatus().enderecos && getCurrentPIStatus().enderecos.length > 0) {
        formData.append('enderecos_metadata', JSON.stringify(getCurrentPIStatus().enderecos));
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_ENDPOINT, true);

    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = pct + '%';
            progressText.innerText = pct + '%';
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
            setCurrentPIStatus({ can_submit: true, is_complement: false });
            setTimeout(() => {
                progressContainer.style.display = 'none';
                successMessage.style.display = 'none';
            }, 5000);
        } else {
            errorMessage.innerText = 'Erro ao enviar. Tente novamente.';
            errorMessage.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.querySelector('.submit-btn__text').innerText = 'Enviar Checking';
    };

    xhr.onerror = function () {
        errorMessage.innerText = 'Erro de conexão/rede.';
        errorMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.querySelector('.submit-btn__text').innerText = 'Enviar Checking';
    };

    xhr.send(formData);
}
