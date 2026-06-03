
document.addEventListener('DOMContentLoaded', () => {
    OdontoStorage.init();
    initPerfil();
});

function initPerfil() {
    loadUserData();
    loadPreferences();
    bindPasswordEvents();
    bindInfoEditEvents();
    bindPreferenceToggles();
    bindSairEvents();
    bindEyeButtons();
}


function loadUserData() {
    const user = OdontoStorage.getCurrentUser();
    if (!user) return;

   
    setInputValue('input-nome', user.nome || '');
    setInputValue('input-email', user.email || '');
    setInputValue('input-perfil', user.perfil || '');

   
    const initialsEl = document.getElementById('perfil-avatar-initials');
    if (initialsEl && user.nome) {
        const parts = user.nome.trim().split(' ');
        const initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
        initialsEl.textContent = initials;
    }

   
    const badge = document.getElementById('logged-user');
    if (badge && user.nome) {
        badge.textContent = `${user.perfil || 'Usuário'}: ${user.nome}`;
    }
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}


function bindInfoEditEvents() {
    const btnEdit   = document.getElementById('btn-edit-info');
    const btnSave   = document.getElementById('btn-save-info');
    const btnCancel = document.getElementById('btn-cancel-info');

    if (!btnEdit) return;

    btnEdit.addEventListener('click', () => enterEditMode());
    btnCancel.addEventListener('click', () => exitEditMode(false));
    btnSave.addEventListener('click', () => saveUserInfo());
}

let _originalValues = {};

function enterEditMode() {
    const ids = ['input-nome', 'input-email'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            _originalValues[id] = el.value;
            el.removeAttribute('readonly');
            el.focus && (id === 'input-nome' ? el.focus() : null);
        }
    });

    toggle('btn-edit-info', false);
    toggle('btn-save-info', true);
    toggle('btn-cancel-info', true);
}

function exitEditMode(saved) {
    const ids = ['input-nome', 'input-email'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (!saved) el.value = _originalValues[id] || el.value;
            el.setAttribute('readonly', true);
        }
    });

    toggle('btn-edit-info', true);
    toggle('btn-save-info', false);
    toggle('btn-cancel-info', false);

    if (!saved) clearFeedback('info-feedback');
}

function saveUserInfo() {
    const nome  = document.getElementById('input-nome')?.value?.trim();
    const email = document.getElementById('input-email')?.value?.trim();

    if (!nome) {
        showFeedback('info-feedback', 'O nome não pode estar vazio.', true);
        return;
    }

    if (!isValidEmail(email)) {
        showFeedback('info-feedback', 'Informe um e-mail válido.', true);
        return;
    }

  
    const user = OdontoStorage.getCurrentUser();
    if (user) {
        const db = OdontoStorage.getDB();
        const idx = db.usuarios.findIndex(u => u.idUsuario === user.idUsuario);
        if (idx !== -1) {
            db.usuarios[idx].nome  = nome;
            db.usuarios[idx].email = email;
            OdontoStorage.saveDB(db);
        }
    }

   
    const initialsEl = document.getElementById('perfil-avatar-initials');
    if (initialsEl && nome) {
        const parts = nome.split(' ');
        const initials = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].substring(0, 2).toUpperCase();
        initialsEl.textContent = initials;
    }

  
    const badge = document.getElementById('logged-user');
    if (badge) {
        const perfil = document.getElementById('input-perfil')?.value || 'Usuário';
        badge.textContent = `${perfil}: ${nome}`;
    }

    showFeedback('info-feedback', 'Informações salvas com sucesso!', false);
    exitEditMode(true);
}


function bindPasswordEvents() {
    const form = document.getElementById('form-senha');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSavePassword();
    });

  
    const senhaNovaInput = document.getElementById('senha-nova');
    if (senhaNovaInput) {
        senhaNovaInput.addEventListener('input', () => {
            updatePasswordStrength(senhaNovaInput.value);
        });
    }
}

function handleSavePassword() {
    const senhaAtual    = document.getElementById('senha-atual')?.value;
    const senhaNova     = document.getElementById('senha-nova')?.value;
    const senhaConfirm  = document.getElementById('senha-confirmar')?.value;

    if (!senhaAtual || !senhaNova || !senhaConfirm) {
        showFeedback('senha-feedback', 'Preencha todos os campos.', true);
        return;
    }


    const user = OdontoStorage.getCurrentUser();
    if (user && user.senhaHash !== senhaAtual) {
        showFeedback('senha-feedback', 'Senha atual incorreta.', true);
        return;
    }

    if (senhaNova.length < 6) {
        showFeedback('senha-feedback', 'A nova senha deve ter ao menos 6 caracteres.', true);
        return;
    }

    if (senhaNova !== senhaConfirm) {
        showFeedback('senha-feedback', 'As senhas não coincidem.', true);
        return;
    }

  
    if (user) {
        const db = OdontoStorage.getDB();
        const idx = db.usuarios.findIndex(u => u.idUsuario === user.idUsuario);
        if (idx !== -1) {
            db.usuarios[idx].senhaHash = senhaNova;
            OdontoStorage.saveDB(db);
        }
    }


    ['senha-atual', 'senha-nova', 'senha-confirmar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const strengthEl = document.getElementById('senha-strength');
    if (strengthEl) strengthEl.style.display = 'none';

    showFeedback('senha-feedback', 'Senha alterada com sucesso!', false);
}

function updatePasswordStrength(senha) {
    const strengthEl = document.getElementById('senha-strength');
    const fillEl     = document.getElementById('strength-fill');
    const labelEl    = document.getElementById('strength-label');

    if (!strengthEl || !fillEl || !labelEl) return;

    if (!senha) {
        strengthEl.style.display = 'none';
        return;
    }

    strengthEl.style.display = 'flex';

    let score = 0;
    if (senha.length >= 6)  score++;
    if (senha.length >= 10) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[0-9]/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;

    const levels = [
        { pct: '20%',  color: '#EF4444', label: 'Fraca',   textColor: '#EF4444' },
        { pct: '40%',  color: '#F59E0B', label: 'Razoável', textColor: '#D97706' },
        { pct: '60%',  color: '#F59E0B', label: 'Média',   textColor: '#D97706' },
        { pct: '80%',  color: '#10B981', label: 'Boa',     textColor: '#047857' },
        { pct: '100%', color: '#059669', label: 'Forte',   textColor: '#065F46' },
    ];

    const level = levels[Math.min(score - 1, 4)] || levels[0];
    fillEl.style.width           = level.pct;
    fillEl.style.backgroundColor = level.color;
    labelEl.textContent          = level.label;
    labelEl.style.color          = level.textColor;
}


function bindEyeButtons() {
    document.querySelectorAll('.perfil-eye-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.style.color = input.type === 'text' ? '#2B5CFF' : '#94A3B8';
        });
    });
}

/

const PREF_STORAGE_KEY = 'odonto_perfil_prefs';

function loadPreferences() {
    const saved = localStorage.getItem(PREF_STORAGE_KEY);
    const prefs = saved ? JSON.parse(saved) : {
        notificacoes: true,
        relatorios: true,
        novidades: true
    };

    Object.entries(prefs).forEach(([key, value]) => {
        setToggleState(key, value);
    });
}

function bindPreferenceToggles() {
    document.querySelectorAll('.pref-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const pref = toggle.getAttribute('data-pref');
            const isActive = toggle.classList.contains('active');
            setToggleState(pref, !isActive);
            savePreferences();
        });

        
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    });
}

function setToggleState(pref, active) {
    const toggleEl = document.getElementById(`toggle-${pref}`);
    const checkEl  = document.getElementById(`check-${pref}`);

    if (toggleEl) {
        toggleEl.classList.toggle('active', active);
        toggleEl.setAttribute('aria-checked', String(active));
    }

    if (checkEl) {
        checkEl.classList.toggle('inactive', !active);
    }
}

function savePreferences() {
    const prefs = {};
    document.querySelectorAll('.pref-toggle').forEach(toggle => {
        const pref = toggle.getAttribute('data-pref');
        prefs[pref] = toggle.classList.contains('active');
    });
    localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(prefs));
}


function bindSairEvents() {
    const btnSair   = document.getElementById('btn-sair');
    const modal     = document.getElementById('modal-sair');
    const btnConfirm = document.getElementById('modal-sair-confirm');
    const btnCancel  = document.getElementById('modal-sair-cancel');
    const backdrop   = modal?.querySelector('.perfil-modal-backdrop');

    if (!btnSair || !modal) return;

    btnSair.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    btnCancel.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    backdrop?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    btnConfirm.addEventListener('click', () => {
        
        modal.style.display = 'none';
        
        window.location.href = 'dashboard.html';
    });
}


function toggle(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? '' : 'none';
}

function showFeedback(id, message, isError) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent  = message;
    el.className    = `perfil-feedback ${isError ? 'error' : 'success'}`;

    clearTimeout(el._feedbackTimer);
    el._feedbackTimer = setTimeout(() => clearFeedback(id), 4000);
}

function clearFeedback(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.className   = 'perfil-feedback';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}
