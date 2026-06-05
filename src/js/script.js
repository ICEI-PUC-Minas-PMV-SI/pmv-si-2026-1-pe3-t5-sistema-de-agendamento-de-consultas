let horarioSelecionado = "";

const horarios =
document.querySelectorAll(".horario");

const dataConsulta =
document.getElementById("dataConsulta");

dataConsulta.min =
new Date().toISOString().split("T")[0];

horarios.forEach(botao => {

    botao.addEventListener("click", () => {

        horarios.forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        horarioSelecionado =
        botao.textContent;

    });

});

document
.getElementById("btnConfirmar")
.addEventListener("click", () => {

    const paciente =
    document.getElementById("paciente").value;

    const dentista =
    document.getElementById("dentista").value;

    const data =
    document.getElementById("dataConsulta").value;

    const tipo =
    document.getElementById("tipoConsulta").value;

    if(
        paciente === "" ||
        dentista === "" ||
        data === "" ||
        tipo === "" ||
        horarioSelecionado === ""
    ){
        alert("Preencha todos os campos.");
        return;
    }

    alert("Consulta agendada com sucesso!");
});
