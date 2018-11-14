var DeviceList;



function createDeviceList(Sequelize,sequelize,deviceList) {
    DeviceList = sequelize.define(deviceList,{
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        macAddress: {
            type: Sequelize.STRING
        },
        deviceStatus: {
            type: Sequelize.BOOLEAN
        }
    })
    DeviceList.sync({
        //force:true
    }).then(()=>{
        console.log("DeviceList Table is created!")
    });
}

function save(deviceList){
    //DeviceList.create(deviceList);
    DeviceList.create({
        name: deviceList.name,
        macAddress:deviceList.macAddress,
        deviceStatus:deviceList.deviceStatus
    })
        .then(newUser => {
            console.log(newUser.name);
        });
}

function getDeviceList(){
    return DeviceList;
}

module.exports = {
    createDeviceList,getDeviceList
}