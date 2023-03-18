const Sequelize = require("sequelize");

 /*const connection = new Sequelize("qaprodev", "root", "R3mixCl@nMorph3l", {
  host: "localhost",
  dialect: "mysql",
});
const connection = new Sequelize("qaprodev", "root", "GHBqdq75748", {
  host: "10.100.47.71",
  dialect: "mysql",
});
/*
const connection = new Sequelize("qaprodev", "root", "GHBqdq75748", {
  host: "node131216-env-0045258.jelastic.saveincloud.net",
  dialect: "mysql",
});
*/


/// Heroku

const connection = new Sequelize("heroku_ea731724c69d797", "b2ca25832786bd", "c189d7bf", {
  host: "us-cdbr-east-06.cleardb.net",
  dialect: "mysql",
});


module.exports = connection;
/*
Usuario: b2ca25832786bd
senha:c189d7bf
host: us-cdbr-east-06.cleardb.net
nome do banco: heroku_ea731724c69d797
*/