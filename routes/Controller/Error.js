let path = require('path');

module.exports = function(app){

    app.get('/noAuthority', function (request, response) {
        console.log('Error');
            response.sendFile(path.resolve('public/Pages/Authority.html'));
    })

    /*
    app.get('*', function(req, res) {
        console.log('Error');
        var err = ('404');
        err.status = 404;
        res.render('error');
        next(err);
    });
*/

}
