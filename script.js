const form = document.getElementById('form');
const tabela = document.getElementById('tabela');
const listaLateral = document.getElementById('lista-lateral');

let ultimosNomes = [];
let linhaEditando = null;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = sanitize(document.getElementById('nome').value.trim());
  const email = sanitize(document.getElementById('email').value.trim());
  const idade = parseInt(document.getElementById('idade').value.trim());

  if (!nome || !email || isNaN(idade) || idade < 10 || idade > 120) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  if (!validarEmail(email)) {
    alert('Email inválido!');
    return;
  }

  if (linhaEditando) {
    editarLinha(nome, email, idade);
  } else {
    adicionarParticipante(nome, email, idade);
  }

  form.reset();
  linhaEditando = null;
});

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function sanitize(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function adicionarParticipante(nome, email, idade) {
  const linha = document.createElement('tr');
  linha.innerHTML = `
    <td>${nome}</td>
    <td>${email}</td>
    <td>${idade}</td>
    <td class="actions">
      <i class="fa-solid fa-pen" title="Editar"></i>
      <i class="fa-solid fa-trash" title="Excluir"></i>
    </td>
  `;
  tabela.appendChild(linha);
  ultimosNomes.unshift(nome);
  if (ultimosNomes.length > 5) ultimosNomes.pop();
  atualizarLista();
}

function atualizarLista() {
  listaLateral.innerHTML = '';
  ultimosNomes.forEach(nome => {
    const li = document.createElement('li');
    li.textContent = nome;
    listaLateral.appendChild(li);
  });
}

function editarLinha(nome, email, idade) {
  linhaEditando.children[0].textContent = nome;
  linhaEditando.children[1].textContent = email;
  linhaEditando.children[2].textContent = idade;

  const nomeOriginal = linhaEditando.dataset.nomeOriginal;
  const index = ultimosNomes.indexOf(nomeOriginal);
  if (index !== -1) ultimosNomes[index] = nome;
  atualizarLista();
}

tabela.addEventListener('click', function (e) {
  const icon = e.target;
  const linha = icon.closest('tr');

  if (icon.classList.contains('fa-trash')) {
    const nomeRemovido = linha.querySelector('td').textContent;
    ultimosNomes = ultimosNomes.filter(n => n !== nomeRemovido);
    linha.remove();
    atualizarLista();
  }

  if (icon.classList.contains('fa-pen')) {
    const [nome, email, idade] = Array.from(linha.children).map(td => td.textContent);
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('idade').value = idade;
    linhaEditando = linha;
    linhaEditando.dataset.nomeOriginal = nome;
  }
});
