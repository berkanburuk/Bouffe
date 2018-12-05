var Chair;

class ChairModel {
    createChair(Sequelize, sequelize, chair) {
        Chair = sequelize.define(chair, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER,
                isNull:false
            },
            position: {
                type: Sequelize.STRING,
                isNull:false
            }
        })
        let mTable = sequelize.model('table');
        Chair.belongsTo(mTable);
/*
        Chair.sync({
            //force:true
        }).then(() => {
            console.log("Chair Table is created!")
        });
  */
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
const createDefaultSquareChairs = (data)=>{
    return new Promise((resolve,reject)=>{
        Chair.create(data).then(data=> {
            console.log(data.get(0))
            resolve(data);
        }).catch(error => {
            reject(error + 'Cannot create the Chair!');
        });
    })
}

function run(Sequelize, sequelize, user) {
    var f = new ChairModel(Sequelize, sequelize, user);
    console.log("Chair : " + f);
    return Chair;
    // console.log(f.getUserTable())
}

function defaultValuesForChair(){
    let square = {
        chairType:'square'
    };
    let circular = {
        chairType:'circular'
    };
    for(var i=0;i<2;i++){
        createDefaultSquareChairs(square);
    }
    for(var i=0;i<1;i++){
        createDefaultSquareChairs(circular);
    }
}


module.exports = {
    run,defaultValuesForChair
}