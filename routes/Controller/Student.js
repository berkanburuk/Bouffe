let path = require('path');
var Student = require('../Model/Student');

module.exports = function(app){
    app.get('/student', function (request, response) {


        console.log('Student -> ' + Student);
        //console.log(St.getAllStudents2());

        response.sendFile(path.resolve('../../public/Pages/Student.html'));

        //res.end();
    }),
        app.get('/getAllStudent', function (request, response) {
            console.log(student.getAllStudents());
            res.end(student.getAllStudents());
        })


    }




