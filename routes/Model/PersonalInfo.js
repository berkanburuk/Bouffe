var PersonalInfo;

function createPersonalInfo(Sequelize,sequelize,personalInfo) {
    PersonalInfo = sequelize.define(personalInfo, {
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:Sequelize.INTEGER
        },

        firstName: {
            type: Sequelize.STRING,
            allowNull:false
        },
        lastName: {
            type: Sequelize.STRING
        },
        section :{
            type: Sequelize.INTEGER
        },
        registrationSemester:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });
    //PersonalInfo.belongsTo(Users, {foreignKey: 'fk_Personal',targetKey:'personalInfoId'});
    PersonalInfo.sync({
        //force: true
    }).then(()=>{
        console.log("Personal Info table has created!");
    })


}

function save(personalInfo){
    PersonalInfo.create(personalInfo)
        .then(newUser => {
            console.log(newUser.name);
        });
}
function getPersonalInfo(){
    return PersonalInfo;
}

module.exports = {
    createPersonalInfo,getPersonalInfo,save
}