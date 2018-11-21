    var Food = require('../Model/Food');
    var sequelize = require('../Util/DatabaseConnection').getSeq;

    module.exports = function(app){
        app.get('/food', function (request, response) {
            console.log('Instructor');
            response.sendFile(path.resolve('../../public/Pages/Food.html'));
            //res.end();
        }),


            app.post('/api/addFood'), function(request,response,next){
            var data = request.body;
            Food.save(data);
            response.end('Food Successfully Added!');
            next();

        }

    }



