// Bibliotecas
const express = require("express"); // Importa a biblioteca Express para criar um servidor
const bodyParser = require("body-parser"); // Importa a biblioteca body-parser para fazer o parsing de dados do corpo das requisições
const session = require('express-session'); // Importa a biblioteca express-session para gerenciar sessões
const { Database } = require('dsc.db'); // Importa a biblioteca dsc.db para interagir com um banco de dados
const axios = require('axios'); // Importa a biblioteca axios para fazer requisições HTTP

const db = new Database({
    uri: "mongodb+srv://caiquebafe:Hamachi123@caique.pb9htts.mongodb.net/",
    collection: "radioesrp",
    debug: false,
}); // Cria uma instância do banco de dados dsc.db, conectando-a a um banco de dados MongoDB

const queue = new Array(); // Cria um array vazio chamado "queue" para armazenar uma fila de músicas

const app = express(); // Cria a instância do servidor usando o Express

// Middlewares
app.use('/static', express.static(__dirname + "/static")); // Define um middleware para servir arquivos estáticos a partir do diretório "/static"
app.set('views', __dirname + '/static/ejs'); // Define o diretório de views como "/static/ejs"
app.set('view engine', 'ejs'); // Define o mecanismo de visualização como EJS
app.use(bodyParser.urlencoded({ extended: false })); // Usa o middleware body-parser para fazer o parsing de dados URL-encoded
app.use(bodyParser.json()); // Usa o middleware body-parser para fazer o parsing de dados JSON
app.use(session({
    secret: 'cafeSchmits1840', // Define uma chave secreta para a sessão
    resave: false, // Define se a sessão deve ser regravada mesmo que não tenha sido modificada
    saveUninitialized: true // Define se a sessão deve ser salva mesmo que não tenha sido inicializada
})); 

// Rotas
app.get("/", (req, res) => {
    return res.render("index", { 
        user: req.session.user, // Passa o objeto user da sessão para a view
        msg: req.query.msg, // Passa a mensagem da query string para a view
        queue: queue, // Passa a fila de músicas para a view
    });
}); 

app.post("/sendSong", async (req, res) => {
    const { InputMusic } = req.body; // Obtém o valor do campo InputMusic no HTML
    const apiKey = "AIzaSyCrEL_RkFx2rCiL8gxmzFGwb0ttKWT3QV4"; // Define a chave de API do YouTube

    let url = 'https://www.googleapis.com/youtube/v3/search' +
      '?part=snippet' +
      '&maxResults=1' +
      '&q=' + encodeURIComponent(InputMusic) +
      '&key=' + apiKey; // Monta a URL da API do YouTube para pesquisar a música

    let searchResult = await axios.get(url)
    .catch((err) => {
        console.log(err);
        return res.redirect("/?msg=Erro ao enviar música.");
    }); // Faz uma requisição GET para a API do YouTube para buscar o vídeo da música

    let video = searchResult.data.items[0].snippet; // Obtém as informações do primeiro vídeo retornado na busca

    queue.push({
        ...video,
        requestedBy: req.session.user,
    }); // Adiciona a música na fila de músicas, incluindo e usuário que a solicitou

    setTimeout(() => {
        queue.shift();
    }, 30 * 1000); // Remove o primeiro elemento da fila após 30 segundos

    return res.redirect("/?msg=Música enviada com sucesso!");
}); // Define uma rota para enviar uma música

// Autenticação de usuário
app.get("/login", (req, res) => {
    if(req.session.user) return res.redirect('/');

    res.render("login");
}); // Define uma rota para exibir a página de login

app.post("/login", async (req, res) => { // Async faz a tarefa ser realizada em segundo plano
    const { InputEmail, InputSenha } = req.body; // Obtém o valor dos campos InputEmail e InputSenha do HTML

    const users = await db.list(); // Obtém a lista de usuários do banco de dados // Await espera até o programa devolver completamente a resposta

    const userExists = users.find((user) => user.data.email == InputEmail); // Verifica se o usuário existe com base no email

    const userValid = users.find((user) => user.data.email == InputEmail && user.data.password == InputSenha); // Verifica se o usuário é válido com base no email e senha

    if(!userExists) {
        return res.redirect("/login?msg=Usuário não encontrado.")
    }

    if(!userValid) {
        return res.redirect("/login?msg=Senha incorreta!")
    }

    if(userExists && userValid) {
        req.session.user = userExists.data; // Define o objeto user da sessão como o usuário encontrado

        res.redirect("/");
    }
}); // Define uma rota para fazer o login do usuário

app.post("/signup", async (req, res) => {

    const { InputEmailReg, InputSenhaReg, InputNumReg, InputTurmaReg } = req.body; // Obtém o valor dos campos InputEmailReg, InputSenhaReg, InputNumReg e InputTurmaReg do corpo da requisição

    const users = await db.list(); // Obtém a lista de usuários do banco de dados

    let user = users.find((user) => user.email === InputEmailReg); // Verifica se o usuário já existe com base no email

    if(user) {
        return res.redirect('/login?msg=Usuário já existente.')
    }

    user = { 
        regNumber: InputNumReg, 
        classId: InputTurmaReg, 
        email: InputEmailReg, 
        password: InputSenhaReg 
    }; // Cria um objeto de usuário com as informações fornecidas

    await db.set(`${InputNumReg}`, user); // Salva o usuário no banco de dados usando o número de registro como chave

    req.session.regNumber = InputNumReg; // Define o número de registro da sessão como o número de registro fornecido
    req.session.user = user; // Define o objeto user da sessão como o usuário criado

    return res.redirect('/login')
}); // Define uma rota para criar um novo usuário

app.get('/logout', (req, res) => {
    req.session.destroy(); // sai da sessão e limpa o ID do usuário

    return res.redirect("/");
}); // Define uma rota para fazer logout

// Servidor
app.listen(3883, () => {
    console.log("Olá Mundo!")
})