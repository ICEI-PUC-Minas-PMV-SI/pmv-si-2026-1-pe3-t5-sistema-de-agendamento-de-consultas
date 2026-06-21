document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('sidebar-container');
    if (!container) {
        console.error("Sidebar error: Element #sidebar-container not found on this page.");
        return;
    }

    fetch('components/sidebar/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load sidebar.html: ${response.statusText}`);
            }
            return response.text();
        })
        .then(htmlContent => {
            container.innerHTML = htmlContent;

            highlightActiveLink();

            setupPlaceholderListeners();
        })
});

function highlightActiveLink() {
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);

    document.querySelectorAll('.sidebar .nav-item').forEach(el => {
        el.classList.remove('active');
    });

    if (pageName === 'dashboard.html' || pageName === '') {
        const dashLink = document.getElementById('nav-dashboard');
        if (dashLink) dashLink.classList.add('active');
    } else if (pageName.includes('agenda')) {
        const agendaLink = document.getElementById('nav-agendamentos');
        if (agendaLink) agendaLink.classList.add('active');
    } else if (pageName.includes('paciente')) {
        const pacLink = document.getElementById('nav-pacientes');
        if (pacLink) pacLink.classList.add('active');
    } else if (pageName === 'historico.html' || pageName.includes('historico')) {
        const histLink = document.getElementById('nav-historico');
        if (histLink) histLink.classList.add('active');
    } else if (pageName.includes('perfil')) {
        const perfLink = document.getElementById('nav-perfil');
        if (perfLink) perfLink.classList.add('active');
    }
}

function setupPlaceholderListeners() {
    document.querySelectorAll('.sidebar .nav-placeholder').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const label = link.textContent;
            showToast(`A tela "${label}" está em desenvolvimento pela equipe.`);
        });
    });
}

function showToast(message) {
    const existing = document.querySelector('.odonto-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'odonto-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.background = '#2B5CFF';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
    toast.style.fontFamily = "'Outfit', 'Inter', sans-serif";
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
