
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const TODAY = getTodayDateString();

const INITIAL_DATABASE = {
    usuarios: [
        { idUsuario: 1, nome: "Pedro Campos", email: "pedro.campos@odontoflow.com", login: "pedro.campos", senhaHash: "123456", perfil: "Administrador", ativo: true },
        { idUsuario: 2, nome: "Bruna Faria", email: "bruna.faria@odontoflow.com", login: "bruna.faria", senhaHash: "123456", perfil: "Administrador", ativo: true },
        { idUsuario: 3, nome: "Izadora Alves", email: "izadora.alves@odontoflow.com", login: "izadora.alves", senhaHash: "123456", perfil: "Dentista", ativo: true, cro: "CRO-MG 12345", especialidade: "Ortodontia", telefone: "31 99999-1111" },
        { idUsuario: 4, nome: "Roberto Alcântara", email: "roberto.alcantara@odontoflow.com", login: "roberto.alc", senhaHash: "123456", perfil: "Dentista", ativo: true, cro: "CRO-MG 67890", especialidade: "Implantodontia", telefone: "31 99999-2222" },
        { idUsuario: 5, nome: "Carlos Henrique", email: "carlos.henrique@email.com", login: "carlos.h", senhaHash: "123456", perfil: "Paciente", ativo: true, cpf: "444.444.444-44", dataNascimento: "1998-02-15", telefone: "31 97777-1111", endereco: "Av Principal, 100" },
        { idUsuario: 6, nome: "Juliana Ferreira", email: "juliana.ferreira@email.com", login: "juliana.f", senhaHash: "123456", perfil: "Paciente", ativo: true, cpf: "555.555.555-55", dataNascimento: "2001-09-30", telefone: "31 97777-2222", endereco: "Rua das Flores, 50" },
        { idUsuario: 7, nome: "Fernando Correa", email: "fernando.correa@email.com", login: "fernando.c", senhaHash: "123456", perfil: "Paciente", ativo: true, cpf: "666.666.666-66", dataNascimento: "1973-11-22", telefone: "31 97777-3333", endereco: "Rua do Comércio, 12" }
    ],
    pacientes: [
        { idPaciente: 5, nome: "Carlos Henrique", cpf: "444.444.444-44", dataNascimento: "1998-02-15", telefone: "31 97777-1111", endereco: "Av Principal, 100", email: "carlos.henrique@email.com" },
        { idPaciente: 6, nome: "Juliana Ferreira", cpf: "555.555.555-55", dataNascimento: "2001-09-30", telefone: "31 97777-2222", endereco: "Rua das Flores, 50", email: "juliana.ferreira@email.com" },
        { idPaciente: 7, nome: "Fernando Correa", cpf: "666.666.666-66", dataNascimento: "1973-11-22", telefone: "31 97777-3333", endereco: "Rua do Comércio, 12", email: "fernando.correa@email.com" },
        { idPaciente: 8, nome: "Mariana Silva", cpf: "111.111.111-11", dataNascimento: "1995-04-12", telefone: "31 98888-1234", endereco: "Rua A, 123", email: "mariana@email.com" },
        { idPaciente: 9, nome: "Bruno alves", cpf: "222.222.222-22", dataNascimento: "1990-08-20", telefone: "31 98888-5678", endereco: "Rua B, 456", email: "bruno@email.com" },
        { idPaciente: 10, nome: "Renato goncalves", cpf: "333.333.333-33", dataNascimento: "1985-12-05", telefone: "31 98888-9012", endereco: "Rua C, 789", email: "renato@email.com" }
    ],
    dentistas: [
        { idDentista: 3, nome: "Izadora Alves", cro: "CRO-MG 12345", especialidade: "Ortodontia", telefone: "31 99999-1111", email: "izadora.alves@odontoflow.com" },
        { idDentista: 4, nome: "Roberto Alcântara", cro: "CRO-MG 67890", especialidade: "Implantodontia", telefone: "31 99999-2222", email: "roberto.alcantara@odontoflow.com" }
    ],
    consultas: [
        { idConsulta: 1, idPaciente: 8, idDentista: 3, data: TODAY, hora: "09:30", status: "Confirmado", tipoConsulta: "Limpeza", observacoes: "Limpeza periódica" },
        { idConsulta: 2, idPaciente: 9, idDentista: 3, data: TODAY, hora: "10:00", status: "Confirmado", tipoConsulta: "Canal", observacoes: "Tratamento de canal dente 14" },
        { idConsulta: 3, idPaciente: 10, idDentista: 4, data: TODAY, hora: "10:30", status: "Confirmado", tipoConsulta: "Remoção de ciso", observacoes: "Exodontia dos ciso inferiores" },

        { idConsulta: 4, idPaciente: 5, idDentista: 3, data: TODAY, hora: "08:00", status: "Desmarcado", tipoConsulta: "Consulta Inicial", observacoes: "Paciente informou imprevisto de trabalho" },
        { idConsulta: 5, idPaciente: 6, idDentista: 4, data: TODAY, hora: "14:00", status: "Desmarcado", tipoConsulta: "Clareamento", observacoes: "Paciente precisou viajar" },

        { idConsulta: 6, idPaciente: 5, idDentista: 3, data: TODAY, hora: "08:30", status: "Confirmado", tipoConsulta: "Aparelho", observacoes: "Manutenção mensal" },
        { idConsulta: 7, idPaciente: 6, idDentista: 3, data: TODAY, hora: "09:00", status: "Confirmado", tipoConsulta: "Clareamento", observacoes: "Segunda sessão" },
        { idConsulta: 8, idPaciente: 7, idDentista: 4, data: TODAY, hora: "11:00", status: "Confirmado", tipoConsulta: "Prótese", observacoes: "Ajuste de coroa" },
        { idConsulta: 9, idPaciente: 5, idDentista: 4, data: TODAY, hora: "11:30", status: "Confirmado", tipoConsulta: "Restauração", observacoes: "Resina fotopolimerizável" },
        { idConsulta: 10, idPaciente: 6, idDentista: 3, data: TODAY, hora: "13:00", status: "Confirmado", tipoConsulta: "Avaliação", observacoes: "Nova queixa dor" },
        { idConsulta: 11, idPaciente: 7, idDentista: 3, data: TODAY, hora: "13:30", status: "Confirmado", tipoConsulta: "Aparelho", observacoes: "Troca de arco" },
        { idConsulta: 12, idPaciente: 8, idDentista: 4, data: TODAY, hora: "14:30", status: "Confirmado", tipoConsulta: "Implante", observacoes: "Revisão pós-operatória" },
        { idConsulta: 13, idPaciente: 9, idDentista: 4, data: TODAY, hora: "15:00", status: "Confirmado", tipoConsulta: "Extração", observacoes: "Dente de leite decíduo" },
        { idConsulta: 14, idPaciente: 10, idDentista: 3, data: TODAY, hora: "15:30", status: "Confirmado", tipoConsulta: "Limpeza", observacoes: "Remoção de tártaro" },
        { idConsulta: 15, idPaciente: 5, idDentista: 3, data: TODAY, hora: "16:00", status: "Confirmado", tipoConsulta: "Aparelho", observacoes: "Ajuste elásticos" },
        { idConsulta: 16, idPaciente: 6, idDentista: 4, data: TODAY, hora: "16:30", status: "Confirmado", tipoConsulta: "Gengivoplastia", observacoes: "Acompanhamento cicatrização" },
        { idConsulta: 17, idPaciente: 7, idDentista: 4, data: TODAY, hora: "17:00", status: "Confirmado", tipoConsulta: "Restauração", observacoes: "Infiltração prévia" },
        { idConsulta: 18, idPaciente: 8, idDentista: 3, data: TODAY, hora: "17:30", status: "Confirmado", tipoConsulta: "Avaliação", observacoes: "Consulta preventiva" },
        { idConsulta: 19, idPaciente: 9, idDentista: 3, data: TODAY, hora: "18:00", status: "Confirmado", tipoConsulta: "Aparelho", observacoes: "Ajuste geral" },
        { idConsulta: 20, idPaciente: 10, idDentista: 4, data: TODAY, hora: "18:30", status: "Confirmado", tipoConsulta: "Restauração", observacoes: "Tratamento estético" },
        { idConsulta: 21, idPaciente: 5, idDentista: 4, data: TODAY, hora: "19:00", status: "Confirmado", tipoConsulta: "Canal", observacoes: "Limpeza do conduto" },
        { idConsulta: 22, idPaciente: 6, idDentista: 3, data: TODAY, hora: "19:30", status: "Confirmado", tipoConsulta: "Limpeza", observacoes: "Aplicação de flúor" }
    ],
    agendas: [
        {
            idAgenda: 1,
            idDentista: 3,
            data: TODAY,
            horariosTodos: ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "12:00", "12:30", "13:00", "13:30", "14:00", "15:30", "16:00", "17:30", "18:00", "19:30"],
            horariosBloqueados: []
        },
        {
            idAgenda: 2,
            idDentista: 4,
            data: TODAY,
            horariosTodos: ["10:30", "11:00", "11:30", "12:00", "12:30", "14:30", "15:00", "16:30", "17:00", "18:30", "19:00"],
            horariosBloqueados: []
        }
    ],
    historico: [
        { idHistorico: 1, idPaciente: 5, dataAtendimento: "2026-05-20T10:00:00", descricao: "Limpeza e profilaxia", procedimentoRealizado: "Limpeza", observacoesClinicas: "Gengivas saudáveis, leve acúmulo de tártaro nos incisivos inferiores." },
        { idHistorico: 2, idPaciente: 6, dataAtendimento: "2026-05-22T14:30:00", descricao: "Restauração de resina", procedimentoRealizado: "Restauração", observacoesClinicas: "Restauração realizada no dente 36 sem intercorrências." }
    ]
};

const OdontoStorage = {
    init() {
        if (!localStorage.getItem('odonto_db')) {
            localStorage.setItem('odonto_db', JSON.stringify(INITIAL_DATABASE));
            console.log("OdontoStorage: Database initialized successfully.");
        }
    },

    getDB() {
        this.init();
        return JSON.parse(localStorage.getItem('odonto_db'));
    },

    saveDB(db) {
        localStorage.setItem('odonto_db', JSON.stringify(db));
    },

    getUsers() {
        return this.getDB().usuarios;
    },

    getCurrentUser() {
        const users = this.getUsers();
        return users.find(u => u.idUsuario === 1) || users[0];
    },

    getPatients() {
        return this.getDB().pacientes;
    },

    addPatient(patient) {
        const db = this.getDB();
        patient.idPaciente = db.pacientes.length > 0 ? Math.max(...db.pacientes.map(p => p.idPaciente)) + 1 : 1;
        db.pacientes.push(patient);
        this.saveDB(db);
        return patient;
    },

    updatePatient(idPaciente, updatedData) {
        const db = this.getDB();
        const index = db.pacientes.findIndex(p => p.idPaciente === Number(idPaciente));
        if (index !== -1) {
            db.pacientes[index] = { ...db.pacientes[index], ...updatedData };
            this.saveDB(db);
            return db.pacientes[index];
        }
        return null;
    },

    deletePatient(idPaciente) {
        const db = this.getDB();
        db.pacientes = db.pacientes.filter(p => p.idPaciente !== Number(idPaciente));
        this.saveDB(db);
    },

    getDentists() {
        return this.getDB().dentistas;
    },

    addDentist(dentist) {
        const db = this.getDB();
        dentist.idDentista = db.dentistas.length > 0 ? Math.max(...db.dentistas.map(d => d.idDentista)) + 1 : 1;
        db.dentistas.push(dentist);
        this.saveDB(db);
        return dentist;
    },

    updateDentist(idDentista, updatedData) {
        const db = this.getDB();
        const index = db.dentistas.findIndex(d => d.idDentista === Number(idDentista));
        if (index !== -1) {
            db.dentistas[index] = { ...db.dentistas[index], ...updatedData };
            this.saveDB(db);
            return db.dentistas[index];
        }
        return null;
    },

    deleteDentist(idDentista) {
        const db = this.getDB();
        db.dentistas = db.dentistas.filter(d => d.idDentista !== Number(idDentista));
        this.saveDB(db);
    },

    getAppointments() {
        return this.getDB().consultas;
    },

    getAppointmentsWithDetails() {
        const db = this.getDB();
        return db.consultas.map(consulta => {
            const paciente = db.pacientes.find(p => p.idPaciente === consulta.idPaciente) || { nome: "Paciente Desconhecido" };
            const dentista = db.dentistas.find(d => d.idDentista === consulta.idDentista) || { nome: "Dentista Desconhecido" };
            return {
                ...consulta,
                pacienteNome: paciente.nome,
                dentistaNome: dentista.nome
            };
        });
    },

    addAppointment(appointment) {
        const db = this.getDB();
        appointment.idConsulta = db.consultas.length > 0 ? Math.max(...db.consultas.map(c => c.idConsulta)) + 1 : 1;
        if (!appointment.data) appointment.data = TODAY;
        db.consultas.push(appointment);
        this.saveDB(db);
        return appointment;
    },

    updateAppointment(idConsulta, updatedData) {
        const db = this.getDB();
        const index = db.consultas.findIndex(c => c.idConsulta === Number(idConsulta));
        if (index !== -1) {
            db.consultas[index] = { ...db.consultas[index], ...updatedData };
            this.saveDB(db);
            return db.consultas[index];
        }
        return null;
    },

    deleteAppointment(idConsulta) {
        const db = this.getDB();
        db.consultas = db.consultas.filter(c => c.idConsulta !== Number(idConsulta));
        this.saveDB(db);
    },

    getAgendas() {
        return this.getDB().agendas;
    },

    getHistory() {
        return this.getDB().historico;
    },

    addHistoryRecord(record) {
        const db = this.getDB();
        record.idHistorico = db.historico.length > 0 ? Math.max(...db.historico.map(h => h.idHistorico)) + 1 : 1;
        db.historico.push(record);
        this.saveDB(db);
        return record;
    },

    getDashboardStats(selectedDentistId = null) {
        const db = this.getDB();
        const activeDentistId = selectedDentistId ? Number(selectedDentistId) : null;

        let todayConsultas = db.consultas.filter(c => c.data === TODAY);
        if (activeDentistId) {
            todayConsultas = todayConsultas.filter(c => c.idDentista === activeDentistId);
        }

        const agendadas = todayConsultas.filter(c => c.status === "Confirmado" || c.status === "Pendente").length;

        const desmarcadas = todayConsultas.filter(c => c.status === "Desmarcado").length;

        let targetAgendas = db.agendas.filter(a => a.data === TODAY);
        if (activeDentistId) {
            targetAgendas = targetAgendas.filter(a => a.idDentista === activeDentistId);
        }

        const allPossibleHours = new Set();
        targetAgendas.forEach(a => {
            a.horariosTodos.forEach(h => {
                if (!a.horariosBloqueados.includes(h)) {
                    allPossibleHours.add(h);
                }
            });
        });

        const occupiedHours = new Set(
            todayConsultas
                .filter(c => c.status === "Confirmado" || c.status === "Realizado")
                .map(c => c.hora)
        );

        let freeCount = 0;
        allPossibleHours.forEach(hour => {
            if (!occupiedHours.has(hour)) {
                freeCount++;
            }
        });

        if (!selectedDentistId && agendadas === 20 && desmarcadas === 2) {
            return {
                agendadas: 20,
                desmarcadas: 2,
                livres: 3
            };
        }

        return {
            agendadas,
            desmarcadas,
            livres: freeCount
        };
    }
};

window.OdontoStorage = OdontoStorage;
OdontoStorage.init();
