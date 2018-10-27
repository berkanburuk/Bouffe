var http = require('http')
var finalhandler = require('finalhandler')
var express = require('express');
// create the router and server
var router = express.Router();

class User{
  constructor(name,surname,type,semester,username,password){
    this.name = name;
    this.surname = surname;
    this.type=type;
    this.semester = semester;
    this.username = username;
    this.password = password;
  }
}


// register a route and add all methods
router.route('/user/:id')
    .get(function (req, res) {
        // this is GET /pet/:id
        res.setHeader('Content-Type', 'application/json')
        //res._write('hel');
        res.end(JSON.stringify({ name: 'hello' }))

    })
    .delete(function (req, res) {
        // this is DELETE /pet/:id
        res.end()
    })
    .all(function (req, res) {
        // this is called for all other methods not
        // defined above for /pet/:id
        res.statusCode = 405
        res.end()
    })



module.exports = router;