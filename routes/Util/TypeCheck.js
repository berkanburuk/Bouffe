

// Returns if a value is a string
exports.isString  = function (value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is really a number
exports.isNumber = function (value) {
    return typeof value === 'number' && isFinite(value);
}


// Returns if a value is an array
exports.isArray = function (value) {
    Array.isArray(value);
}

// Returns if a value is a function
exports.isFunction = function (value) {
    return typeof value === 'function';
}


// Returns if a value is an object
exports.isObject = function (value) {
    return value && typeof value === 'object' && value.constructor === Object;
}


// Returns if a value is null
exports.isNull = function (value) {
    return value === null;
}

// Returns if a value is undefined
exports.isUndefined = function (value) {
    return typeof value === 'undefined';
}

// Returns if a value is a boolean
exports.isBoolean = function (value) {
    return typeof value === 'boolean';
}

// Returns if a value is a regexp
exports.isRegExp = function (value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
}

// Returns if value is an error object
exports.isError = function (value) {
    return value instanceof Error && typeof value.message !== 'undefined';
}

// Returns if value is a date object
exports.isDate = function(value) {
    return value instanceof Date;
}

// Returns if a Symbol
exports.isSymbol = function (value) {
    return typeof value === 'symbol';
}

exports.errorMesage =function(){
    return "The value entered is not valid";
}
exports.errorMesageEmpty =function(){
    return "Value(s) cannot be empty!";
}
exports.isObjectValuesEmpty  = function(data){
    var keysArray = Object.keys(data)
    var valuesArray = Object.values(data)

    for(let i = 0; i < valuesArray.length; i++){
        if (valuesArray[i].trim()==''){
            return false;
        }
    }
    return true;
}
/*
JSON ARRAY için

 let myArray = [{"child": ["one", "two", "three", "four"]},
               {"child": ["five", "six", "seven", "eight"]}];

for(let i = 0; i < myArray.length; i++){

   let childArray = myArray[i].child;

   for(let j = 0; j < childArray.length; j++){

  console.log(childArray[j]);

   }

}
*
* */
