var ChairT;

class Chair{
    createChair(Sequelize,sequelize,chair) {
        ChairT = sequelize.define(chair,{
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            tableId:{
                type:Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.INTEGER
            },
            position: {
                type: Sequelize.INTEGER
            }
        })
        ChairT.sync({
            //force:true
        }).then(()=>{
            console.log("Chair Table is created!")
        });
    }

    constructor(Sequelize, sequelize, user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            ChairT = this.createUser(Sequelize, sequelize, user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            ChairT = sequelize.model("user");
            console.log("Only one Food Class can be created!");
        }

    }

}

function save(chair){

    Chair.create({
        name: chair.name,
        status:chair.status,
        position:chair.position
    })
        .then(newUser => {
            console.log(newUser.name);
        });
}


function getChair(){
    return Chair;
}


module.exports = {
    Chair,getChair,save
}