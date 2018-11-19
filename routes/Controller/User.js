var User = require('../Model/User');
var seq = require('../Util/DatabaseConnection').getSeq;



module.exports = function(app) {

    app.get('/user', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/User.html'));
        //res.end();
    }),

    app.post('/api/:addUser/', function (request, response, next) {
        var data = request.body;
        /*
        for (var key in data) {
            console.log(data[key]);
        }*/
        console.log(data);
        //User.run();
        var s = seq();
        var user1 = s.model("user");
        //user1.create(data);

    User.save(user1,data);

        response.end('Successfully Added');
        next();
    })

    //checkUser
    app.get('/api/:username/:password', function (req, res, next) {
        console.log(req.method);
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
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