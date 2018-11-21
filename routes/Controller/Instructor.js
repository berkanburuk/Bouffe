let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSeq;

module.exports = function (app) {

    app.get('/instructor', function (request, response) {
        console.log('Instructor');
        response.sendFile(path.resolve('../../public/Pages/Instructor.html'));
        //res.end();
    }),

//Post - Menu
        app.post('/api/addInstructor', function (request, response, next) {
            //console.log(request.body.cultureName);
            console.log('Instructor -> ');
            var data = request.body;
            console.log(request.body);
            console.log(data);
            for (var key in data) {
                console.log(data[key]);
            }

            if (data != undefined)
                Instructor.save(data);
            else
                console.log('undefined data')

            response.end(JSON.stringify(data));
            next();
        });


}
