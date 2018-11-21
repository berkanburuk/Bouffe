let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSeq;




function getUsers(usersController) {
    var d;
    usersController.findAll({ raw: true }).then(result =>{
        d=result;
    })
    console.log(d);
    return d;
}

module.exports = function(app) {
    var s = sequelize();
    var usersController = s.model("user");
    var studentsController = s.model("student");
    var instructorController = s.model("instructor");
    var chefController = s.model("chef");

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
console.log("DATAAAA " + data['users']);
        console.log("DATAAAA" + data);

        var st = {};
        st.bilkentId = data.bilkentId;
        st.username = data.username;
        data.courseId= 1;
        st.courseId = data.courseId;
        st.roleId = data.roleId;
        st.currentRoleId = data.currentRoleId;
        console.log("St" + st);

        var us = {};
        us.username = data.username;
        us.password = data.password;
        us.firstName = data.firstName;
        us.lastName = data.lastName;
        us.roleId = parseInt(data.roleId);
    console.log("Us" + us);
        usersController.create(us);
        studentsController.create(st);


        //let user = User.getUserModel();

        response.end('Successfully Added');
        next();
    })


    app.post('/api/:addUser2/', function (request, response, next) {
        var data = request.body;

        usersController.create(data);

        if(data.roleId == 1){
            var newData= {};
            newData.username = data.username;
            newData.roleId=data.roleId;
            console.log(newData);
            instructorController.create(newData);
        }
        else if(data.roleId == 3){
            var newData= {};
            newData.username = data.username;
            newData.roleId=data.roleId;
            newData.approve = true;
            console.log(newData);
            chefController.create(newData);
        }

        //let user = User.getUserModel();

        response.end('Successfully Added');
        next();
    })

    //checkUser
    app.get('/api/:getAllUsers', function (req, res, next) {
        //console.log("Method Type = "+req.method);
            var d = getUsers(usersController);
            res.end(d);
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