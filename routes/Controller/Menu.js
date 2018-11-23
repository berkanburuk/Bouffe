let path = require('path');
var sequelize = require('../Util/DatabaseConnection').getSequelize;




module.exports = function (app) {
    var s = sequelize();
    var menusController = s.model("menu");

    app.get('/menu', function (request, response) {
        console.log('Menu');
        response.sendFile(path.resolve('../../public/Pages/Menu.html'));

    }),

        function getMenu(Menu) {
        var u ={};
            Menu.findAndCountAll().then(function (result) {
                //console.log(result.count);
                for (var i=0;i<result.count;i++){
                    u.name = result[0].get('name');
                    u.type =result[0].get('type');
                    u.description = result[0].get('description');
                        u.available =result[0].get('available');
                        u.price = result[0].get('price');
                }
            });
            return u;
        }
        app.post('/api/:addMenu/', function (request, response, next) {
            var data = request.body;
            //menusController.create(data);
            response.status= 200;
            response.end();
            next();
        })
}
