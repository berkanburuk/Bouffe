    var Food = require('../Model/Food');
    var sequelize = require('../Util/DatabaseConnection').getSeq;



    function getFoods(foodsController) {
        var d;
        foodsController.findAll({ raw: true }).then(result =>{
                d = result;
        })
        /*
        foodsController.findAndCountAll()
            .then((data) => {
                foodsController.findAll({
                    attributes: ['name', 'type', 'description','price'],
                    $sort: { id: 1 }
                },{ raw: true })
                    .then((foods) => {
                        console.log('Food->' + foods);
                        d=foods;
                    });
            })
            .catch(function (error) {
            });
            */
        return d;
    }


    module.exports = function(app){
        var s = sequelize();
        var foodsController = s.model("food");

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

        app.get('/api/:getAllFoods', function (req, res, next) {
            var d = getFoods(foodsController);
            res.end(d);
            next();
        })


    }



