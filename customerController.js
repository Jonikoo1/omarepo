'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost', // tietokantapalvelimen osoite
  port : 3307, // jos oletusportti ei toimi
  user : 'root', // kehitysatarkoituksessa voidaan käyttää root-käyttäjää. Tuotannossa ei saa käyttää root-käyttäjää
  password : 'Ruutti', // voi olla tyhjäkin, käyttäkää sitä mikä teillä on
  database : 'asiakas_woj' // tai asiakas_woj
});

module.exports = 
{
    fetchTypes: function (req, res) {
      var sql = 'SELECT avain, lyhenne, selite FROM Asiakastyyppi';  
      connection.query(sql, function(error, results, fields){
        if ( error ){
            console.log("Virhe haettaessa dataa Asiakastyyppi-taulusta: " + error);
            res.status(500); 
            res.json({"status" : "ei toiminut"}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results); // onnistunut data lähetetään selaimelle (tai muulle)
        }
    });

    },

    fetchCustomers: function(req, res){
      //console.log(req.query.asty_avain);
      var sql = 'SELECT avain, nimi, osoite, postinro, postitmp, luontipvm, asty_avain from asiakas where 1 = 1';
      if (req.query.nimi != null)
        sql = sql + " and nimi like '" + req.query.nimi + "%'";
      if (req.query.osoite != null)
        sql = sql + " and osoite like '" + req.query.osoite + "%'";     
      if (req.query.asty_avain != null && req.query.asty_avain != "")
        sql += " and asty_avain=" + req.query.asty_avain;
        
      connection.query(sql, function(error, results, fields){
        if ( error ){
            console.log("Virhe haettaessa dataa Asiakas-taulusta: " + error);
            res.status(500); 
            res.json({"status" : "ei toiminut"});
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
    });
      
      
    },

    create: function(req, res){
      //connection.query...
      /*INSERT INTO asiakas (nimi, osoite, postinro, postitmp, asty_avain)
        VALUES ("Testi Testinen","Micorkatu 1","70100","Kuopio",1)*/
         var sql = 'INSERT INTO asiakas (nimi, osoite, postinro, postitmp, luontipvm, asty_avain) VALUES ("Testiä", "Puijonkatu", "70100", "Kuopio", NOW(), 2)';
         

         connection.query(sql, function(error, results, fields){
          if ( error ){
              console.log("Virhe haettaessa dataa Asiakas-taulustaaa: " + error);
              res.status(400); 
              res.json({"status" : "ei toiminut"}); 
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.json(results);
            console.log("Params = " + JSON.stringify(req.params))
          }
      });
    },

    update: function(req, res){

    },

    delete : function (req, res) {
      connection.query(sql, function(error, results, fields){
        if ( error ){
            console.log("Virhe poistaessa asiakas Asiakas-taulusta: " + error);
            res.status(400); 
            res.json({"status" : "ei toiminut ollenkaan"}); 
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
          console.log("Params = " + JSON.stringify(req.params))
        }
    });
      //DELETE FROM asiakas WHERE avain=13;
        console.log("Body = " + JSON.stringify(req.body));
        console.log("Params = " + JSON.stringify(req.params)); // Tänne tulee id: req.params.id
        res.send("Kutsuttiin delete");
    }
}
