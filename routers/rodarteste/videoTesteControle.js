
const express = require("express");
const router = express.Router();
const VideoTeste = require("../../database/VideoTeste");

router.get("/relatoriogeral/:idempresa/",(req, res) => {
  var idempresa = req.params.idempresa;
  var token = req.params.token;
  console.log("IDEEMPRESA"+idempresa)
  VideoTeste.findAll({
    where: { idempresa: idempresa }, // Adiciona a cláusula WHERE aqui
    order: [['id', 'DESC']]
  }).then((videos) => {
    res.render("relatoriogeral", {
      idempresa,
      videos,
      token
    });
  });
});

module.exports = router;
