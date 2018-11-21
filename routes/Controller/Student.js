let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSeq;
//let stController = require('../Model/Student');
module.exports = function(app){
    let getAllStudents;

    app.get('/student', function (request, response) {
        console.log('Student -> ' + Student);
        //console.log(St.getAllStudents2());
        response.sendFile(path.resolve('../../public/Pages/Student.html'));
        //res.end();
    }),
        app.get('/getAllStudent', function (request, response) {
            let s = sequelize();
            let studentsController = s.model("student");

            //studentsController.create(data);
            //res.end(student.getAllStudents());
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




