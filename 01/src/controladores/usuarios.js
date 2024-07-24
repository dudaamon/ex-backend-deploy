const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome || !email || !senha || !nome_loja) {
        return res.status(404).json("Todos os campos são obrigatórios.");
    }

    try {
        const quantidadeUsuarios = await knex("usuarios").where({ email }).first()

        if (quantidadeUsuarios) {
            return res.status(400).json("O email já existe.");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada, nome_loja }).returning('*').debug()

        if (!usuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização.');
    }

    try {
        const body = {}
        const params = []

        if (nome) {
            body.nome = nome
            params.push({ nome })
        }

        if (email) {
            if (email !== req.usuario.email) {
                const quantidadeUsuarios = await knex('usuarios').where({ email }).first()

                if (quantidadeUsuarios) {
                    return res.status(400).json("O email já existe.");
                }
            }

            body.email = email
            params.push({ email })
        }

        if (senha) {
            body.senha = await bcrypt.hash(senha, 10)
            params.push({ senha: body.senha })
        }

        if (nome_loja) {
            body.nome_loja = nome_loja
            params.push({ nome_loja })
        }

        const usuarioAtualizado = await knex('usuarios')
            .where('id', req.usuario.id).update(body).returning('*')

        if (!usuarioAtualizado) {
            return res.status(400).json("O usuário não foi atualizado.");
        }

        return res.status(200).json('Usuário foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}