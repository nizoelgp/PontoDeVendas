function redirectCadastro() {
    window.location.href = "cadastro.html";
}

function PaginaInicial() {
    window.location.href = "index.html";
}

function redirectEditar() {
    window.location.href = "editar.html";
}

function redirectVendas() {
    window.location.href = "vendas.html";
}

function redirectDeletar() {
    window.location.href = "excluir.html";
}

//cadastro
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    const confirmacaoDiv = document.getElementById('confirmacao'); // Seleciona a div de confirmação

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obter os valores dos campos do formulário
        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const categoria = document.getElementById('categoria').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);

        // Criar objeto representando o produto
        const produto = {
            nome: nome,
            descricao: descricao,
            preco: preco,
            categoria: categoria,
            quantidade: quantidade
        };

        // Armazenar o produto no localStorage
        let produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
        produtosCadastrados.push(produto);
        localStorage.setItem('produtos', JSON.stringify(produtosCadastrados));

        // Exibir mensagem de confirmação
        confirmacaoDiv.textContent = `O item ${nome} foi cadastrado com sucesso.`;

        // Limpar os campos do formulário após o cadastro
        form.reset();

        // Atualizar a lista de produtos na página inicial
        exibirProdutosCadastrados();
    });
});

//listar inicio
document.addEventListener("DOMContentLoaded", function () {
    // Função para exibir os produtos cadastrados na página inicial
    function exibirProdutosCadastrados() {
        const listaProdutos = document.getElementById('lista-produtos');
        listaProdutos.innerHTML = ''; // Limpa o conteúdo existente da lista

        // Recuperar os produtos do localStorage
        let produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];

        // Exibir cada produto na lista
        produtosCadastrados.forEach(function (produto) {
            const itemLista = document.createElement('li');

            // Cria uma div para cada atributo do produto e adiciona na lista
            Object.keys(produto).forEach(function (atributo) {
                // Ajusta o texto para começar com letra maiúscula
                let atributoFormatado;
                switch (atributo) {
                    case 'nome':
                        atributoFormatado = 'Nome do Produto';
                        break;
                    case 'descricao':
                        atributoFormatado = 'Descrição';
                        break;
                    case 'preco':
                        atributoFormatado = 'Preço Unitário R$';
                        // Adiciona "R$" antes dos valores de preço
                        produto[atributo] = `R$${produto[atributo].toFixed(2)}`;
                        break;
                    case 'categoria':
                        atributoFormatado = 'Categoria';
                        break;
                    case 'quantidade':
                        atributoFormatado = 'Quantidade em Estoque';
                        break;
                    default:
                        atributoFormatado = atributo;
                }

                const divAtributo = document.createElement('div');
                divAtributo.textContent = `${atributoFormatado}: ${produto[atributo]}`;
                itemLista.appendChild(divAtributo);
            });

            // Adiciona um espaço entre os produtos
            itemLista.appendChild(document.createElement('br'));

            listaProdutos.appendChild(itemLista);
        });
    }

    // Exibir os produtos cadastrados ao carregar a página
    exibirProdutosCadastrados();
});

//vendas
document.addEventListener("DOMContentLoaded", function () {
    const listaProdutos = document.getElementById('lista-produtos');
    const venderProdutosBtn = document.getElementById('venderProdutosBtn');

    // Função para exibir os produtos do estoque na página de vendas
    function exibirProdutosNaPaginaDeVendas() {
        const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];

        // Limpa o conteúdo existente da lista
        listaProdutos.innerHTML = '';

        // Exibir cada produto na lista com checkbox apenas na página de vendas
        produtosCadastrados.forEach(function (produto, index) {
            const itemLista = document.createElement('li');

            if (window.location.pathname.includes("vendas.html")) {
                // Cria uma caixa de seleção para o produto apenas na página de vendas
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'produto';
                checkbox.value = index; // Use o índice do produto como valor
                itemLista.appendChild(checkbox);
            }

            // Cria uma div para cada atributo do produto e adiciona na lista
            Object.keys(produto).forEach(function (atributo) {
                // Ajusta o texto para começar com letra maiúscula
                let atributoFormatado;
                switch (atributo) {
                    case 'nome':
                        atributoFormatado = 'Nome do Produto';
                        break;
                    case 'descricao':
                        atributoFormatado = 'Descrição';
                        break;
                    case 'preco':
                        atributoFormatado = 'Preço Unitário R$';
                        break;
                    case 'categoria':
                        atributoFormatado = 'Categoria';
                        break;
                    case 'quantidade':
                        atributoFormatado = 'Quantidade em Estoque';
                        break;
                    default:
                        atributoFormatado = atributo;
                }

                const divAtributo = document.createElement('div');
                divAtributo.textContent = `${atributoFormatado}: ${produto[atributo]}`;
                itemLista.appendChild(divAtributo);
            });

            listaProdutos.appendChild(itemLista);
        });
    }

    exibirProdutosNaPaginaDeVendas();

    // Função para registrar a venda dos produtos selecionados
    venderProdutosBtn.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('input[name="produto"]:checked');
        if (checkboxes.length === 0) {
            alert('Por favor, selecione pelo menos um produto para vender.');
            return;
        }

        const vendasRealizadas = JSON.parse(localStorage.getItem('vendas')) || [];

        checkboxes.forEach(function (checkbox) {
            const index = parseInt(checkbox.value);
            const produtos = JSON.parse(localStorage.getItem('produtos'));
            const produto = produtos[index];
            const quantidadeDisponivel = produto.quantidade;

            let quantidadeVendida = parseInt(prompt(`Informe a quantidade vendida de ${produto.nome}:`));

            if (!isNaN(quantidadeVendida) && quantidadeVendida > 0) {
                if (quantidadeVendida > quantidadeDisponivel) {
                    alert(`Quantidade insuficiente de ${produto.nome} em estoque. Quantidade disponível: ${quantidadeDisponivel}`);
                    return;
                }

                // Subtrai a quantidade vendida da quantidade disponível
                produto.quantidade -= quantidadeVendida;

                // Calcula o valor total da venda
                const valorTotalVenda = quantidadeVendida * produto.preco;

                // Adiciona a venda à lista de vendas realizadas
                vendasRealizadas.push({
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: produto.preco,
                    categoria: produto.categoria,
                    quantidadeVendida: quantidadeVendida,
                    valorTotalVenda: valorTotalVenda
                });

                // Mensagem com os detalhes da venda
                alert(`Venda registrada: ${quantidadeVendida} unidades de ${produto.nome} vendidas por R$${valorTotalVenda.toFixed(2)}`);

                // Atualizar o Local Storage com os produtos e as vendas atualizadas
                localStorage.setItem('produtos', JSON.stringify(produtos));
                localStorage.setItem('vendas', JSON.stringify(vendasRealizadas));

                // Atualizar a lista de produtos do estoque na página de vendas
                exibirProdutosNaPaginaDeVendas();

                // Exibir as vendas realizadas
                exibirVendasRealizadas();
            } else {
                alert('Quantidade inválida. A venda não foi registrada.');
            }
        });
    });

    // Função para exibir as vendas realizadas
    function exibirVendasRealizadas() {
        const listaVendas = document.getElementById('lista-vendas');
        listaVendas.innerHTML = ''; // Limpa o conteúdo existente da lista

        // Recuperar as vendas do localStorage
        const vendasRealizadas = JSON.parse(localStorage.getItem('vendas')) || [];

        // Mapeamento de nomes de atributos para os nomes desejados na interface
        const atributosFormatados = {
            nome: 'Nome',
            descricao: 'Descrição',
            preco: 'Preço Unitário R$',
            categoria: 'Categoria',
            quantidadeVendida: 'Quantidade Vendida',
            valorTotalVenda: 'Valor Total da Venda'
        };

        // Exibir cada venda na lista
        vendasRealizadas.forEach(function (venda) {
            const itemLista = document.createElement('li');

            // Iterar sobre os atributos da venda
            Object.keys(venda).forEach(function (atributo) {
                // Verifica se o atributo está presente no mapeamento e obtém o nome formatado
                const atributoFormatado = atributosFormatados[atributo] || atributo;

                // Adiciona "R$" antes dos valores e preços
                const valor = atributo === 'valorTotalVenda' ? `R$${venda[atributo].toFixed(2)}` : venda[atributo];

                const divAtributo = document.createElement('div');
                divAtributo.textContent = `${atributoFormatado}: ${valor}`;
                itemLista.appendChild(divAtributo);
            });

            listaVendas.appendChild(itemLista);
        });
    }


    // Exibir as vendas realizadas ao carregar a página
    exibirVendasRealizadas();

    // Adiciona um listener para o botão de limpar o relatório de vendas realizadas
    const limparVendasBtn = document.getElementById('limparVendasBtn');
    limparVendasBtn.addEventListener('click', limparRelatorioVendas);
});

// Função para limpar o relatório de vendas realizadas
function limparRelatorioVendas() {
    if (confirm("Tem certeza que deseja limpar o relatório de vendas realizadas?")) {
        localStorage.removeItem('vendas');
        const listaVendas = document.getElementById('lista-vendas');
        listaVendas.innerHTML = '';
        alert("O relatório de vendas realizadas foi limpo com sucesso!");
    }
}

//editar
document.addEventListener("DOMContentLoaded", function () {
    const formEditar = document.querySelector('#form-editar');

    // Função para exibir os produtos cadastrados na página de edição
    function exibirProdutosParaEdicao() {
        const listaProdutos = document.getElementById('lista-produtos');
        listaProdutos.innerHTML = ''; // Limpa o conteúdo existente da lista

        // Recuperar os produtos do localStorage
        let produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];

        // Exibir cada produto na lista com botão de seleção para edição
        produtosCadastrados.forEach(function (produto, index) {
            const itemLista = document.createElement('li');

            if (window.location.pathname.includes("editar.html")) {
                // Cria um botão para selecionar o produto para edição
                const editarBtn = document.createElement('button');
                editarBtn.textContent = 'Editar';
                editarBtn.addEventListener('click', function () {
                    selecionarProdutoParaEdicao(index);
                });
                itemLista.appendChild(editarBtn);
            }

            // Cria uma div para cada atributo do produto e adiciona na lista
            Object.entries(produto).forEach(([atributo, valor]) => {
                const atributoFormatado = formatarAtributo(atributo);
                const divAtributo = document.createElement('div');
                divAtributo.textContent = `${atributoFormatado}: ${valor}`;
                itemLista.appendChild(divAtributo);
            });

            // Adiciona um espaço entre os produtos
            itemLista.appendChild(document.createElement('br'));

            listaProdutos.appendChild(itemLista);
        });
    }

    // Função para formatar o nome do atributo
    function formatarAtributo(atributo) {
        switch (atributo) {
            case 'nome':
                return 'Nome do Produto';
            case 'descricao':
                return 'Descrição';
            case 'preco':
                return 'Preço Unitário R$';
            case 'categoria':
                return 'Categoria';
            case 'quantidade':
                return 'Quantidade em Estoque';
            default:
                return atributo;
        }
    }

    // Função para selecionar um produto para edição
    function selecionarProdutoParaEdicao(index) {
        const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
        const produtoSelecionado = produtosCadastrados[index];

        // Preencher os campos do formulário de edição com os dados do produto selecionado
        document.getElementById('nome').value = produtoSelecionado.nome;
        document.getElementById('descricao').value = produtoSelecionado.descricao;
        document.getElementById('preco').value = produtoSelecionado.preco;
        document.getElementById('categoria').value = produtoSelecionado.categoria;
        document.getElementById('quantidade').value = produtoSelecionado.quantidade;

        // Passar o índice do produto para o campo oculto no formulário
        document.getElementById('indice-editar').value = index;

        // Exibir mensagem de confirmação
        const confirmacaoDiv = document.getElementById('confirmacao');
        confirmacaoDiv.textContent = `Produto "${produtoSelecionado.nome}" selecionado para edição.`;
    }

    // Função para atualizar um produto editado
    formEditar.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obter os valores dos campos do formulário
        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const categoria = document.getElementById('categoria').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);

        // Criar objeto representando o produto editado
        const produtoEditado = {
            nome: nome,
            descricao: descricao,
            preco: preco,
            categoria: categoria,
            quantidade: quantidade
        };

        // Recuperar os produtos do localStorage
        let produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];

        // Encontrar o índice do produto a ser editado
        const index = parseInt(document.getElementById('indice-editar').value);

        // Atualizar o produto na lista de produtos cadastrados
        produtosCadastrados[index] = produtoEditado;

        // Remover o produto antigo da lista de produtos cadastrados
        produtosCadastrados.splice(index, 1);

        // Armazenar o array atualizado no localStorage
        localStorage.setItem('produtos', JSON.stringify(produtosCadastrados));

        // Exibir mensagem de confirmação com o nome do produto editado
        const confirmacaoDiv = document.getElementById('confirmacao');
        confirmacaoDiv.textContent = `Produto editado com sucesso.`;

        // Limpar os campos do formulário
        formEditar.reset();

        // Atualizar a lista de produtos na página de edição
        exibirProdutosParaEdicao();
    });

    // Exibir os produtos cadastrados na página de edição ao carregar a página
    exibirProdutosParaEdicao();
});


//excluir
document.addEventListener("DOMContentLoaded", function () {
    // Função para excluir todos os produtos
    const excluirProdutosBtn = document.getElementById('excluirProdutosBtn');
    excluirProdutosBtn.addEventListener('click', function () {
        if (confirm("Tem certeza que deseja excluir todos os produtos cadastrados?")) {
            // Limpa o localStorage
            localStorage.removeItem('produtos');

            // Atualiza a lista de produtos na página de exclusão
            exibirProdutosParaExclusao();

            // Exibe mensagem de confirmação
            alert("Todos os produtos foram excluídos com sucesso!");
        }
    });

    // Função para exibir os produtos cadastrados na página de exclusão
    function exibirProdutosParaExclusao() {
        const listaProdutos = document.getElementById('lista-produtos');
        listaProdutos.innerHTML = ''; // Limpa o conteúdo existente da lista

        // Recuperar os produtos do localStorage
        let produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];

        // Exibir cada produto na lista com uma caixa de seleção
        produtosCadastrados.forEach(function (produto, index) {
            const itemLista = document.createElement('li');

            if (window.location.pathname.includes("excluir.html")) {
                // Cria uma caixa de seleção para o produto apenas na página de vendas
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'produto';
                checkbox.value = index; // Use o índice do produto como valor
                itemLista.appendChild(checkbox);
            }

            // Cria uma div para cada atributo do produto e adiciona na lista
            Object.keys(produto).forEach(function (atributo) {
                // Ajusta o texto para começar com letra maiúscula
                let atributoFormatado;
                switch (atributo) {
                    case 'nome':
                        atributoFormatado = 'Nome do Produto';
                        break;
                    case 'descricao':
                        atributoFormatado = 'Descrição';
                        break;
                    case 'preco':
                        atributoFormatado = 'Preço Unitário R$';
                        break;
                    case 'categoria':
                        atributoFormatado = 'Categoria';
                        break;
                    case 'quantidade':
                        atributoFormatado = 'Quantidade em Estoque';
                        break;
                    default:
                        atributoFormatado = atributo;
                }

                const divAtributo = document.createElement('div');
                divAtributo.textContent = `${atributoFormatado}: ${produto[atributo]}`;
                itemLista.appendChild(divAtributo);
            });

            // Adiciona um espaço entre os produtos
            itemLista.appendChild(document.createElement('br'));

            listaProdutos.appendChild(itemLista);
        });
    }

    // Exibir os produtos cadastrados na página de exclusão ao carregar a página
    exibirProdutosParaExclusao();

    // Adiciona um listener para o botão de exclusão de produtos selecionados
    const excluirSelecionadosBtn = document.getElementById('excluirSelecionadosBtn');
    excluirSelecionadosBtn.addEventListener('click', function () {
        const checkboxes = document.querySelectorAll('input[name="produto"]:checked');
        if (checkboxes.length === 0) {
            alert('Por favor, selecione pelo menos um produto para excluir.');
            return;
        }

        if (confirm("Tem certeza que deseja excluir os produtos selecionados?")) {
            const produtosCadastrados = JSON.parse(localStorage.getItem('produtos')) || [];
            const produtosAtualizados = produtosCadastrados.filter((produto, index) => {
                // Verifica se o índice do produto está entre os selecionados para exclusão
                return !Array.from(checkboxes).some(checkbox => parseInt(checkbox.value) === index);
            });

            // Atualiza o localStorage com os produtos restantes
            localStorage.setItem('produtos', JSON.stringify(produtosAtualizados));

            // Exibe novamente os produtos na lista
            exibirProdutosParaExclusao();

            alert("Os produtos selecionados foram excluídos com sucesso!");
        }
    });
});