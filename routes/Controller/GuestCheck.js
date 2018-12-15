let path = require('path');
let sequelize = require('../Util/DatabaseConnection').getSequelize;
let tableNames = require('../Util/DatabaseConnection').getTableNames;

let db = sequelize();
let dbNames = tableNames();
let mGuestCheck = db.model(dbNames.guestCheck);


let checkUsersRole = require('./RoleCheck');

function nextGuestList(data) {
    return new Promise((resolve, reject) => {
        mGuestCheck.create()
            .then(dbData => {
                console.log(JSON.stringify(dbData));
                resolve(JSON.stringify(dbData));
            }).catch(error => {
            reject(error);
        })

    })
}


module.exports = function(app) {

        app.get('/api/guestCheck/nextGuestList', function (request, response) {
            if (request.session != undefined  && (checkUsersRole.isMatre(request.session.roleId)
                ||  checkUsersRole.isCashier(request.session.roleId))) {
                console.log("Create New Guest List");
                nextGuestList().then(data => {
                    response.statusCode = 200;
                    response.write(data.toString(), () => {
                        response.end();
                    });
                }).catch(error => {
                    response.statusCode = 404;
                    console.log(error);
                    response.write(error.toString(), () => {
                        response.end();
                    });
                })
            }
            else {
                response.write(checkUsersRole.errorMesage(), () => {
                    response.statusCode = 404;
                    response.end();
                })
            }

        })
}



