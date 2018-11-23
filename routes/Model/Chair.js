var Chair;

class ChairModel {
    createChair(Sequelize, sequelize, chair) {
        Chair = sequelize.define(chair, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            tableId: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER
            },
            position: {
                type: Sequelize.INTEGER
            }
        })
        Chair.sync({
            //force:true
        }).then(() => {
            console.log("Chair Table is created!")
        });
        return Chair;
    }

    constructor(Sequelize, sequelize, chair) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Chair = this.createChair(Sequelize, sequelize, chair);
            this.singletonInstance = Chair;
            console.log("Singleton Class_Cha Created!");
        } else {
            Chair = sequelize.model("chair");
            console.log("Only one Chair Class can be created!");
        }

    }

}

function run(Sequelize, sequelize, user) {
    var f = new ChairModel(Sequelize, sequelize, user);
    console.log("Chair : " + f);
    // console.log(f.getUserTable())
}

function save(chair) {
    Chair.create({
        name: chair.name,
        status: chair.status,
        position: chair.position
    })
        .then(newUser => {
            console.log(newUser.name);
        });
}

module.exports = {
    run
}