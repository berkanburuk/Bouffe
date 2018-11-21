var sequelize = require('../Util/DatabaseConnection').getSeq;

class Appointment{
    constructor() {
        console.log("Appointment Constructor");
    }
    sayname(){
        console.log("sayname");
    }
}

let p = new Appointment();
p.sayname();

