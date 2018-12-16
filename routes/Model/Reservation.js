let Reservation;

class ReservationModel {
    createReservation(Sequelize, sequelize, reservation) {
        Reservation = sequelize.define(reservation, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            fullName : {
                type:Sequelize.STRING,
            },
            phoneNumber:{
                type:Sequelize.BIGINT,
            },
            reservationDate:{
                type:Sequelize.DATEONLY
            },
            numberOfCustomer:{
                type:Sequelize.INTEGER
            }
        });

        let mTable = sequelize.model('table');
        Reservation.belongsTo(mTable,{foreignKey: {allowNull: false}});

        return Reservation;
    }
    constructor(Sequelize, sequelize, reservation) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Reservation = this.createReservation(Sequelize, sequelize, reservation);
            this.singletonInstance = Reservation;
            console.log("Singleton Reservation Created!");
        } else {
            Reservation = sequelize.model("reservation");
            console.log("Only one Reservation Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, reservation) {
    var f = new ReservationModel(Sequelize, sequelize, reservation);
    console.log("Payment : " + f);
}


module.exports = {
    run
}