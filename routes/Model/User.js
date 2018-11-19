var UserTable;

 class User {
    createUser(Sequelize,sequelize,user){
        //Creates the Content of Form
        UserTable = sequelize.define(user,{
            username: {
                primaryKey:true,
                type:Sequelize.STRING
            },
            password:{
                type:Sequelize.STRING
            },
            firstName:{
                type:Sequelize.STRING,
                //allowNull:false
            },
            lastName:{
                type:Sequelize.STRING,
                //allowNull:false
            },
            section:{
                type:Sequelize.INTEGER
            },
            registrationSemester:{
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
        UserTable.sync({
            //force:true
        }).then(()=>{
            console.log("User table has created!");
        });
        return UserTable;
    }

    constructor(Sequelize,sequelize,user) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            UserTable = this.createUser(Sequelize,sequelize,user);
            this.singletonInstance = UserTable;
            console.log("Singleton Class Created!");
        } else {
            UserTable = sequelize.model("user");
            console.log("Only one Food Class can be created!");
        }

    }

    findByName() {
        UserTable.findOne({
            name: 'deneme'
        })
            .then(user => {
                console.log('Found user: ${user}');
            })
    }
    getAllUsers() {
        UserTable.findAll().then(function (food) {
            console.log(food[0].get('name'));
        });
    }
    save(user){
        UserTable.create(user);
        /*
        UserTable.create({
            username:'berkan',
            password:'asd',
            firstName: 'berkan',
            lastName:'buruk',
            section:1
        }).then(() => {
            console.log("Food is Added!");
        })
        */
    }
    getUserTable(){
        return UserTable;
    }
}

function run(Sequelize,sequelize,user){
    var f = new User(Sequelize,sequelize,user);
    console.log("User : " + f);
    console.log(f.getUserTable())

}
function save(user,data){
     user.create(data);
}



module.exports = {
    run,User,save
}
