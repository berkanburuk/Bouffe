var User;

function createUser(Sequelize,sequelize,user){
User = sequelize.define(user,{
    username: {
        primaryKey:true,
        type:Sequelize.STRING
    },
    password:{
        type:Sequelize.STRING
    },
    firstName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    lastName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    section:{
        type:Sequelize.INTEGER
    },
    registrationSemester:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});
    User.sync({
        //force:true
    }).then(()=>{
       console.log("User table has created!");
    });
}

function getAllUsers() {
    Role.findAll().then(function (users) {
        console.log(users[0].get('name'));
    });
}
function save(user) {
    console.log('User create');
    User.create(user);
}

function getUser(user){
    return this.User = user;
    //return User;
}

module.exports = {
    createUser,getUser,save
}


