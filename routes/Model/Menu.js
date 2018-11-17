var Menu;

function createMenu(Sequelize,sequelize,menu){
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

    })
    //Menu.hasMany(MenuFood);

    //Menu.belongsTo(MenuFood.getMenuFood(), {foreignKey: 'fk_Menu',targetKey:'menuId'});
    Menu.sync({
        //force: true
    }).then(()=>{
        console.log("Menu Table is created!")
    });
}
function getAllMenu() {
    Menu.findAll().then(function (menu) {
        console.log(menu[0].get('name'));
    });
}
function save(menu){

    //Menu.create(menu)
}

function getMenu(){
    return Menu;
}

module.exports = {
    createMenu,getMenu,save,getMenu
}