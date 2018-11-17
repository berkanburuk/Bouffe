var Beverage;

function createBeverage(Sequelize,sequelize,beverage) {
    Beverage = sequelize.define(beverage,{
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        available: {
            type: Sequelize.BOOLEAN
        },
        price: {
            type: Sequelize.DOUBLE
        }
    })

    Beverage.sync({
        //force:true
    }).then(()=>{
        console.log("Beverage Table is created!")
    });
}

function save(beverage){
    console.log("Function Of Beverage - Save");
    Beverage.create(beverage)
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getAllBeverages() {
    Beverage.findAll().then(function (beverage) {
        console.log(beverage[0].get('name'));
    });
}

function getBeverage(){
    return Beverage;
}


module.exports = {
    createBeverage,save,getBeverage,getAllBeverages
}