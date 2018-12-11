
function isAdmin(roleId) {
    if(roleId==1){
        return true;
    }else{
        return false;
    }
}
function isChef(roleId) {
    if(roleId==3){
        return true;
    }else{
        return false;
    }
}
function isMatre(roleId) {
    if(roleId==4){
        return true;
    }else{
        return false;
    }
}

function isWaiter(roleId) {
    if(roleId==5){
        return true;
    }else{
        return false;
    }
}
function isBartender(roleId) {
    if(roleId==6){
        return true;
    }else{
        return false;
    }
}
function errorMesage(){
    return "This user does not have an authority to do this action!";
}

module.exports = {
    isAdmin,isWaiter,isMatre,isChef,isBartender,errorMesage
}