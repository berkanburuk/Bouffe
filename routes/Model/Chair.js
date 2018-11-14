var Chair;



function createChair(Sequelize,sequelize,chair) {
    Chair = sequelize.define(chair,{
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
    Chair.sync({
        //force:true
    }).then(()=>{
        console.log("Chair Table is created!")
    });
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
    createChair,getChair,save
}