let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSeq;

function getUsers(User) {

    User.findAndCountAll().then(result =>{
       console.log(result.count);
       console.log("User " + result.rows);

    });

}

module.exports = function(app) {
    var s = sequelize();
    var usersController = s.model("user");

    app.get('/user', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/index.html'));
        //res.end();
    }),

    app.post('/api/:addUser/', function (request, response, next) {
        var data = request.body;
        /*
        for (var key in data) {
            console.log(data[key]);
        }*/
        console.log(data);
        usersController.create(data);
        //let user = User.getUserModel();

        response.end('Successfully Added');
        next();
    })

    //checkUser
    app.get('/api/:getAllUsers', function (req, res, next) {
        console.log(req.method);
        var u = getUsers(usersController);
        console.log(u);
        res.end(u);
        next();
    })

    //checkUser
    app.get('/api/:username/:password', function (req, res, next) {
        console.log(req.method);
        res.statusCode = 200
        //res.setHeader('Content-Type', 'text/plain; charset=utf-8')

        res.end('Hello' + '\n');
        next();
    })



}

/*
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

*/