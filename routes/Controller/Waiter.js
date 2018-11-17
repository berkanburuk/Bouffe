var Waiter = require('../Model/Waiter');

module.exports = function(app){
    app.get('/waiter', function (request, response) {
        console.log('Instructor');
        response.sendFile(path.resolve('../../public/Pages/Waiter.html'));
        //res.end();
    }),

        app.post('/api/addWaiter'), function(request,response,next){
        var data = request.body;
        Waiter.save(data);
        response.end('Waiter Successfully Added!');
        next();

    }

}



