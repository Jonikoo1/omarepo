'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost', 
  port: 3307, // jos oletusportti ei toimi
  user: 'root', 
  password: 'Ruutti', 
  database: 'asiakas_woj' // tai asiakas_woj
});

module.exports =
{
  fetchTypes: function (req, res) {
    var sql = 'SELECT avain, lyhenne, selite FROM Asiakastyyppi';
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakastyyppi-taulusta: " + error);
        res.status(500);
        res.json({ "status": "ei toiminut" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results); // onnistunut data lähetetään selaimelle (tai muulle)
      }
    });

  },

  fetchCustomers: function (req, res) {
    //console.log(req.query.asty_avain);
    var sql = 'SELECT avain, nimi, osoite, postinro, postitmp, luontipvm, asty_avain from asiakas where 1 = 1';
    if (req.query.nimi != null)
      sql = sql + " and nimi like '" + req.query.nimi + "%'";
    if (req.query.osoite != null)
      sql = sql + " and osoite like '" + req.query.osoite + "%'";
    if (req.query.asty_avain != null && req.query.asty_avain != "")
      sql += " and asty_avain=" + req.query.asty_avain;

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta: " + error);
        res.status(500);
        res.json({ "status": "ei toiminut" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });


  },

  create: function (req, res) {
    if (req.body.nimi == "" || req.body.nimi == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Nimi puuttuu" });

    } else if (req.body.osoite == "" || req.body.osoite == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Osoite puuttuu" });

    } else if (req.body.postinro == "" || req.body.postinro == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Postinumero puuttuu" });

    } else if (req.body.postitmp == "" || req.body.postitmp == undefined) {
      res.status(400);
     res.send({ "status": "NOT OK", "error": "Postitoimipaikka puuttuu" });

    } else if (req.body.asty_avain == "" || req.body.asty_avain == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Asiakastyyppi puuttuu" });
    }
    else {

      var sql = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES('";
      sql += req.body.nimi + "', '" + req.body.osoite + "' , '" + req.body.postinro + "', '" + req.body.postitmp
      sql += "', " + "CURDATE(),'" + req.body.asty_avain + "')";


      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe haettaessa dataa Asiakas-taulusta: " + error);
          res.status(500);
          res.send({ "status": "Jokin kentistä on tyhjiä tai syötit väärän tiedon", "error": error, "response": null });
        }
        else {
          res.send({ "status": "Ok", "error": ""})
        }
      });
    }
  },

  update: function (req, res) {
  
   // connection.query('UPDATE asiakas SET NIMI ="' + req.body.nimi +'", OSOITE ="'+ req.body.osoite +'", POSTINRO ="'+ req.body.postinro +'",POSTITMP ="' + req.body.postitmp +'", ASTY_AVAIN ="' +req.body.asty_avain +'", WHERE AVAIN='" + req.params.id + "'"; 
    //)
    
  },

  delete: function (req, res) {

    var sql = "DELETE FROM `asiakas` WHERE `AVAIN`='" + req.params.id + "'"; 

    connection.query(sql, function (error, results) {
      if (error) {
        console.log("Virhe poistaessa asiakas Asiakas-taulusta: " + error);
        res.status(400);
        res.json({ "status": "ei toiminut ollenkaan" });
      }
      else {
        res.json(results);
      }
    });

  }
}
