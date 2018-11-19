var Menu;


function createMenu(Sequelize,sequelize,menu){
    // noinspection JSAnnotator
    return new Promise(function(resolve,reject){
        Menu = sequelize.define(menu, {
            //constructor(id, name, type, desc, available, price) {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cousinRegion: {
                type: Sequelize.STRING,
                allowNull: false
            }

        }).catch(error => {
            reject("burası reject");
        })
        Menu.sync({
            //force: true
        }).then(()=>{
           resolve(Menu)
        });

    });

    //Menu.hasMany(MenuFood);
    //Menu.belongsTo(MenuFood.getMenuFood(), {foreignKey: 'fk_Menu',targetKey:'menuId'});

}
/*
createMenu.then((result) => {

}).catch(error => {
    console.log(error)
})
*/

function getAllMenu() {
    Menu.findAll().then(function (menu) {
        console.log(menu[0].get('name'));
    });
}

function save() {
    
}
function getMenu(){
    return Menu;
}

module.exports = {
    createMenu,getMenu,save,getMenu
}