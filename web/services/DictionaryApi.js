/**
 * Created by wang.chen on 2016/11/30.
 */
define(['app', 'angular'], function (app, angular) {
    app.service("DictionaryApi", ['$resource', '$q', 'Auth', '$location', function ($resource, $q, Auth, $location) {
        function DictionaryApi() {
            this.saveNewWord = $resource("/ehs/Dictionary/save", {
                save: {method: 'post'}
            });
            this.getWords = $resource("/ehs/Dictionary/get", {}, {
                get: {method: 'POST', isArray: true}
            });

            this.deleteWords = $resource("/ehs/Dictionary/delete", {},{
                delete: {method: 'POST'}
            });

            this.jsonWords=$resource("/ehs/Dictionary/getJson",{},{
                get:{method:'POST'}
            })
        }
        DictionaryApi.prototype.SavejsonWords = function () {
            return this.jsonWords;
        };
        DictionaryApi.prototype.SaveNewWord = function () {
            return this.saveNewWord;
        };
        DictionaryApi.prototype.GetWords = function () {
            return this.getWords;
        };
        DictionaryApi.prototype.UpdateWords = function () {
            return this.updateWords;
        };
        DictionaryApi.prototype.DeleteWords = function () {
            return this.deleteWords;
        };
        return new DictionaryApi();
    }])


});