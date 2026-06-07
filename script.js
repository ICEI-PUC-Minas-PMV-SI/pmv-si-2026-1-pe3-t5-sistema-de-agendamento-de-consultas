function avancar() {
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');

  if (!nome || !email || !senha) return;

  const valorNome = nome.value.trim();
  const valorEmail = email.value.trim();
  const valorSenha = senha.value.trim();

  if (!valorNome) {
    destacarCampoErro(nome);
    alert('Por favor, preencha o campo NOME.');
    return;
  }

  if (!validarEmail(valorEmail)) {
    destacarCampoErro(email);
    alert('Por favor, insira um E-MAIL válido.');
    return;
  }

  if (valorSenha.length < 6) {
    destacarCampoErro(senha);
    alert('A SENHA deve ter pelo menos 6 caracteres.');
    return;
  }

  alert('Conta criada com sucesso! Faça login para continuar.');
  window.location.href = 'entrar.html';
}

function avancarLogin() {
  const emailLogin = document.getElementById('emailLogin');
  const senhaLogin = document.getElementById('senhaLogin');

  if (!emailLogin || !senhaLogin) return;

  const valorEmail = emailLogin.value.trim();
  const valorSenha = senhaLogin.value.trim();

  if (!validarEmail(valorEmail)) {
    destacarCampoErro(emailLogin);
    alert('Por favor, insira um E-MAIL válido.');
    return;
  }

  if (valorSenha.length < 6) {
    destacarCampoErro(senhaLogin);
    alert('A SENHA deve ter pelo menos 6 caracteres.');
    return;
  }

  alert('Login realizado com sucesso! Bem-vindo ao OdontoFlow.');
}

function validarEmail(endereco) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(endereco);
}

function destacarCampoErro(campo) {
  campo.style.borderColor = '#e03c3c';
  campo.focus();

  setTimeout(() => {
    campo.style.borderColor = '';
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  const todosCampos = document.querySelectorAll('.campo');
  todosCampos.forEach(campo => {
    campo.addEventListener('input', () => {
      campo.style.borderColor = '';
    });
  });
});
