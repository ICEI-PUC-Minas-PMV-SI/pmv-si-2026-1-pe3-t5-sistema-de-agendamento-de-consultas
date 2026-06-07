let selectedHistoryAppointmentId = null;

document.addEventListener('DOMContentLoaded', () => {
    OdontoStorage.init();
    populateHistoryFilters();
    bindHistoryEvents();
    renderHistory();
});

function bindHistoryEvents() {
    document.getElementById('filter-patient').addEventListener('change', renderHistory);
    document.getElementById('filter-dentist').addEventListener('change', renderHistory);
    document.getElementById('filter-status').addEventListener('change', renderHistory);
    document.getElementById('filter-date').addEventListener('change', renderHistory);
    document.getElementById('history-search').addEventListener('input', renderHistory);

    document.getElementById('clear-filters').addEventListener('click', clearHistoryFilters);
    document.getElementById('history-modal-close').addEventListener('click', closeHistoryModal);
    document.getElementById('mark-realized-button').addEventListener('click', markSelectedAsRealized);
}

function populateHistoryFilters() {
    const patientSelect = document.getElementById('filter-patient');
    const dentistSelect = document.getElementById('filter-dentist');

    patientSelect.innerHTML = '<option value="">Todos</option>';
    dentistSelect.innerHTML = '<option value="">Todos</option>';

    OdontoStorage.getPatients().forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.idPaciente;
        option.textContent = patient.nome;
        patientSelect.appendChild(option);
    });

    OdontoStorage.getDentists().forEach(dentist => {
        const option = document.createElement('option');
        option.value = dentist.idDentista;
        option.textContent = `${dentist.nome} • ${dentist.especialidade}`;
        dentistSelect.appendChild(option);
    });
}

function renderHistory() {
    const records = getFilteredHistoryRecords();

    renderHistorySummary(records);
    renderHistoryTable(records);
}

function getFilteredHistoryRecords() {
    const patientFilter = document.getElementById('filter-patient').value;
    const dentistFilter = document.getElementById('filter-dentist').value;
    const statusFilter = document.getElementById('filter-status').value;
    const dateFilter = document.getElementById('filter-date').value;
    const searchTerm = document.getElementById('history-search').value.trim().toLowerCase();

    let records = buildHistoryFromAppointments();

    if (patientFilter) {
        records = records.filter(record => record.idPaciente === Number(patientFilter));
    }

    if (dentistFilter) {
        records = records.filter(record => record.idDentista === Number(dentistFilter));
    }

    if (statusFilter) {
        records = records.filter(record => record.status === statusFilter);
    }

    if (dateFilter) {
        records = records.filter(record => record.data === dateFilter);
    }

    if (searchTerm) {
        records = records.filter(record => {
            return record.pacienteNome.toLowerCase().includes(searchTerm)
                || record.dentistaNome.toLowerCase().includes(searchTerm)
                || record.tipoConsulta.toLowerCase().includes(searchTerm)
                || (record.observacoes || '').toLowerCase().includes(searchTerm);
        });
    }

    return records.sort((a, b) => {
        if (a.data === b.data) return b.hora.localeCompare(a.hora);
        return b.data.localeCompare(a.data);
    });
}

function buildHistoryFromAppointments() {
    const appointments = OdontoStorage.getAppointmentsWithDetails();

    return appointments.map(appointment => {
        return {
            idConsulta: appointment.idConsulta,
            idPaciente: appointment.idPaciente,
            idDentista: appointment.idDentista,
            pacienteNome: appointment.pacienteNome,
            dentistaNome: appointment.dentistaNome,
            data: appointment.data,
            hora: appointment.hora,
            status: appointment.status,
            tipoConsulta: appointment.tipoConsulta,
            observacoes: appointment.observacoes || '-',
            origem: 'consulta'
        };
    });
}

function renderHistorySummary(records) {
    const total = records.length;
    const done = records.filter(record => record.status === 'Realizado').length;
    const canceled = records.filter(record => ['Desmarcado', 'Cancelado'].includes(record.status)).length;

    document.getElementById('history-total').textContent = total;
    document.getElementById('history-done').textContent = done;
    document.getElementById('history-canceled').textContent = canceled;
}

function renderHistoryTable(records) {
    const tbody = document.getElementById('history-tbody');
    const table = document.getElementById('history-table');
    const noRecords = document.getElementById('no-records');

    tbody.innerHTML = '';

    if (records.length === 0) {
        table.style.display = 'none';
        noRecords.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noRecords.style.display = 'none';

    records.forEach(record => {
        const row = document.createElement('tr');

        row.appendChild(createTextCell(formatDate(record.data)));
        row.appendChild(createTextCell(record.hora));
        row.appendChild(createTextCell(record.pacienteNome));
        row.appendChild(createTextCell(record.dentistaNome));
        row.appendChild(createTextCell(record.tipoConsulta));

        const statusCell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `status-badge ${record.status.toLowerCase()}`;
        badge.textContent = record.status;
        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        const actionsCell = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.className = 'btn';
        viewButton.textContent = 'Ver detalhes';
        viewButton.addEventListener('click', () => openHistoryModal(record.idConsulta));
        actionsCell.appendChild(viewButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function createTextCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text || '-';
    return cell;
}

function openHistoryModal(idConsulta) {
    const appointment = OdontoStorage.getAppointmentById(idConsulta);

    if (!appointment) return;

    selectedHistoryAppointmentId = idConsulta;

    const patientName = OdontoStorage.getPatientNameById(appointment.idPaciente);
    const dentist = OdontoStorage.getDentists().find(d => d.idDentista === appointment.idDentista);
    const dentistName = dentist ? dentist.nome : 'Dentista Desconhecido';

    const body = document.getElementById('history-modal-body');

    body.innerHTML = `
        <p><strong>Paciente:</strong> ${patientName}</p>
        <p><strong>Dentista:</strong> ${dentistName}</p>
        <p><strong>Data:</strong> ${formatDate(appointment.data)}</p>
        <p><strong>Horário:</strong> ${appointment.hora}</p>
        <p><strong>Procedimento:</strong> ${appointment.tipoConsulta}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        <p><strong>Observações:</strong> ${appointment.observacoes || '-'}</p>
    `;

    const markRealizedButton = document.getElementById('mark-realized-button');
    markRealizedButton.style.display = appointment.status === 'Realizado' ? 'none' : 'inline-block';

    document.getElementById('history-modal').style.display = 'flex';
}

function closeHistoryModal() {
    document.getElementById('history-modal').style.display = 'none';
    selectedHistoryAppointmentId = null;
}

function markSelectedAsRealized() {
    if (!selectedHistoryAppointmentId) return;

    const appointment = OdontoStorage.getAppointmentById(selectedHistoryAppointmentId);

    if (!appointment) return;

    OdontoStorage.updateAppointment(selectedHistoryAppointmentId, {
        status: 'Realizado'
    });

    OdontoStorage.addHistoryRecord({
        idPaciente: appointment.idPaciente,
        dataAtendimento: `${appointment.data}T${appointment.hora}:00`,
        descricao: appointment.tipoConsulta,
        procedimentoRealizado: appointment.tipoConsulta,
        observacoesClinicas: appointment.observacoes || 'Atendimento marcado como realizado pelo histórico.'
    });

    closeHistoryModal();
    renderHistory();
}

function clearHistoryFilters() {
    document.getElementById('filter-patient').value = '';
    document.getElementById('filter-dentist').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('history-search').value = '';

    renderHistory();
}

function formatDate(isoDate) {
    if (!isoDate) return '-';

    const date = new Date(`${isoDate}T00:00:00`);

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}