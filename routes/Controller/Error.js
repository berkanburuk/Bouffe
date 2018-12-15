let path = require('path');

module.exports = function(app){

    app.get('/noAuthority', function (request, response) {
        console.log('Error');
            response.sendFile(path.resolve('public/Pages/Authority.html'));
    })

/*
    app.get('*', function(request, response) {
        console.log('Error');
        response.status = 404;
        response.sendFile(path.resolve('public/Pages/Error.html'));
    });
*/

}
