const form = document.getElementById('form');
const tabela = document.getElementById('tabela');
const listaLateral = document.getElementById('lista-lateral');

let ultimosNomes = [];
let linhaEditando = null;

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = sanitize(document.getElementById('nome').value.trim());
  const sobrenome = sanitize(document.getElementById('sobrenome').value.trim());
  const email = sanitize(document.getElementById('email').value.trim());
  const telefone = sanitize(document.getElementById('telefone').value.trim());
  const idade = parseInt(document.getElementById('idade').value.trim());
  const endereco = sanitize(document.getElementById('endereco').value.trim());

  if (!nome || !sobrenome || !email || !telefone || !endereco || isNaN(idade) || idade < 10 || idade > 120) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  if (!validarEmail(email)) {
    alert('Email inválido!');
    return;
  }

  const nomeCompleto = `${nome} ${sobrenome}`;

  if (linhaEditando) {
    editarLinha(nomeCompleto, email, telefone, idade, endereco);
  } else {
    adicionarParticipante(nomeCompleto, email, telefone, idade, endereco);
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

function adicionarParticipante(nomeCompleto, email, telefone, idade, endereco) {
  const linha = document.createElement('tr');
  linha.innerHTML = `
    <td>${nomeCompleto}</td>
    <td>${email}</td>
    <td>${telefone}</td>
    <td>${idade}</td>
    <td>${endereco}</td>
    <td class="actions">
      <i class="fa-solid fa-pen" title="Editar"></i>
      <i class="fa-solid fa-trash" title="Excluir"></i>
    </td>
  `;
  tabela.appendChild(linha);
  ultimosNomes.unshift(nomeCompleto);
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

function editarLinha(nomeCompleto, email, telefone, idade, endereco) {
  linhaEditando.children[0].textContent = nomeCompleto;
  linhaEditando.children[1].textContent = email;
  linhaEditando.children[2].textContent = telefone;
  linhaEditando.children[3].textContent = idade;
  linhaEditando.children[4].textContent = endereco;

  const nomeOriginal = linhaEditando.dataset.nomeOriginal;
  const index = ultimosNomes.indexOf(nomeOriginal);
  if (index !== -1) ultimosNomes[index] = nomeCompleto;
  atualizarLista();
}

tabela.addEventListener('click', function (e) {
  const icon = e.target;
  const linha = icon.closest('tr');

  if (icon.classList.contains('fa-trash')) {
    const nomeRemovido = linha.children[0].textContent;
    ultimosNomes = ultimosNomes.filter(n => n !== nomeRemovido);
    linha.remove();
    atualizarLista();
  }

  if (icon.classList.contains('fa-pen')) {
    const [nomeCompleto, email, telefone, idade, endereco] = Array.from(linha.children).map(td => td.textContent);
    const [nome, ...sobrenomeArray] = nomeCompleto.split(' ');
    const sobrenome = sobrenomeArray.join(' ');

    document.getElementById('nome').value = nome;
    document.getElementById('sobrenome').value = sobrenome;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    document.getElementById('idade').value = idade;
    document.getElementById('endereco').value = endereco;

    linhaEditando = linha;
    linhaEditando.dataset.nomeOriginal = nomeCompleto;
  }
});
