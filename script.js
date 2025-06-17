document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-catalogo2');
    const formEditar = document.getElementById('form-editar');
    const lista = document.getElementById('listaItens');

    const contador = {
        Colorama: 0,
        Impala: 0,
        Dailus: 0,
        Revlon: 0,
        Risqué: 0
    };

    let linhaEmEdicao = null;

    function atualizarContador(marca) {
        const contadorElemento = document.getElementById(`contador-${marca}`);
        if (contadorElemento) {
            contadorElemento.textContent = contador[marca] || 0;
        }
    }
window.addEventListener('DOMContentLoaded', () => {
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=&quot;tooltip&quot;]'));
tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
});

function mostrarAlerta(mensagem, tipo = 'success'){
    const alerta = document.getElementById('alerta');
    const alertaTexto= document.getElementById('alertaTexto');

    alertaTexto.innerText = mensagem;
    alerta.className = `alert alert-${tipo} alert-dismissible fade sho`;
    alerta.classList.remove('d-none');

    setTimeout(() => alerta.classList.add('d-none'),3000);
}

    function salvarDados() {
        const itens = [];
        lista.querySelectorAll('tr').forEach(linha => {
            const codigo = linha.children[0].textContent.trim();
            const nome = linha.children[1].textContent.trim();
            const marca = linha.children[2].textContent.trim();
            itens.push({ codigo, nome, marca });
        });
        localStorage.setItem('catalogoEsmaltes', JSON.stringify(itens));
        document.getElementById('submit').addEventListener('change', mostrarAlerta('Item cadastrado com sucesso!'));
    }

    function carregarDados() {
        const dados = JSON.parse(localStorage.getItem('catalogoEsmaltes')) || [];

        dados.forEach(item => {
            const linha = criarLinha(item.nome, item.marca, item.codigo);
            lista.appendChild(linha);
            contador[item.marca] = (contador[item.marca] || 0) + 1;
        });

        Object.keys(contador).forEach(marca => atualizarContador(marca));
    }

document.getElementById('exportar').addEventListener('click', function() {
    const itens = [];
    lista.querySelectorAll('tr').forEach(tr => {
        const nome = tr.children[0]?.textContent.trim();
        const marca = tr.children[1]?.textContent.trim();
        itens.push({ nome, marca });
    });

    const json = JSON.stringify(itens, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = "catalogo.json";
    link.click();
});



document.getElementById('botaoImportar').addEventListener('click', function() {
  document.getElementById('inputImportar').click(); // força o clique no input invisível
});


document.getElementById('inputImportar').addEventListener('change', function(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function(e) {
        const conteudo = e.target.result;
        try {
            const dados = JSON.parse(conteudo);

            lista.innerHTML = ''; // limpa a tabela

            // Zera os contadores
            Object.keys(contador).forEach(marca => contador[marca] = 0);

            dados.forEach(item => {
                if (item.nome && item.marca && item.codigo) {
                    const linha = criarLinha(item.nome, item.marca, item.codigo);
                    lista.appendChild(linha);
                    contador[item.marca] = (contador[item.marca] || 0) + 1;
                }
            });

            Object.keys(contador).forEach(marca => atualizarContador(marca));
            salvarDados();

        } catch (erro) {
            alert("Erro ao ler o arquivo JSON.");
        }
    };

    leitor.readAsText(arquivo);
});

    function criarLinha(nome, marca, codigo) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td class="text-center">${codigo}</td>
            <td class="text-center"><strong>${nome}</strong></td>
            <td class="text-center"><em>${marca}</em></td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm editar"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-outline-danger btn-sm remover"><i class="bi bi-trash3"></i></button>
            </td>
        `;

        adicionarEventosBotoes(linha);
        return linha;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nomeItem').value.trim();
        const marca = document.getElementById('categoriaItem').value;

        if (nome === '' || !marca) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Gera o próximo código sequencial (maior código atual + 1)
        let proximoCodigo = 1;
        if (lista.querySelectorAll('tr').length > 0) {
            const codigos = Array.from(lista.querySelectorAll('tr'))
                .map(tr => parseInt(tr.children[0].textContent))
                .filter(codigo => !isNaN(codigo));
            if (codigos.length > 0) {
                proximoCodigo = Math.max(...codigos) + 1;
            }
        }

        // Cria e adiciona a nova linha
        const linha = criarLinha(nome, marca, proximoCodigo);
        lista.appendChild(linha);

        contador[marca] = (contador[marca] || 0) + 1;
        atualizarContador(marca);
        salvarDados();

        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEsmalte'));
        if (modal) modal.hide();
    });

    function adicionarEventosBotoes(linha) {
        const btnRemover = linha.querySelector('.remover');
        const btnEditar = linha.querySelector('.editar');

        btnRemover.addEventListener('click', function () {
            const marca = linha.children[2].textContent.trim();
            linha.remove();
            contador[marca]--;
            atualizarContador(marca);
            salvarDados();
            if (confirm("Deseja realmente remover o esmalte?")) {
            } else {
            }
        });

        btnEditar.addEventListener('click', function () {
            linhaEmEdicao = linha;
            document.getElementById('codigoItemEditar').value = linha.children[0].textContent.trim();
            document.getElementById('nomeItemEditar').value = linha.children[1].textContent.trim();
            document.getElementById('categoriaItemEditar').value = linha.children[2].textContent.trim();
            const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
            modalEditar.show();
        });
    }

    formEditar.addEventListener('submit', function (e) {
        e.preventDefault();

        const novoNome = document.getElementById('nomeItemEditar').value.trim();
        const novaMarca = document.getElementById('categoriaItemEditar').value;

        if (novoNome === '' || !novaMarca) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (linhaEmEdicao) {
            const marcaAntiga = linhaEmEdicao.children[2].textContent.trim();

            linhaEmEdicao.children[1].innerHTML = `<strong>${novoNome}</strong>`;
            linhaEmEdicao.children[2].innerHTML = `<em>${novaMarca}</em>`;

            if (marcaAntiga !== novaMarca) {
                contador[marcaAntiga]--;
                contador[novaMarca] = (contador[novaMarca] || 0) + 1;
                atualizarContador(marcaAntiga);
                atualizarContador(novaMarca);
            }

            salvarDados();
        }

        linhaEmEdicao = null;

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
        modal.hide();
    });

    carregarDados();
});

document.getElementById('filtroEsmalte').addEventListener('change', function () {
    const filtro = this.value;
    document.querySelectorAll('#listaItens tr').forEach(tr => {
        const marca = tr.children[2]?.textContent || '';
        if (!filtro || marca === filtro) {
            tr.style.display = '';
        } else {
            tr.style.display = 'none';
        }
    });
});

function filtrarPorCor() {
    const filtro = document.getElementById('filtroCor').value.trim().toLowerCase();
    document.querySelectorAll('#listaItens tr').forEach(tr => {
        const cor = tr.children[1]?.textContent.toLowerCase() || '';
        if (!filtro || cor.includes(filtro)) {
            tr.style.display = '';
        } else {
            tr.style.display = 'none';
        }
    });
}

document.getElementById('button-addon2').addEventListener('click', filtrarPorCor);


function atualizarContadoresFiltrados() {
    Object.keys(contador).forEach(marca => {
        const contadorElemento = document.getElementById(`contador-${marca}`);
        if (contadorElemento) contadorElemento.textContent = 0;
    });

    document.querySelectorAll('#listaItens tr').forEach(tr => {
        if (tr.style.display !== 'none') {
            const marca = tr.children[1]?.textContent.trim();
            const contadorElemento = document.getElementById(`contador-${marca}`);
            if (contadorElemento) {
                contadorElemento.textContent = parseInt(contadorElemento.textContent) + 1;
            }
        }
    });
}

function aplicarFiltros() {
    const filtroMarca = document.getElementById('filtroEsmalte').value;
    const filtroCor = document.getElementById('filtroCor').value.trim().toLowerCase();

    document.querySelectorAll('#listaItens tr').forEach(tr => {
        const cor = tr.children[1]?.textContent.toLowerCase() || '';
        const marca = tr.children[2]?.textContent || '';
        const marcaOk = !filtroMarca || marca === filtroMarca;
        const corOk = !filtroCor || cor.includes(filtroCor);

        if (marcaOk && corOk) {
            tr.style.display = '';
        } else {
            tr.style.display = 'none';
        }
    });

    atualizarContadoresFiltrados();
}

document.getElementById('filtroEsmalte').addEventListener('change', aplicarFiltros);
// document.getElementById('filtroCor').addEventListener('input', aplicarFiltros);
document.getElementById('button-addon2').addEventListener('click', aplicarFiltros);

function atualizarTudo() {
    Object.keys(contador).forEach(marca => atualizarContador(marca));
    aplicarFiltros();
}

window.addEventListener('DOMContentLoaded', () => {
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=&quot;tooltip&quot;]'));
tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
});

function mostrarAlerta(mensagem, tipo = 'success'){
    const alerta = document.getElementById('alerta');
    const alertaTexto= document.getElementById('alertaTexto');

    alertaTexto.innerText = mensagem;
    alerta.className = 'alert alert-${tipo} alert-dismissible fade show';
    alerta.classList.remove('d-none');

    setTimeout(() => alerta.classList.add('d-none'),3000);
}

// Ao abrir o modal de adicionar
document.getElementById('modalEsmalte').addEventListener('show.bs.modal', function () {
    const lista = document.getElementById('listaItens');
    let proximoCodigo = 1;
    if (lista.querySelectorAll('tr').length > 0) {
        const codigos = Array.from(lista.querySelectorAll('tr'))
            .map(tr => parseInt(tr.children[0]?.textContent))
            .filter(codigo => !isNaN(codigo));
        if (codigos.length > 0) {
            proximoCodigo = Math.max(...codigos) + 1;
        }
    }
    document.getElementById('codigoItem').value = proximoCodigo;
});
