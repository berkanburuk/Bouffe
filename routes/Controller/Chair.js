var Chair = require('../Model/Chair');

module.exports = function(app){
    app.get('/chair', function (request, response) {
        console.log('Chair');
        response.sendFile(path.resolve('../../public/Pages/Chair.html'));
        //res.end();
    }),
    app.post('/api/addChair'), function(request,response,next){
        var data = request.body;
        for (var key in data) {
            console.log(data[key]);
        }
        Chair.save(data);
        //check name of food and get price
        next();

    }
}



