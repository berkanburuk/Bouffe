
var UserCourse;


class UserCourseModel{
    createUserCourse(Sequelize, sequelize, course) {
        UserCourse = sequelize.define(course, {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            courseId:{
                type:Sequelize.INTEGER,
                references: {
                    model: 'courses', // name of Target model
                    key: 'id' // key in Target model that we're referencing
                }
            },
            username:{
                type:Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username'
                }
            }

        });
        UserCourse.sync({
            //force:true
        }).then(() => {
            console.log("UserCourse Table is created!")
        });
        return UserCourse;
    }
    constructor(Sequelize, sequelize, course) {
        // Check if the instance exists or is null
        if (!this.singletonInstance) {
            UserCourse = this.createUserCourse(Sequelize, sequelize, course);
            this.singletonInstance = UserCourse;
            console.log("Singleton UserCourse Created!" + UserCourse);
        } else {
            UserCourse = sequelize.model("course");
            console.log("Only one UserCourse Class can be created!");
        }
    }
}

function run(Sequelize, sequelize, userCourse) {
    var f = new UserCourseModel(Sequelize, sequelize, userCourse);
    console.log("Course : " + f);
}

function getCourses() {
    UserCourseModel.findAll().then(function (courses) {
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
    run
}
