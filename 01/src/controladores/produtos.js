const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        const produtos = await knex('produtos').where({ usuario_id: usuario.id });
        if (categoria) {
            query.where({ categoria });
        }

        return res.status(200).json(produtos);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado.');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome || !estoque || !preco || !descricao) {
        return res.status(400).json('Preencha todos os campos obrigatórios.');
    }

    try {
        const produto = await knex('produtos').insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem }).returning('*')
        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado.');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualização do produto.');
    }

    try {
        const produto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado.');
        }

        const atualizacao = {};

        if (nome) {
            atualizacao.nome = nome;
        }

        if (estoque) {
            atualizacao.estoque = estoque;
        }

        if (categoria) {
            atualizacao.categoria = categoria;
        }

        if (descricao) {
            atualizacao.descricao = descricao;
        }

        if (preco) {
            atualizacao.preco = preco;
        }

        if (imagem) {
            atualizacao.imagem = imagem;
        }

        const produtoAtualizado = await knex('produtos').where({ id, usuario_id: usuario.id }).update(atualizacao);

        if (produtoAtualizado === 0) {
            return res.status(400).json("O produto não foi atualizado.")
        }

        return res.status(200).json('Produto foi atualizado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex("produtos").where({ usuario_id: usuario.id, id, }).first();

        if (!produto) {
            return res.status(404).json("Produto não encontrado.");
        }

        const produtoExcluido = await knex("produtos").del().where({ id });

        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido.");
        }

        return res.status(200).json("Produto excluido com sucesso.")
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}