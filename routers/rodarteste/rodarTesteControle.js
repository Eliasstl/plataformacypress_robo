const cypress = require("cypress");
const glob = require("glob");
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Passo = require("../../database/Passoteste");
const Nometeste = require("../../database/Nometeste");
const VideoTeste = require("../../database/VideoTeste");
const path = require("path");
const fs = require("fs");

router.post(
  "/rodartestesselecionados/:idempresa/",

  async (req, res) => {
    const idempresa = req.params.idempresa;
    const selecionados = req.body["selecionado[]"];

    console.log("Testes selecionados:", selecionados);

    if (Array.isArray(selecionados)) {
      try {
        for (const selecionado of selecionados) {
          const url = `http://localhost:3001/run-tests/${idempresa}/${selecionado}`;
          // Fazer uma solicitação HTTP para a rota com a URL gerada
          // para executar o teste usando Cypress, e esperar pela resposta
          await axios.get(url);
        }
        VideoTeste.findAll({
          order: [["id", "DESC"]],
        }).then((videos) => {
          Nometeste.findAll().then((testes) => {
            res.render("testerodando", {
              idempresa,
              testes,
              token,
            });
          });
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao executar testes.");
      }
    } else {
      const url = `http://localhost:3001/run-tests/${idempresa}/${selecionados}`;
      // Fazer uma solicitação HTTP para a rota com a URL gerada
      // para executar o teste usando Cypress, e esperar pela resposta
      try {
        await axios.get(url);
        VideoTeste.findAll({
          order: [["id", "DESC"]],
        }).then((videos) => {
          Nometeste.findAll().then((testes) => {
            res.render("testerodando", {
              idempresa,
              testes,
            });
          });
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao executar teste.");
      }
    }
  }
);

//rota da api
router.get("/run-tests/:idempresa/:nteste", (req, res) => {
  const idem = req.params.idempresa;
  const nteste = req.params.nteste;
  Passo.findAll({
    where: {
      status: 0,
      idempresa: idem,
      nometeste: nteste,
    },
  })
    .then((passos) => {
      console.log("TAMANHO DO PASSO: " + passos.length);
      const tamanho = passos.length;
      // Mapeia os dados retornados e extrai'
      const id = passos.map((passo) => passo.id).join("|");
      const idempresa = passos.map((passo) => passo.idempresa).join("| ");
      const nometeste = passos.map((passo) => passo.nometeste).join("| ");
      const titulo = passos.map((passo) => passo.titulo).join("| ");
      const tipo = passos.map((passo) => passo.tipo).join("| ");
      const conteudo = passos.map((passo) => passo.conteudo).join("| ");
      const funcao = passos.map((passo) => passo.funcao).join("| ");
      const forca = passos.map((passo) => passo.forca).join("| ");
      const status = passos.map((passo) => passo.status).join("| ");
      const inserir = passos.map((passo) => passo.inserir).join("| ");
      const esperar = passos.map((passo) => passo.esperar).join("| ");
      let randomNum = Math.floor(Math.random() * 100000000);
      var nomevideo = randomNum + idem + "_" + nteste + ".mp4";

      // separando a string

      glob("./cypress/e2e/**/*.cy.js", (err, files) => {
        if (err) {
          return res.json({ Error: err });
        }
        Promise.all(
          files.map((file) => {
            return cypress.run({
              spec: file,
              env: {
                id,
                idempresa,
                nometeste,
                titulo,
                inserir,
                tipo,
                conteudo,
                funcao,
                inserir,
                esperar,
                status,
                tamanho,
                forca,
                nomevideo,
              }, // Passa o texto como variável de ambiente para o Cypress
            });
          })
        )
          .then((results) => {
      
            ///atualizar status nome teste
            Nometeste.update(
              { executar: "nao" },
              {
                where: {
                  idempresa: idem,
                  executar: "sim",
                },
              }
            )
              .then((result) => {
                console.log(`${result} registros foram atualizados.`);
              })
              .catch((error) => {
                console.error("Erro ao atualizar registros:", error);
              });
            if (results[0].totalPassed === 1) {
              const novoVideoTeste = {
                idempresa: idem,
                nometeste: nteste,
                resultado: "Aprovado",
                video: nomevideo,
              };
              const dados = {
                idempresa: idem,
                nometeste: nteste,
                resultado: "Aprovado",
                video: nomevideo,
              };
              
              const dadosJSON = JSON.stringify(dados);
              res.send(dadosJSON);
             

              VideoTeste.create(novoVideoTeste)
                .then((video) => {
                  console.log("Novo vídeo criado:", video.toJSON());
                })
                .catch((erro) => {
                  console.log("Erro ao criar novo vídeo:", erro);
                });
            } else if (results[0].totalPassed === 0) {
              const novoVideoTeste = {
                idempresa: idem,
                nometeste: nteste,
                resultado: "Falhou",
                video: nomevideo,
              };
              const dados = {
                idempresa: idem,
                nometeste: nteste,
                resultado: "Falhou",
                video: nomevideo,
              };
              
              const dadosJSON = JSON.stringify(dados);
              res.send(dadosJSON);
             
              VideoTeste.create(novoVideoTeste)
                .then((video) => {
                  console.log("Novo vídeo criado:", video.toJSON());
                })
                .catch((erro) => {
                  console.log("Erro ao criar novo vídeo:", erro);
                });
                res.json();
            }

            // Trata todos os resultados das Promises
            // ...

            // Renderiza a página com os resultados tratados
            const videosFolder = path.join(__dirname, "../../cypress/videos");
            const videoFileName = "teste.cy.js.mp4";
            const videoPath = path.join(videosFolder, videoFileName);

            if (fs.existsSync(videoPath)) {
              const newVideoFolder = path.join(__dirname, "../../videos");

              if (!fs.existsSync(newVideoFolder)) {
                fs.mkdirSync(newVideoFolder);
              }

              const newVideoPath = path.join(newVideoFolder, nomevideo);
              fs.copyFileSync(videoPath, newVideoPath);

             
            }
           
          })
          .catch((err) => {
            return res.json({ Error: err });
          });
      });
    })
    .catch((err) => {
      console.error(err);
    });

  // Acessa o parâmetro texto da URL
});

module.exports = router;
