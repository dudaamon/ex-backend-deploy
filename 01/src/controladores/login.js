const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('É obrigatório informar email e senha.');
    }

    try {
        const usuarios = await knex('usuarios').where({ email }).select('*')

        if (usuarios.length === 0) {
            return res.status(400).json("O usuário não foi encontrado.")
        }

        const usuario = usuarios[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

        if (!senhaCorreta) {
            return res.status(400).json("Email e senha não conferem.")
        }

        const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '8h' })
        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { login }