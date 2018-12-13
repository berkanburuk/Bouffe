let Payment;

class PaymentModel {
    createPayment(Sequelize, sequelize, role) {
        Payment = sequelize.define(role, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            totalPrice : {
                type:Sequelize.DOUBLE,
                defaultValue:0.0
            },
            paymentType:{
                type:Sequelize.INTEGER,
                defaultValue: 0
                //0->Cash
                //1->Credit Card
            }
        });
        /*
        Payment.sync({
            //force:true
        })
            .then(() => {
                console.log("Role Table is created!");
            });
            */
        return Payment;
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