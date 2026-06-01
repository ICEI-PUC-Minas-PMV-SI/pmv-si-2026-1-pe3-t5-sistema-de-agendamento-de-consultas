document.addEventListener('DOMContentLoaded', () => {
    OdontoStorage.init();
    renderDashboard();
});

function renderDashboard() {
    renderStats();
    renderAppointmentsTable();
}

function renderStats() {
    const stats = OdontoStorage.getDashboardStats();

    document.getElementById('val-agendadas').textContent = stats.agendadas;
    document.getElementById('val-desmarcadas').textContent = stats.desmarcadas;
    document.getElementById('val-livres').textContent = stats.livres;
}

function renderAppointmentsTable() {
    const tbody = document.getElementById('appointments-tbody');
    const noRecords = document.getElementById('no-records');
    const tableElement = document.getElementById('appointments-table');

    if (!tbody) return;

    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    const TODAY_DATE = (() => {
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    })();

    const appointments = OdontoStorage.getAppointmentsWithDetails();

    const upcoming = appointments
        .filter(c => c.data === TODAY_DATE && (c.status === 'Confirmado' || c.status === 'Pendente'))
        .sort((a, b) => a.hora.localeCompare(b.hora))
        .slice(0, 5);
    tbody.innerHTML = '';

    if (upcoming.length === 0) {
        tableElement.style.display = 'none';
        noRecords.style.display = 'block';
        return;
    }

    tableElement.style.display = 'table';
    noRecords.style.display = 'none';

    upcoming.forEach(consulta => {
        const row = document.createElement('tr');

        const tdHora = document.createElement('td');
        tdHora.textContent = consulta.hora;
        row.appendChild(tdHora);

        const tdPaciente = document.createElement('td');
        tdPaciente.textContent = consulta.pacienteNome;
        row.appendChild(tdPaciente);

        const tdProcedimento = document.createElement('td');
        tdProcedimento.textContent = consulta.tipoConsulta;
        row.appendChild(tdProcedimento);

        const tdStatus = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `status-badge ${consulta.status.toLowerCase()}`;
        badge.textContent = consulta.status;
        tdStatus.appendChild(badge);
        row.appendChild(tdStatus);

        tbody.appendChild(row);
    });
}
