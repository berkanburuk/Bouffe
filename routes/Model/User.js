var User;

function createUser(Sequelize,sequelize,user){
User = sequelize.define(user,{
    id:{
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    personalInfoId:{
        unique:true,
        type:Sequelize.INTEGER
    },
    roleId:{
        unique:true,
        type:Sequelize.INTEGER
    },

    username:{
        type:Sequelize.STRING,
        allowNull: false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});
    User.sync({
        //force:true
    }).then(()=>{
       console.log("User table has created!");
    });
}

function save(user) {
    User.create(user);
}

function getUser(){
    return User;
}

module.exports = {
    createUser,getUser,save
}


