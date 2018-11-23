let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSequelize;

//let stController = require('../Model/Student');
module.exports = function(app){
    let getAllStudents;

    app.get('/student', function (request, response) {
        var s = sequelize();
        var studentsController = s.model("order");

        console.log('Student -> ' + Student);
        //console.log(St.getAllStudents2());
        response.sendFile(path.resolve('../../public/Pages/Student.html'));
        //res.end();
    }),

    app.get('/api/:getAllStudent', function (req, res, next) {
        studentsController.findAll({ raw: true }).then(result =>{
            console.log(result);
            res.end(result);
        })
        next();
    })

    app.post('/api/:addStudent/', function (request, response, next) {
        let data = request.body;
        console.log(data);
        let s = sequelize();
        let studentsController = s.model("student");
        studentsController.create(data);
        //let user = User.getUserModel();

        response.end('Successfully Added');
        next();
    })

    }




