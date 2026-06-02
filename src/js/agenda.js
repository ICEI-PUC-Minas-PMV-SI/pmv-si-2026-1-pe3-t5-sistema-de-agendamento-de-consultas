document.addEventListener('DOMContentLoaded', () => {
    OdontoStorage.init();
    bindAgendaEvents();
    populateDentistSelect();
    populatePatientSelect();
    setDefaultDate();
    renderAgenda();
});

function bindAgendaEvents() {
    document.getElementById('dentist-select').addEventListener('change', renderAgenda);
    document.getElementById('agenda-date').addEventListener('change', renderAgenda);
    document.getElementById('refresh-agenda').addEventListener('click', (e) => {
        e.preventDefault();
        renderAgenda();
    });

    const viewDay = document.getElementById('view-day');
    const viewWeek = document.getElementById('view-week');
    viewDay.addEventListener('click', () => switchView('day'));
    viewWeek.addEventListener('click', () => switchView('week'));

    document.getElementById('prev-period').addEventListener('click', (e) => { e.preventDefault(); changePeriod(-1); });
    document.getElementById('next-period').addEventListener('click', (e) => { e.preventDefault(); changePeriod(1); });

    document.getElementById('book-appointment-form').addEventListener('submit', (event) => {
        event.preventDefault();
        handleBookAppointment();
    });
}

function setDefaultDate() {
    const todayInput = document.getElementById('agenda-date');
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    todayInput.value = `${yyyy}-${mm}-${dd}`;
}

function populateDentistSelect() {
    const select = document.getElementById('dentist-select');
    const dentists = OdontoStorage.getDentists();
    select.innerHTML = '';

    dentists.forEach(dentista => {
        const option = document.createElement('option');
        option.value = dentista.idDentista;
        option.textContent = `${dentista.nome} • ${dentista.especialidade}`;
        select.appendChild(option);
    });
}

function populatePatientSelect() {
    const select = document.getElementById('patient-select');
    const patients = OdontoStorage.getPatients();
    select.innerHTML = '';

    patients.forEach(paciente => {
        const option = document.createElement('option');
        option.value = paciente.idPaciente;
        option.textContent = `${paciente.nome} • ${paciente.cpf}`;
        select.appendChild(option);
    });
}

function getSelectedDentistId() {
    return Number(document.getElementById('dentist-select').value);
}

function getSelectedDate() {
    return document.getElementById('agenda-date').value;
}

function renderAgenda() {
    const dentistId = getSelectedDentistId();
    const date = getSelectedDate();
    const currentView = window._odonto_view || 'day';

    if (currentView === 'week') {
        renderWeekView(dentistId, date);
        return;
    }
    // ensure day view elements visible
    const weekContainer = document.getElementById('week-container');
    if (weekContainer) weekContainer.style.display = 'none';
    const slotsTable = document.getElementById('slots-table');
    if (slotsTable) slotsTable.style.display = 'table';

    const appointments = OdontoStorage.getAppointmentsByDentistAndDate(dentistId, date);
    const availableSlots = OdontoStorage.getAvailableSlots(dentistId, date);
    const agenda = OdontoStorage.getAgendaByDentistAndDate(dentistId, date);
    const blockedCount = agenda ? agenda.horariosBloqueados.length : 0;

    document.getElementById('agenda-total').textContent = appointments.length;
    document.getElementById('agenda-free').textContent = availableSlots.length;
    document.getElementById('agenda-blocked').textContent = blockedCount;

    populateSlotSelect(availableSlots);
    renderSlotsTable(dentistId, date, appointments, availableSlots, agenda);
}

function switchView(view) {
    window._odonto_view = view;
    const dayBtn = document.getElementById('view-day');
    const weekBtn = document.getElementById('view-week');
    dayBtn.classList.toggle('btn-primary', view === 'day');
    weekBtn.classList.toggle('btn-primary', view === 'week');
    renderAgenda();
}

function changePeriod(delta) {
    const dateInput = document.getElementById('agenda-date');
    const current = new Date(dateInput.value);
    if (window._odonto_view === 'week') {
        current.setDate(current.getDate() + delta * 7);
    } else {
        current.setDate(current.getDate() + delta);
    }
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    renderAgenda();
}

function renderWeekView(dentistId, date) {
    const start = new Date(date);
    // start week on Monday
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        days.push(`${yyyy}-${mm}-${dd}`);
    }

    const weekContainer = document.getElementById('week-container');
    weekContainer.innerHTML = '';
    const appointments = OdontoStorage.getAppointmentsByDentistAndDateRange(dentistId, days[0], days[6]);
    const agenda = OdontoStorage.getAgendaByDentistAndDate(dentistId, days[0]) || { horariosTodos: [], horariosBloqueados: [] };

    const table = document.createElement('table');
    table.className = 'appointments-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    days.forEach(d => {
        const th = document.createElement('th');
        th.textContent = d;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const horarios = agenda.horariosTodos;
    horarios.forEach(hora => {
        const row = document.createElement('tr');
        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        row.appendChild(tdHora);

        days.forEach(d => {
            const cell = document.createElement('td');
            const consulta = appointments.find(a => a.data === d && a.hora === hora);
            if (consulta) {
                const p = document.createElement('div');
                p.textContent = `${consulta.hora} - ${OdontoStorage.getPatientNameById(consulta.idPaciente)}`;
                p.style.cursor = 'pointer';
                p.addEventListener('click', () => openAppointmentModal(consulta.idConsulta));
                cell.appendChild(p);
            } else if (agenda.horariosBloqueados.includes(hora)) {
                const b = document.createElement('div');
                b.textContent = 'Bloqueado';
                cell.appendChild(b);
            } else {
                cell.textContent = 'Livre';
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    weekContainer.appendChild(table);
    weekContainer.style.display = 'block';

    document.getElementById('slots-table').style.display = 'none';
}

function populateSlotSelect(availableSlots) {
    const select = document.getElementById('slot-select');
    select.innerHTML = '';

    if (availableSlots.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum horário disponível';
        select.appendChild(option);
        select.disabled = true;
        return;
    }

    select.disabled = false;
    availableSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        select.appendChild(option);
    });
}

function renderSlotsTable(dentistId, date, appointments, availableSlots, agenda) {
    const tbody = document.getElementById('slots-tbody');
    tbody.innerHTML = '';

    const horarios = agenda ? agenda.horariosTodos : [];
    const appointmentsByHour = appointments.reduce((acc, consulta) => {
        acc[consulta.hora] = consulta;
        return acc;
    }, {});

    if (horarios.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'Nenhuma agenda cadastrada para este dentista nesta data.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    horarios.forEach(hora => {
        const row = document.createElement('tr');
        const consulta = appointmentsByHour[hora];
        const isBlocked = agenda.horariosBloqueados.includes(hora);
        const isAvailable = availableSlots.includes(hora);

        const tdHora = document.createElement('td');
        tdHora.textContent = hora;
        row.appendChild(tdHora);

        const tdStatus = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'status-badge';

        if (isBlocked) {
            badge.textContent = 'Bloqueado';
            badge.classList.add('bloqueado');
        } else if (consulta) {
            badge.textContent = consulta.status;
            badge.classList.add(consulta.status.toLowerCase());
        } else {
            badge.textContent = 'Livre';
            badge.classList.add('livre');
        }

        tdStatus.appendChild(badge);
        row.appendChild(tdStatus);

        const tdPaciente = document.createElement('td');
        tdPaciente.textContent = consulta ? OdontoStorage.getPatientNameById(consulta.idPaciente) : '-';
        row.appendChild(tdPaciente);

        const tdProcedimento = document.createElement('td');
        tdProcedimento.textContent = consulta ? consulta.tipoConsulta : '-';
        row.appendChild(tdProcedimento);

        const tdActions = document.createElement('td');
        if (consulta) {
            const btnView = document.createElement('button');
            btnView.className = 'btn';
            btnView.textContent = 'Ver';
            btnView.addEventListener('click', () => openAppointmentModal(consulta.idConsulta));

            const btnRes = document.createElement('button');
            btnRes.className = 'btn';
            btnRes.textContent = 'Remarcar';
            btnRes.addEventListener('click', () => rescheduleAppointment(consulta.idConsulta));

            const btnCancel = document.createElement('button');
            btnCancel.className = 'btn';
            btnCancel.textContent = 'Cancelar';
            btnCancel.addEventListener('click', () => cancelAppointment(consulta.idConsulta));

            tdActions.appendChild(btnView);
            tdActions.appendChild(btnRes);
            tdActions.appendChild(btnCancel);
        } else {
            const btnBook = document.createElement('button');
            btnBook.className = 'btn btn-primary';
            btnBook.textContent = 'Agendar';
            btnBook.addEventListener('click', () => {
                document.getElementById('slot-select').value = hora;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            tdActions.appendChild(btnBook);
        }
        row.appendChild(tdActions);

        tbody.appendChild(row);
    });
}

function handleBookAppointment() {
    const dentistId = getSelectedDentistId();
    const date = getSelectedDate();
    const patientId = Number(document.getElementById('patient-select').value);
    const tipoConsulta = document.getElementById('consult-type').value;
    const hora = document.getElementById('slot-select').value;
    const observacoes = document.getElementById('observations-input').value.trim();
    const feedback = document.getElementById('agenda-feedback');

    if (!hora) {
        feedback.textContent = 'Selecione um horário disponível para agendar.';
        feedback.classList.add('feedback-error');
        return;
    }

    if (!OdontoStorage.isSlotAvailable(dentistId, date, hora)) {
        feedback.textContent = 'O horário selecionado não está mais disponível.';
        feedback.classList.add('feedback-error');
        return;
    }

    const appointment = {
        idPaciente: patientId,
        idDentista: dentistId,
        data: date,
        hora,
        tipoConsulta,
        status: 'Pendente',
        observacoes: observacoes
    };

    OdontoStorage.addAppointment(appointment);
    showFeedback('Consulta agendada com sucesso!', false);
    renderAgenda();
}

function showFeedback(message, isError) {
    const feedback = document.getElementById('agenda-feedback');
    feedback.textContent = message;
    feedback.className = `agenda-feedback ${isError ? 'feedback-error' : 'feedback-success'}`;
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'agenda-feedback';
    }, 3000);
}

function openAppointmentModal(idConsulta) {
    const appt = OdontoStorage.getAppointmentById(idConsulta);
    if (!appt) return;
    const modal = document.getElementById('appointment-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = '';
    const paciente = OdontoStorage.getPatientNameById(appt.idPaciente);
    const dentista = OdontoStorage.getDentists().find(d => d.idDentista === appt.idDentista)?.nome || 'Dentista Desconhecido';
    const p1 = document.createElement('p'); p1.textContent = `Paciente: ${paciente}`;
    const p2 = document.createElement('p'); p2.textContent = `Dentista: ${dentista}`;
    const p3 = document.createElement('p'); p3.textContent = `Data: ${appt.data} ${appt.hora}`;
    const p4 = document.createElement('p'); p4.textContent = `Procedimento: ${appt.tipoConsulta}`;
    const p5 = document.createElement('p'); p5.textContent = `Status: ${appt.status}`;
    const p6 = document.createElement('p'); p6.textContent = `Observações: ${appt.observacoes || '-'}`;
    body.appendChild(p1); body.appendChild(p2); body.appendChild(p3); body.appendChild(p4); body.appendChild(p5); body.appendChild(p6);

    modal.style.display = 'flex';

    document.getElementById('modal-close').onclick = closeAppointmentModal;
    document.getElementById('modal-cancel').onclick = () => { cancelAppointment(idConsulta); closeAppointmentModal(); };
    document.getElementById('modal-reschedule').onclick = () => { closeAppointmentModal(); rescheduleAppointment(idConsulta); };
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    modal.style.display = 'none';
}

function cancelAppointment(idConsulta) {
    OdontoStorage.updateAppointment(idConsulta, { status: 'Desmarcado' });
    showFeedback('Consulta cancelada.', false);
    renderAgenda();
}

function rescheduleAppointment(idConsulta) {
    const appt = OdontoStorage.getAppointmentById(idConsulta);
    if (!appt) return;
    const newDate = prompt('Informe a nova data (YYYY-MM-DD):', appt.data);
    if (!newDate) return;
    const newTime = prompt('Informe o novo horário (HH:MM):', appt.hora);
    if (!newTime) return;
    if (!OdontoStorage.isSlotAvailable(appt.idDentista, newDate, newTime)) {
        alert('Horário indisponível. Escolha outro.');
        return;
    }
    OdontoStorage.updateAppointment(idConsulta, { data: newDate, hora: newTime, status: 'Pendente' });
    showFeedback('Consulta remarcada com sucesso.', false);
    renderAgenda();
}
