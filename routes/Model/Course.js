var Course;
var sequ = require('../Util/DatabaseConnection').getSeq;


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
            },
            username: {
                type: Sequelize.STRING
            }
        });
        Course.sync({
            //force:true
        }).then(() => {
            console.log("Course Table is created!")
        });
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

function getCourseModel(){
    let s = sequ();
    let mCourse = s.model("course");
    return mCourse;
}

function save(data) {
    let mCourse = getCourseModel();
    mCourse.create(data)
        .then(newUser => {
            console.log(newUser.id);
        });
}

function getCourse(){
    return Course;
}



module.exports = {
    run, save,getCourses,getCourseModel,getCourse
}