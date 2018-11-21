var Bartender;
var sequ = require('../Util/DatabaseConnection').getSeq;


class BartenderModel{
    createBartender(Sequelize, sequelize, bartender) {
        Bartender = sequelize.define(bartender, {
            username: {
                type: Sequelize.STRING
            },
            approve: {
                type: Sequelize.BOOLEAN
            }
        });
        Bartender.sync({
            //force:true
        }).then(() => {
            console.log("Bartender Table is created!")
        });
        return Bartender;
    }
    constructor(Sequelize, sequelize, bartender) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Bartender = this.createBartender(Sequelize, sequelize, bartender);
            this.singletonInstance = Bartender;
            console.log("Singleton Bartender Created!" + Bartender);
        } else {
            Bartender = sequelize.model("bartender");
            console.log("Only one Bartender Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, bartender) {
    var f = new BartenderModel(Sequelize, sequelize, bartender);
    console.log("Bartender : " + f);
    // console.log(f.getUserTable())
}

function getBartenders() {
    Bartender.findAll().then(function (bartenders) {
        console.log(bartenders[0].get('name'));
    });
}

function getBartenderModel(){
    let s = sequ();
    let mBartender = s.model("bartender");
    return mBartender;
}

function save(data) {
    let mBartender = getBartenderModel();
    mBartender.create(data)
        .then(newUser => {
            console.log(newUser.username);
        });
}



module.exports = {
    run, save,getBartenders,getBartenderModel
}