let Payment;

class PaymentModel {
    createPayment(Sequelize, sequelize, role) {
        Payment = sequelize.define(role, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            cash: {
                type:Sequelize.DOUBLE,
                defaultValue:0.0
            },
            creditCard: {
                type:Sequelize.DOUBLE,
                defaultValue:0.0
            },
            ticket: {
                type:Sequelize.DOUBLE,
                defaultValue:0.0
            },
            complimentary: {
                type:Sequelize.DOUBLE,
                defaultValue:0.0
            }
        });
        let mTable = sequelize.model('table');
        Payment.belongsTo(mTable, {foreignKey: 'fk_Order'});


    }
    constructor(Sequelize, sequelize, payment) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Payment = this.createPayment(Sequelize, sequelize, payment);
            this.singletonInstance = Payment;
            console.log("Singleton Class_Rol Created!");
        } else {
            Payment = sequelize.model("payment");
            console.log("Only one Role Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, payment) {
    var f = new PaymentModel(Sequelize, sequelize, payment);
    console.log("Payment : " + f);
}


module.exports = {
    run
}