module.exports = function(app){
    app.get('*', function(req, res) {
        console.log('Error');
        var err = ('404');
        err.status = 404;
        res.render('error');
        next(err);
    });

}
