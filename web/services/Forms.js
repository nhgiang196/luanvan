/**
 * Created by wangyanyan on 14-3-3.
 */
define( ['app','angular'],function(app,angular){
    app.service("Forms", function() {
        var booleanTypeConverter = function(value) {
            if(!value) {
                return false;
            } else {
                return true === value ||
                    'true' === value ||
                    'TRUE' === value;
            }
        };

        var numberTypeConverter = function(value) {
            return parseInt(value);
        };

        var stringTypeConverter = function(value) {
            return value.toString();
        };
        function convertValue(variable) {
            var converter = typeConverters[variable.type];
            if(!!converter) {
                return converter(variable.value);
            } else {
                return variable.value;
            }
        }
        var typeConverters = {
            'boolean' : booleanTypeConverter,
            'number' : numberTypeConverter,
            'Integer' : numberTypeConverter,
            'string' : stringTypeConverter,
            'text':stringTypeConverter
        };
        var Forms = {
            /**
             *
             * @param variables {Array<Variable>} the variables to convert to a variable map
             */
            variablesToMap: function(variables) {
                var variablesMap = {};

                for (var i = 0, variable; !!(variable = variables[i]); i++) {

                    if(!variable.readOnly) {

                        var name = variable.name;
                        var value = convertValue(variable);
                       //     value = variable.value
                       /* if (!value) {
                            value = false;
                        }*/

                        variablesMap[name] = value;
                    }
                }

                return variablesMap;
            },
            mapToVariablesArray: function(variables_map) {
                var variablesArray = [];

                angular.forEach(variables_map, function(variable, name) {
                    if(typeof(variable.type)!="undefined")
                    {
                        variablesArray.push({ name : name, value : variable.value});
                    }
                });
                return variablesArray;
            },
            getVariableByName:function (name, variables) {

                for (var i = 0, variable; !!(variable = variables[i]); i++) {
                    if (variable.name == name) {
                        return variable;
                    }
                }

                return null;
            }


        }
        return Forms;

    });



    app.factory("localStorage",function(){
        var localStorage = window.localStorage;
        if(localStorage){
            var db = {
                createTable : function(tableName){
                    if (tableName) {
                        var raw = localStorage.getItem(tableName);
                        if(!raw){
                            localStorage.setItem(tableName, "");
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                },
                removeTable:function(tableName){
                    if (tableName) {
                        localStorage.removeItem(tableName);
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                saveTable: function (tableName,content) {
                    if (tableName && content) {
                        localStorage.setItem(tableName, content);
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                getTable: function (tableName) {
                    if (tableName) {
                        return localStorage.getItem(tableName);
                    }
                    else {
                        return "";
                    }
                },
                clearTable:function(tableName){
                    if (tableName) {
                        localStorage.setItem(tableName, "");
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            return db;
        }
        else{
            return null;
        }
    });
})