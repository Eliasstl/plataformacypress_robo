const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const rodarTesteControle = require("./routers/rodarteste/rodarTesteControle");
const relatorioControle = require("./routers/relatorio/relatorioControle");

const videoTesteControle = require("./routers/rodarteste/videoTesteControle");



const port = process.env.PORT || 3001;
//database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados");
  })
  .catch((msgErro) => {
    console.log("Erro ao logar no banco: " + msgErro);
  });
//Estou dizendo para o Express usar o EJS com View Enine
app.set("view engine", "ejs");
app.use(express.static("public"));



//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", rodarTesteControle);
app.use("/", relatorioControle);
app.use("/", videoTesteControle);


setInterval(async () => {}, 60000); // Executa a cada minuto

// Criando uma string no formato "hh:mm" com a hora final

//Porta
app.listen(port, () => {
  console.log("App Rodando!: " + port);
});
