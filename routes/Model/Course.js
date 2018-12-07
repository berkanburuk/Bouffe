var Course;

class CourseModel{
    createCourse(Sequelize, sequelize, course) {
        Course = sequelize.define(course, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            courseName:{
                type:Sequelize.STRING
            }
        });
        let mUser= sequelize.model('user');
        let mUserCourse= sequelize.model('userCourse');
        Course.belongsToMany(mUser,{through: mUserCourse});
/*
        Course.sync({
            //force:true
        }).then(() => {
            console.log("Course Table is created!")
        });
        mUserCourse.sync({
            //force:true
        }).then(() => {
            console.log("UserCourse Table is created!")
        });
        */
        return Course;
    }
    constructor(Sequelize, sequelize, course) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            Course = this.createCourse(Sequelize, sequelize, course);
            this.singletonInstance = Course;
            console.log("Singleton Course Created!" + Course);
        } else {
            Course = sequelize.model("course");
            console.log("Only one Course Class can be created!");
        }
    }
}

function createCourseData(){

    Course.create({
        id:246,
        courseName:'Restaurant Service'
    }).catch(err=>{

    });
    Course.create({
        id:323,
        courseName:'International Cuisines'
    }).catch(err=>{

    });

}
function run(Sequelize, sequelize, course) {
    var f = new CourseModel(Sequelize, sequelize, course);
    console.log("Course : " + f);
    // console.log(f.getUserTable())
}


function getCourses() {
    Course.findAll().then(function (courses) {
        console.log(courses[0].get('name'));
    });
}

module.exports = {
    run,createCourseData
}