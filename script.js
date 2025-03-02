let categorias = ['Frutas', 'Laticínios', 'Congelados', 'Doces'];
let listaDeCompras = []; // Inicializa a lista de compras como vazia

function atualizarCategorias() {
    const categoriaSelect = document.getElementById('categoria');
    categoriaSelect.innerHTML = '';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        categoriaSelect.appendChild(option);
    });
}

function adicionarItem() {
    document.getElementById('formulario').classList.remove('hidden');
}

function adicionarCategoria() {
    document.getElementById('novaCategoriaForm').classList.remove('hidden');
}

function salvarCategoria() {
    const novaCategoria = document.getElementById('novaCategoria').value.trim();
    if (novaCategoria && !categorias.includes(novaCategoria)) {
        categorias.push(novaCategoria);
        atualizarCategorias();
    }
    document.getElementById('novaCategoriaForm').classList.add('hidden');
}

function salvarItem() {
    const nomeItem = document.getElementById('nomeItem').value.trim();
    const categoria = document.getElementById('categoria').value;
    if (nomeItem) {
        listaDeCompras.push({ nome: nomeItem, categoria: categoria });
        localStorage.setItem('listaDeCompras', JSON.stringify(listaDeCompras)); // Salva a lista no localStorage
        document.getElementById('mensagem').textContent = `Item '${nomeItem}' adicionado à categoria '${categoria}'!`;
        document.getElementById('nomeItem').value = '';
        document.getElementById('removerBtn').classList.remove('hidden');
    }
    document.getElementById('formulario').classList.add('hidden');
    exibirLista();
}

function removerItem() {
    const itemParaRemover = prompt("Digite o nome do item que deseja remover:").trim();
    const index = listaDeCompras.findIndex(item => item.nome.toLowerCase() === itemParaRemover.toLowerCase());
    if (index !== -1) {
        const itemRemovido = listaDeCompras.splice(index, 1);
        localStorage.setItem('listaDeCompras', JSON.stringify(listaDeCompras)); // Atualiza o localStorage
        document.getElementById('mensagem').textContent = `Item '${itemRemovido[0].nome}' removido com sucesso!`;
    } else {
        document.getElementById('mensagem').textContent = "Não foi possível encontrar o item dentro da lista!";
    }
    if (listaDeCompras.length === 0) {
        document.getElementById('removerBtn').classList.add('hidden');
    }
    exibirLista();
}

function exibirLista() {
    const listaUl = document.getElementById('listaDeCompras');
    listaUl.innerHTML = '';
    listaDeCompras.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" class="item-checkbox"> ${item.nome} (${item.categoria})`;
        listaUl.appendChild(li);
    });
}

function encerrarLista() {
    document.body.innerHTML = '<h1>Lista de Compras Encerrada</h1>';
    const categoriasOrganizadas = categorias.reduce((acc, categoria) => {
        acc[categoria] = listaDeCompras.filter(item => item.categoria === categoria).map(item => item.nome);
        return acc;
    }, {});

    const listaFinal = Object.entries(categoriasOrganizadas).map(([categoria, itens]) => {
        if (itens.length) {
            const itensComCheckbox = itens.map(item => `
                <div class="item-container">
                    <input type="checkbox" class="item-checkbox"> ${item}
                </div>
            `).join('');
            return `<strong>${categoria}:</strong><br>${itensComCheckbox}`;
        }
        return '';
    }).filter(Boolean).join('<br>');

    document.body.innerHTML += `<div>${listaFinal}</div>`;
    document.getElementById('reiniciarBtn').classList.remove('hidden'); // Mostra o botão de reiniciar
}

function reiniciarLista() {
    listaDeCompras = []; // Limpa a lista de compras
    localStorage.removeItem('listaDeCompras'); // Remove a lista do localStorage
    document.getElementById('mensagem').textContent = "Lista reiniciada!";
    exibirLista(); // Atualiza a exibição da lista
}

// Inicializa as categorias ao carregar a página
atualizarCategorias();