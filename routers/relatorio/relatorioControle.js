const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const VideoTeste = require("../../database/VideoTeste");
  

router.get("/deletarrelatorio/:nomevideo/:idempresa/",  (req, res) => {
  const videoFileName = req.params.nomevideo;
  const idempresa = req.params.idempresa;
 
  const videoPath = path.join(__dirname, "../../videos", videoFileName);

  if (fs.existsSync(videoPath)) {
    VideoTeste.destroy({ where: { video: videoFileName,idempresa:idempresa  } })
      .then(() => {
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send("video excluido");
          }
       
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Erro ao excluir o vídeo do banco de dados.");
      });
  } else {
    console.log("O vídeo não foi encontrado na pasta de vídeos.");
    res.status(404).send("O vídeo não foi encontrado na pasta de vídeos.");
  }
});

router.get("/videos/:nomevideo", (req, res) => {
  const videosFolder = path.join(__dirname, "../../videos");
  const videoFileName = req.params.nomevideo;
  const videoPath = path.join(videosFolder, videoFileName);

  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    console.log("O vídeo não foi encontrado na pasta de vídeos.");
    res.status(404).send("O vídeo não foi encontrado na pasta de vídeos.");
  }
});

module.exports = router;
